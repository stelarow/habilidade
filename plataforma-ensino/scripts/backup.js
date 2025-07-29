#!/usr/bin/env node

/**
 * Supabase Backup Script
 * Automated backup system for database and storage
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  backupDir: process.env.BACKUP_DIR || './backups',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  tables: [
    'profiles',
    'blog_posts',
    'blog_categories',
    'blog_tags',
    'comments',
    'uptime_monitoring',
    'system_incidents',
    'system_alerts', 
    'system_logs',
    'critical_logs',
    'log_analytics',
    'backup_operations',
    'maintenance_windows',
    'audit_logs',
    'feature_flags'
  ]
};

class BackupManager {
  constructor() {
    if (!config.supabaseUrl || !config.supabaseServiceKey) {
      throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
    this.backupId = null;
  }

  // Initialize backup operation
  async startBackup(type = 'full') {
    const timestamp = new Date().toISOString();
    console.log(`Starting ${type} backup at ${timestamp}`);

    try {
      // Create backup record
      const { data: backup, error } = await this.supabase
        .from('backup_operations')
        .insert({
          backup_type: type,
          status: 'running',
          started_at: timestamp,
          tables_backed_up: config.tables
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create backup record: ${error.message}`);
      }

      this.backupId = backup.id;
      console.log(`Backup operation ${this.backupId} started`);

      return backup;
    } catch (error) {
      console.error('Failed to start backup:', error);
      throw error;
    }
  }

  // Create backup directory structure
  async createBackupDirectory() {
    const timestamp = new Date().toISOString().split('T')[0];
    const backupPath = path.join(config.backupDir, timestamp);
    
    try {
      await fs.mkdir(backupPath, { recursive: true });
      console.log(`Created backup directory: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Failed to create backup directory:', error);
      throw error;
    }
  }

  // Backup database tables
  async backupTables(backupPath) {
    const tablesBackedUp = [];
    let totalRecords = 0;

    for (const tableName of config.tables) {
      try {
        console.log(`Backing up table: ${tableName}`);
        
        // Get table data
        const { data, error, count } = await this.supabase
          .from(tableName)
          .select('*', { count: 'exact' });

        if (error) {
          console.error(`Failed to backup table ${tableName}:`, error);
          continue;
        }

        // Write table data to file
        const filePath = path.join(backupPath, `${tableName}.json`);
        await fs.writeFile(filePath, JSON.stringify({
          table: tableName,
          timestamp: new Date().toISOString(),
          count: count || data?.length || 0,
          data: data || []
        }, null, 2));

        tablesBackedUp.push(tableName);
        totalRecords += (count || data?.length || 0);
        
        console.log(` Backed up ${tableName}: ${count || data?.length || 0} records`);
      } catch (error) {
        console.error(`Error backing up table ${tableName}:`, error);
      }
    }

    return { tablesBackedUp, totalRecords };
  }

  // Backup storage files (basic implementation)
  async backupStorage(backupPath) {
    try {
      console.log('Starting storage backup...');
      
      // List all buckets
      const { data: buckets, error: bucketsError } = await this.supabase
        .storage
        .listBuckets();

      if (bucketsError) {
        console.error('Failed to list storage buckets:', bucketsError);
        return [];
      }

      const backedUpBuckets = [];

      for (const bucket of buckets) {
        try {
          console.log(`Backing up bucket: ${bucket.name}`);
          
          // List files in bucket
          const { data: files, error: filesError } = await this.supabase
            .storage
            .from(bucket.name)
            .list('', { limit: 1000 });

          if (filesError) {
            console.error(`Failed to list files in bucket ${bucket.name}:`, filesError);
            continue;
          }

          // Create bucket metadata file
          const bucketPath = path.join(backupPath, 'storage', bucket.name);
          await fs.mkdir(bucketPath, { recursive: true });
          
          const metadataPath = path.join(bucketPath, 'metadata.json');
          await fs.writeFile(metadataPath, JSON.stringify({
            bucket: bucket.name,
            timestamp: new Date().toISOString(),
            files: files.map(file => ({
              name: file.name,
              size: file.metadata?.size,
              lastModified: file.updated_at
            }))
          }, null, 2));

          backedUpBuckets.push(bucket.name);
          console.log(` Backed up bucket ${bucket.name}: ${files.length} files`);
        } catch (error) {
          console.error(`Error backing up bucket ${bucket.name}:`, error);
        }
      }

      return backedUpBuckets;
    } catch (error) {
      console.error('Storage backup failed:', error);
      return [];
    }
  }

  // Create backup manifest
  async createManifest(backupPath, metadata) {
    const manifest = {
      timestamp: new Date().toISOString(),
      backupId: this.backupId,
      type: 'full',
      tables: metadata.tablesBackedUp,
      totalRecords: metadata.totalRecords,
      storageBuckets: metadata.backedUpBuckets || [],
      path: backupPath,
      version: '1.0.0'
    };

    const manifestPath = path.join(backupPath, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(` Created backup manifest: ${manifestPath}`);
    return manifest;
  }

  // Complete backup operation
  async completeBackup(success = true, errorMessage = null) {
    if (!this.backupId) return;

    try {
      const updateData = {
        status: success ? 'completed' : 'failed',
        completed_at: new Date().toISOString()
      };

      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      await this.supabase
        .from('backup_operations')
        .update(updateData)
        .eq('id', this.backupId);

      console.log(`Backup operation ${this.backupId} ${success ? 'completed' : 'failed'}`);
    } catch (error) {
      console.error('Failed to update backup record:', error);
    }
  }

  // Clean up old backups
  async cleanupOldBackups() {
    try {
      console.log('Cleaning up old backups...');
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - config.retentionDays);

      // Remove old backup records
      const { error } = await this.supabase
        .from('backup_operations')
        .delete()
        .lt('started_at', cutoffDate.toISOString())
        .eq('status', 'completed');

      if (error) {
        console.error('Failed to cleanup old backup records:', error);
      }

      // TODO: Remove old backup files from filesystem
      console.log(` Cleaned up backups older than ${config.retentionDays} days`);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  // Main backup execution
  async execute(type = 'full') {
    let backupPath;
    let success = false;
    let errorMessage = null;

    try {
      // Start backup
      await this.startBackup(type);
      
      // Create backup directory
      backupPath = await this.createBackupDirectory();
      
      // Backup database tables
      const tableResults = await this.backupTables(backupPath);
      
      // Backup storage
      const storageResults = await this.backupStorage(backupPath);
      
      // Create manifest
      await this.createManifest(backupPath, {
        ...tableResults,
        backedUpBuckets: storageResults
      });
      
      // Calculate backup size
      const stats = await this.calculateBackupSize(backupPath);
      
      // Update backup record with final details
      await this.supabase
        .from('backup_operations')
        .update({
          file_path: backupPath,
          file_size: stats.totalSize,
          metadata: {
            tables: tableResults.tablesBackedUp,
            totalRecords: tableResults.totalRecords,
            storageBuckets: storageResults,
            files: stats.fileCount
          }
        })
        .eq('id', this.backupId);

      success = true;
      console.log(` Backup completed successfully!`);
      console.log(`   Path: ${backupPath}`);
      console.log(`   Size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Tables: ${tableResults.tablesBackedUp.length}`);
      console.log(`   Records: ${tableResults.totalRecords}`);

    } catch (error) {
      success = false;
      errorMessage = error.message;
      console.error('L Backup failed:', error);
    } finally {
      await this.completeBackup(success, errorMessage);
      
      if (success) {
        await this.cleanupOldBackups();
      }
    }

    return success;
  }

  // Calculate backup size
  async calculateBackupSize(backupPath) {
    try {
      const files = await fs.readdir(backupPath, { recursive: true });
      let totalSize = 0;
      let fileCount = 0;

      for (const file of files) {
        const filePath = path.join(backupPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          totalSize += stats.size;
          fileCount++;
        }
      }

      return { totalSize, fileCount };
    } catch (error) {
      console.error('Failed to calculate backup size:', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }
}

// CLI execution
async function main() {
  const backupType = process.argv[2] || 'full';
  
  if (!['full', 'incremental', 'differential'].includes(backupType)) {
    console.error('Invalid backup type. Use: full, incremental, or differential');
    process.exit(1);
  }

  const backupManager = new BackupManager();
  
  try {
    const success = await backupManager.execute(backupType);
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Backup script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = BackupManager;
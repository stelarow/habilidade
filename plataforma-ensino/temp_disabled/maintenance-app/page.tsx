'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MaintenanceMode from '@/components/blog/MaintenanceMode';
import { maintenanceService } from '@/services/maintenanceService';
import type { MaintenanceWindow, MaintenanceStatus } from '@/services/maintenanceService';

export default function MaintenancePage() {
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const windowId = searchParams.get('window');

  // Fetch maintenance status
  const fetchMaintenanceStatus = async () => {
    try {
      setRefreshing(true);
      const status = await maintenanceService.checkMaintenanceStatus();
      
      if (!status.isActive) {
        // If maintenance is not active, redirect to home
        window.location.href = '/';
        return;
      }
      
      setMaintenanceStatus(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching maintenance status:', err);
      setError('Unable to fetch maintenance information');
      
      // Fallback maintenance window for display
      setMaintenanceStatus({
        isActive: true,
        currentMaintenance: {
          id: windowId || 'unknown',
          title: 'Sistema em Manutenção',
          description: 'Estamos realizando melhorias na plataforma. Volte em breve.',
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          status: 'active',
          affectedServices: ['all'],
          bypassEnabled: true,
          notificationSent: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        affectedServices: ['all'],
        userHasBypass: false
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMaintenanceStatus();
  }, [windowId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchMaintenanceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (!maintenanceStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando status de manutenção...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Sistema em Manutenção</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchMaintenanceStatus}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            disabled={refreshing}
          >
            {refreshing ? 'Tentando novamente...' : 'Tentar Novamente'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <MaintenanceMode 
      maintenance={maintenanceStatus.currentMaintenance!}
      userHasBypass={maintenanceStatus.userHasBypass}
      onRefresh={fetchMaintenanceStatus}
      refreshing={refreshing}
    />
  );
}
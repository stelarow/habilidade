#!/usr/bin/env node

// DataForSEO MCP Server Wrapper
// This wrapper launches the DataForSEO MCP server with the correct environment variables

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables for DataForSEO authentication
process.env.DATAFORSEO_LOGIN = 'gekawa1878@efpaper.com';
process.env.DATAFORSEO_PASSWORD = '41f48333ee5ced52';

// Path to the DataForSEO MCP server
const serverPath = path.join(__dirname, 'dataforseo-mcp-server', 'dist', 'index.js');

// Spawn the server process
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

// Handle process termination
server.on('error', (err) => {
  console.error('Failed to start DataForSEO MCP server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  process.exit(code || 0);
});

// Handle signals
process.on('SIGINT', () => {
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});
import type { Metadata } from 'next';
import SystemStatus from '@/components/admin/blog/SystemStatus';

export const metadata: Metadata = {
  title: 'System Monitoring | Admin Dashboard',
  description: 'Monitor system health, uptime, and performance metrics',
};

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor system health, uptime, and performance metrics in real-time
          </p>
        </div>
      </div>

      <SystemStatus />
    </div>
  );
}
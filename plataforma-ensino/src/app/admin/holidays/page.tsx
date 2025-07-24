import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/session';
import HolidayManager from '@/components/scheduling/HolidayManager';
import { Suspense } from 'react';

// Force dynamic rendering and disable caching for admin pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Gerenciamento de Feriados | Admin - Habilidade',
  description: 'Gerencie feriados e datas especiais do calendário acadêmico',
};

export default async function HolidaysPage() {
  try {
    // Ensure admin access with better error handling
    await requireAdmin();

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <HolidayManager 
            year={new Date().getFullYear()}
            onHolidayChange={(holidays) => {
              // This could trigger updates to other components if needed
              console.log('Holidays updated:', holidays.length);
            }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('[HOLIDAYS_PAGE] Server component error:', error);
    
    // Instead of letting the error bubble up, provide a more graceful fallback
    throw new Error(`Authentication required for admin holidays page. Please ensure you are logged in as an admin user.`);
  }
}
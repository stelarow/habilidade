import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/session';
import HolidayManager from '@/components/scheduling/HolidayManager';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gerenciamento de Feriados | Admin - Habilidade',
  description: 'Gerencie feriados e datas especiais do calendário acadêmico',
};

export default async function HolidaysPage() {
  // Ensure admin access
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
}
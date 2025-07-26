import { AdminTimeSlotConfig } from '@/components/admin/AdminTimeSlotConfig';

export default function ScheduleConfigPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <AdminTimeSlotConfig />
    </div>
  );
}

export const metadata = {
  title: 'Configuração de Horários | Admin - Plataforma Habilidade',
  description: 'Configure os horários padrões disponíveis para todos os professores da plataforma.',
};
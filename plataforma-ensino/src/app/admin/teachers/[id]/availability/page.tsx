import { TeacherAvailabilityGrid } from '@/components/admin/TeacherAvailabilityGrid';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TeacherAvailabilityPage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <TeacherAvailabilityGrid 
        teacherId={params.id}
        onSlotClick={(slot) => {
          console.log('Slot clicado:', slot);
          // Aqui pode abrir um modal para editar o slot
        }}
      />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: 'Disponibilidade do Professor | Admin - Plataforma Habilidade',
    description: 'Visualize e gerencie a disponibilidade de horários do professor.',
  };
}
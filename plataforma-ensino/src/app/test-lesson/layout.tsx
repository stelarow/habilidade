import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teste de Aula - Sistema de Ensino',
  description: 'Página de demonstração dos componentes do sistema de aulas - Fase 2 implementada',
  keywords: ['educação', 'aula online', 'teste', 'desenvolvimento web']
}

export default function TestLessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="test-lesson-layout">
      {children}
    </div>
  )
}
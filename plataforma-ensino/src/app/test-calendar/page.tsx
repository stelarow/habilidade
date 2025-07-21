'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/calendar';

export default function TestCalendarPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  // Mock teacher IDs for testing - in a real app these would come from the database
  const mockTeachers = [
    { id: '', name: 'Todos os professores' },
    { id: '12345678-1234-5678-9012-123456789012', name: 'Professor A' },
    { id: '87654321-4321-8765-2109-876543210987', name: 'Professor B' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Teste - Calendário de Aulas
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Página de teste para validar o componente CalendarView
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <label htmlFor="teacher-select" className="sr-only">
                    Selecionar professor
                  </label>
                  <select
                    id="teacher-select"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {mockTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <CalendarView teacherId={selectedTeacher || undefined} />
        </div>
        
        {/* Validation checklist */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lista de Validação - Task 3
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Componente renderiza sem erros</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Grid exibe dias e horários corretamente</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Dados da API são exibidos nas células</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Loading state funciona</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Botão &quot;Atualizar&quot; funciona</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900">Instruções de Teste:</h4>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li>Verifique se o calendário carrega com o estado &quot;Carregando calendário...&quot;</li>
              <li>Observe se a tabela é exibida com 6 dias (Segunda a Sábado) e 6 horários</li>
              <li>Teste o filtro por professor no dropdown</li>
              <li>Clique no botão &quot;Atualizar&quot; para recarregar os dados</li>
              <li>Se houver dados, verifique se as células mostram informações dos estudantes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
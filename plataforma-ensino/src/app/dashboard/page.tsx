'use client';

import { GradientButton } from '@/components/ui';
import { Starfield } from '@/components/ui';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    })();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Starfield count={30} className="opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Bem-vindo{userEmail ? `, ${userEmail}` : ''} à plataforma Habilidade</p>
          </div>
          
          <GradientButton onClick={handleLogout}>
            Logout
          </GradientButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Cursos Ativos</h3>
            <p className="text-3xl font-bold text-primary">3</p>
            <p className="text-gray-400 text-sm mt-1">IA, Design, Programação</p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Progresso Geral</h3>
            <p className="text-3xl font-bold text-secondary">67%</p>
            <p className="text-gray-400 text-sm mt-1">34 de 51 aulas concluídas</p>
          </div>
          
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Tempo de Estudo</h3>
            <p className="text-3xl font-bold text-accent">24h</p>
            <p className="text-gray-400 text-sm mt-1">Nesta semana</p>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Continuar Estudando</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Card 1 */}
            <div className="bg-zinc-800/50 rounded-lg border border-gray-700 p-4 hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md mb-4 flex items-center justify-center">
                <span className="text-primary text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Inteligência Artificial</h3>
              <p className="text-gray-400 text-sm mb-3">Aula 8: Machine Learning Básico</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <GradientButton className="w-full">Continuar</GradientButton>
            </div>

            {/* Course Card 2 */}
            <div className="bg-zinc-800/50 rounded-lg border border-gray-700 p-4 hover:border-secondary/50 transition-colors">
              <div className="aspect-video bg-gradient-to-br from-secondary/20 to-accent/20 rounded-md mb-4 flex items-center justify-center">
                <span className="text-secondary text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Design Gráfico</h3>
              <p className="text-gray-400 text-sm mb-3">Aula 12: Tipografia Avançada</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <GradientButton className="w-full">Continuar</GradientButton>
            </div>

            {/* Course Card 3 */}
            <div className="bg-zinc-800/50 rounded-lg border border-gray-700 p-4 hover:border-accent/50 transition-colors">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-md mb-4 flex items-center justify-center">
                <span className="text-accent text-2xl">💻</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Programação</h3>
              <p className="text-gray-400 text-sm mb-3">Aula 15: React Hooks</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <GradientButton className="w-full">Continuar</GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
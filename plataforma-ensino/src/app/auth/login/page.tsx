'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GradientButton, Loading } from '@/components/ui';
import { Starfield } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

// Separate component for search params handling
function LoginErrorHandler({ setError }: { setError: (error: string | null) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'callback_error') {
      setError('Erro na verificação de email. Tente fazer login novamente.');
    }
  }, [searchParams, setError]);

  return null;
}

function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        throw authError;
      }

      // Wait a moment for the auth state to update before redirecting
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Starfield count={50} className="opacity-30" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-8 shadow-2xl">
          {/* Error Handler */}
          <Suspense fallback={null}>
            <LoginErrorHandler setError={setError} />
          </Suspense>
          
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Habilidade
            </h1>
            <p className="text-gray-400 mt-2">Entre na sua conta</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Digite sua senha"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-zinc-800 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-400">Lembrar de mim</span>
              </label>
              
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-primary hover:text-secondary transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <GradientButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-center"
            >
              {isLoading ? (
                <Loading size="sm" text="Entrando..." className="justify-center" />
              ) : (
                'Entrar'
              )}
            </GradientButton>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-gray-400">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-zinc-800 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
              >
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-zinc-800 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
              >
                GitHub
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <Link 
                href="/auth/register" 
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
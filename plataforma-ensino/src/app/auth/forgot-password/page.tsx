'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GradientButton, Loading } from '@/components/ui';
import { Starfield } from '@/components/ui';
import { createClient } from '@supabase/supabase-js';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`
      });

      if (resetError) {
        throw resetError;
      }

      setIsEmailSent(true);
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        <Starfield count={50} className="opacity-30" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-8 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">
              Email enviado!
            </h1>
            
            <p className="text-gray-400 mb-6">
              Enviamos um link de recuperação para <strong className="text-white">{email}</strong>. 
              Verifique sua caixa de entrada e spam.
            </p>

            <div className="space-y-4">
              <GradientButton
                onClick={() => setIsEmailSent(false)}
                className="w-full py-3"
              >
                Tentar outro email
              </GradientButton>
              
              <Link 
                href="/auth/login"
                className="block w-full text-center py-3 px-4 border border-gray-600 rounded-md text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
              >
                Voltar ao login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Starfield count={50} className="opacity-30" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass-effect bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Habilidade
            </h1>
            <p className="text-gray-400 mt-2">Recuperar senha</p>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-md">
            <p className="text-blue-400 text-sm">
              Digite seu email para receber um link de recuperação de senha.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <GradientButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-center"
            >
              {isLoading ? (
                <Loading size="sm" text="Enviando..." className="justify-center" />
              ) : (
                'Enviar link de recuperação'
              )}
            </GradientButton>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GradientButton, Loading } from '@/components/ui';
import { Starfield } from '@/components/ui';
import { createClient } from '@supabase/supabase-js';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const registerId = Math.random().toString(36).substr(2, 9);

    // Validation
    console.log(`[REGISTER-${registerId}] 🚀 Starting registration process for: ${formData.email}`);
    
    if (formData.password !== formData.confirmPassword) {
      console.log(`[REGISTER-${registerId}] ❌ Password confirmation mismatch`);
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      console.log(`[REGISTER-${registerId}] ❌ Password too short: ${formData.password.length} characters`);
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    console.log(`[REGISTER-${registerId}] ✅ Form validation passed`);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      console.log(`[REGISTER-${registerId}] 🔄 Clearing any existing session...`);
      // Clear any existing session first
      await supabase.auth.signOut();

      console.log(`[REGISTER-${registerId}] 📝 Attempting user registration...`);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log(`[REGISTER-${registerId}] 📊 Registration response:`, {
        hasUser: !!data.user,
        hasSession: !!data.session,
        hasError: !!signUpError,
        userIdentitiesCount: data.user?.identities?.length || 0,
        userRole: data.user?.role || 'empty'
      });

      if (signUpError) {
        console.error(`[REGISTER-${registerId}] ❌ Registration error:`, {
          message: signUpError.message,
          status: signUpError.status
        });
        throw signUpError;
      }

      // DETECT DUPLICATE EMAIL - Based on Supabase faux data behavior
      // When signing up with an existing email, Supabase returns faux data with:
      // - Empty identities array []
      // - Empty role string ''
      // - Reduced user metadata
      if (data.user && !signUpError) {
        const isDuplicateEmail = (
          // Primary indicator: No identities for faux data
          data.user.identities?.length === 0 ||
          // Secondary indicator: Empty role for faux data  
          data.user.role === ''
        );
        
        console.log(`[REGISTER-${registerId}] 🔍 Duplicate email check:`, {
          identitiesLength: data.user.identities?.length,
          role: data.user.role,
          isDuplicate: isDuplicateEmail
        });
        
        if (isDuplicateEmail) {
          console.log(`[REGISTER-${registerId}] ⚠️ Duplicate email detected - blocking registration`);
          setError('Este email já está cadastrado. Verifique sua caixa de entrada para o link de verificação ou tente fazer login.');
          return;
        }
      }

      console.log(`[REGISTER-${registerId}] ✅ Registration successful - email verification sent`);
      setEmailSent(true);
    } catch (err: any) {
      console.error(`[REGISTER-${registerId}] ❌ Registration failed:`, {
        error: err?.message,
        status: err?.status,
        code: err?.code
      });
      setError(err?.message ?? 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
      console.log(`[REGISTER-${registerId}] 🏁 Registration process completed`);
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
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Habilidade
            </h1>
            <p className="text-gray-400 mt-2">Crie sua conta</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email Verification Message */}
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-2xl">✓</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Verifique seu email</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Enviamos um link de verificação para <strong className="text-white">{formData.email}</strong>.
                Clique no link para ativar sua conta e fazer login.
              </p>
              
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-500 text-xs mb-4">
                  Não recebeu o email? Verifique sua caixa de spam ou tente novamente.
                </p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-primary hover:text-secondary transition-colors text-sm"
                >
                  Voltar ao formulário
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Seu nome completo"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Digite a senha novamente"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-1 text-primary bg-zinc-800 border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                Aceito os{' '}
                <Link href="/terms" className="text-primary hover:text-secondary transition-colors">
                  Termos de Uso
                </Link>
                {' '}e{' '}
                <Link href="/privacy" className="text-primary hover:text-secondary transition-colors">
                  Política de Privacidade
                </Link>
              </label>
            </div>

            <GradientButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-center"
            >
              {isLoading ? (
                <Loading size="sm" text="Criando conta..." className="justify-center" />
              ) : (
                'Criar conta'
              )}
            </GradientButton>
          </form>

          {/* Social Register */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-gray-400">Ou registre-se com</span>
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

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link 
                href="/auth/login" 
                className="text-primary hover:text-secondary transition-colors font-medium"
              >
                Fazer login
              </Link>
            </p>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
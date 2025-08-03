import { createClient } from '@supabase/supabase-js';

// Configuração padrão do Supabase
const DEFAULT_SUPABASE_URL = 'https://vfpdyllwquaturpcifpl.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';

// Lazy loading para evitar problemas no build
let supabaseInstance = null;
let envChecked = false;
let supabaseUrl = DEFAULT_SUPABASE_URL;
let supabaseKey = DEFAULT_SUPABASE_ANON_KEY;

// Função para verificar variáveis de ambiente apenas em runtime
const checkEnvVars = () => {
  if (!envChecked && typeof window !== 'undefined') {
    try {
      // Apenas tenta acessar import.meta.env em runtime
      if (window.__VITE_SUPABASE_URL__) {
        supabaseUrl = window.__VITE_SUPABASE_URL__;
      }
      if (window.__VITE_SUPABASE_ANON_KEY__) {
        supabaseKey = window.__VITE_SUPABASE_ANON_KEY__;
      }
      // Fallback para import.meta.env se disponível
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL || supabaseUrl;
        supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseKey;
      }
    } catch (e) {
      // Em caso de erro, usa valores padrão
      console.log('Using default Supabase configuration');
    }
    envChecked = true;
  }
};

// Criar cliente Supabase com lazy loading
const getSupabaseClient = () => {
  if (!supabaseInstance) {
    checkEnvVars();
    
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 2
        }
      },
      global: {
        headers: {
          'x-client-info': 'escola-habilidade-frontend'
        }
      }
    });
  }
  
  return supabaseInstance;
};

// Export proxy para garantir lazy loading
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client[prop];
  }
});

// Helper para verificar conexão
export const checkSupabaseConnection = async () => {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('blog_categories')
      .select('id, name')
      .limit(1);
    
    if (error) throw error;
    
    return {
      status: 'connected',
      message: 'Conexão com Supabase estabelecida com sucesso',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Helper para logs de debug
export const logSupabaseQuery = (table, operation, params = {}) => {
  if (typeof window !== 'undefined' && window.__VITE_DEBUG_MODE__) {
    console.log(`[Supabase] ${operation} on ${table}:`, params);
  }
};

export default supabase;
/**
 * Página Administrativa de Alertas
 * Task 4 - FEATURE_001_SISTEMA_ALERTAS
 * Página Next.js integrada ao layout admin para gestão de alertas
 */

import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Components
import AlertConfig from '@/components/admin/blog/AlertConfig';

// Utils
import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/utils/logger';

// Icons
import { Bell, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

// Metadata
export const metadata: Metadata = {
  title: 'Alertas - Administração | Escola Habilidade',
  description: 'Configure e monitore alertas automáticos do sistema',
  robots: { index: false, follow: false }
};

// Status Cards Component
async function AlertStatusCards() {
  try {
    // In a production environment, this would fetch real metrics
    // For now, we'll simulate with static data
    const metrics = {
      active_alerts: 0,
      total_alerts: 0,
      average_resolution_time: 0,
      escalation_rate: 0
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Alertas Ativos
              </p>
              <p className="text-2xl font-bold text-red-600">
                {metrics.active_alerts}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Alertas
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {metrics.total_alerts}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tempo Médio
              </p>
              <p className="text-2xl font-bold text-green-600">
                {metrics.average_resolution_time}min
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Taxa de Escalação
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {metrics.escalation_rate}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    logger.error('AlertsPage: Failed to load status cards', { error });
    return null;
  }
}

// Breadcrumbs Component
function Breadcrumbs() {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a
            href="/admin"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="w-3 h-3 mr-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            Administração
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <a
              href="/admin/blog"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-purple-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
            >
              Blog
            </a>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg
              className="w-3 h-3 text-gray-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              Alertas
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}

// Main Page Component
export default async function AlertsAdminPage() {
  // Server-side authentication check
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      logger.error('AlertsPage: Session error', { error: sessionError });
      redirect('/auth/login');
    }

    if (!session) {
      logger.warn('AlertsPage: No active session, redirecting to login');
      redirect('/auth/login');
    }

    // Check if user has admin privileges
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      logger.error('AlertsPage: Failed to fetch user profile', { 
        error: profileError,
        userId: session.user.id 
      });
      redirect('/dashboard');
    }

    if (profile?.role !== 'admin') {
      logger.warn('AlertsPage: Unauthorized access attempt', {
        userId: session.user.id,
        userRole: profile?.role
      });
      redirect('/dashboard');
    }

    logger.info('AlertsPage: Admin access granted', {
      userId: session.user.id,
      userEmail: session.user.email
    });

  } catch (error) {
    logger.error('AlertsPage: Authentication error', { error });
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-purple-600" />
                Sistema de Alertas
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Configure alertas automáticos para monitoramento do sistema e blog
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={() => window.location.reload()}
              >
                <Activity className="w-4 h-4 mr-2" />
                Atualizar Status
              </button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <AlertStatusCards />

        {/* Alert Configuration Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <AlertConfig />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Sistema de alertas integrado com monitoramento automático. 
            Alertas são processados em tempo real e enviados via múltiplos canais.
          </p>
        </div>
      </div>
    </div>
  );
}


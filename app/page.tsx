'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { AuthPanel } from '@/components/auth/auth-panel';
import { AnimatePresence } from '@/components/ui/animate-presence';
import { StatusBanner } from '@/components/ui/status-banner';
import { AddTransactionSheet } from '@/components/transactions/add-transaction-sheet';
import { AppShell, type ScreenKey } from '@/components/layout/app-shell';
import { DashboardScreen } from '@/components/screens/dashboard-screen';
import { BrandMark } from '@/components/ui/brand';
import { PwaProvider } from '@/components/pwa/pwa-provider';
import { useAuthStore } from '@/store/auth-store';
import { useFinanceStore } from '@/store/finance-store';
import { useWorkspaceStore } from '@/store/workspace-store';

const GroupExpensesScreen = dynamic(() => import('@/components/screens/group-expenses-screen').then((module) => module.GroupExpensesScreen), { loading: () => <ScreenSkeleton /> });
const HistoryScreen = dynamic(() => import('@/components/screens/history-screen').then((module) => module.HistoryScreen), { loading: () => <ScreenSkeleton /> });
const RecurringScreen = dynamic(() => import('@/components/screens/recurring-screen').then((module) => module.RecurringScreen), { loading: () => <ScreenSkeleton /> });
const ReportsScreen = dynamic(() => import('@/components/screens/reports-screen').then((module) => module.ReportsScreen), { loading: () => <ScreenSkeleton /> });
const SettingsScreen = dynamic(() => import('@/components/screens/settings-screen').then((module) => module.SettingsScreen), { loading: () => <ScreenSkeleton /> });

export default function Home() {
  const [screen, setScreen] = useState<ScreenKey>('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const hydrated = useAuthStore((state) => state.hydrated);
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const transactions = useFinanceStore((state) => state.transactions);
  const loadWorkspace = useFinanceStore((state) => state.loadWorkspace);
  const loading = useFinanceStore((state) => state.loading);
  const error = useFinanceStore((state) => state.error);
  const clearError = useFinanceStore((state) => state.clearError);

  const hydrateWorkspace = useWorkspaceStore((state) => state.hydrate);
  const ensureActiveWorkspace = useWorkspaceStore((state) => state.ensureActiveWorkspace);

  useEffect(() => {
    hydrate();
    hydrateWorkspace();
  }, [hydrate, hydrateWorkspace]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      await ensureActiveWorkspace();
      await loadWorkspace();
    })();
  }, [ensureActiveWorkspace, loadWorkspace, user]);

  useEffect(() => {
    if (error) {
      clearError();
    }
    // Intentionally clear any stale banners when switching screens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const content = useMemo(() => {
    switch (screen) {
      case 'dashboard':
        return <DashboardScreen onAddTransaction={() => setIsAdding(true)} />;
      case 'transaction':
        return <DashboardScreen onAddTransaction={() => setIsAdding(true)} compact />;
      case 'history':
        return <HistoryScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'recurring':
        return <RecurringScreen />;
      case 'groups':
        return <GroupExpensesScreen />;
      case 'settings':
        return <SettingsScreen />;
    }
  }, [screen]);

  if (!hydrated) {
    return (
      <>
        <PwaProvider />
        <main className="grid min-h-screen place-items-center px-4">
          <div className="surface rounded-3xl p-6">
            <BrandMark />
            <div className="mx-auto mt-5 h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p className="mt-3 text-center text-sm text-[#6B7280]">Preparing HexaTrack...</p>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PwaProvider />
        <AuthPanel />
      </>
    );
  }

  return (
    <>
      <PwaProvider />
      <AppShell activeScreen={screen} onAddTransaction={() => setIsAdding(true)} onNavigate={setScreen} transactionCount={transactions.length}>
        <StatusBanner error={error} loading={loading} onDismiss={clearError} />
        <AnimatePresence animationKey={screen}>{content}</AnimatePresence>
        <AddTransactionSheet open={isAdding} onOpenChange={setIsAdding} />
      </AppShell>
    </>
  );
}

function ScreenSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded-xl bg-[#E5E7EB]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[#ECFDF5]" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 animate-pulse rounded-2xl bg-white" />
        <div className="h-28 animate-pulse rounded-2xl bg-white" />
      </div>
    </div>
  );
}

import './styles/components.css';
import { useSSE } from './hooks/useSSE';
import { useUIStore } from './stores/ui.store';
import { useHarnessLoading } from './hooks/useHarness';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/primitives/ErrorBoundary';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { DiagramView } from './components/diagram/DiagramView';
import { AgentsView } from './components/agents/AgentsView';
import { TracingView } from './components/tracing/TracingView';
import { ScaffoldView } from './components/scaffold/ScaffoldView';

export function App() {
  const { status } = useSSE();
  const activeView = useUIStore((s) => s.activeView);
  const loading = useHarnessLoading();
  useKeyboardNav();

  return (
    <AppShell sseStatus={status}>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <span className="text-metadata">Initializing...</span>
        </div>
      ) : (
        <>
          {activeView === 'dashboard' && <ErrorBoundary viewName="DASHBOARD"><DashboardView /></ErrorBoundary>}
          {activeView === 'tasks' && <ErrorBoundary viewName="TASKS"><TasksView /></ErrorBoundary>}
          {activeView === 'diagram' && <ErrorBoundary viewName="DIAGRAM"><DiagramView /></ErrorBoundary>}
          {activeView === 'agents' && <ErrorBoundary viewName="AGENTS"><AgentsView /></ErrorBoundary>}
          {activeView === 'tracing' && <ErrorBoundary viewName="TRACING"><TracingView /></ErrorBoundary>}
          {activeView === 'scaffold' && <ErrorBoundary viewName="SCAFFOLD"><ScaffoldView /></ErrorBoundary>}
        </>
      )}
    </AppShell>
  );
}

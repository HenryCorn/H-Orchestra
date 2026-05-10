import { HarnessStatusCard } from './HarnessStatusCard';
import { TaskSummaryCard } from './TaskSummaryCard';
import { AgentActivityFeed } from './AgentActivityFeed';
import { GitLogPanel } from './GitLogPanel';
import { AgentsMdViewer } from './AgentsMdViewer';
import { ProgressCurrentPanel } from './ProgressCurrentPanel';

export function DashboardView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 900 }}>
      <h1 className="text-heading" style={{ marginBottom: 'var(--spacing-2)' }}>OVERVIEW</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
        <HarnessStatusCard />
        <TaskSummaryCard />
      </div>
      <ProgressCurrentPanel />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
        <AgentActivityFeed />
        <GitLogPanel />
      </div>
      <AgentsMdViewer />
    </div>
  );
}

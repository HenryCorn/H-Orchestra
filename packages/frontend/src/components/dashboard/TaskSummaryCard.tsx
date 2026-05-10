import { useFeatureList } from '../../hooks/useHarness';
import { Card } from '../primitives/Card';
import { SegmentedProgress } from '../primitives/SegmentedProgress';
import { MetricDisplay } from '../primitives/MetricDisplay';

export function TaskSummaryCard() {
  const featureList = useFeatureList();

  if (!featureList) {
    return (
      <Card>
        <span className="text-metadata">No feature_list.json found</span>
      </Card>
    );
  }

  const total = featureList.tasks.length;
  const completed = featureList.tasks.filter((t) => t.status === 'completed').length;
  const inProgress = featureList.tasks.filter((t) => t.status === 'in_progress').length;
  const blocked = featureList.tasks.filter((t) => t.status === 'blocked').length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <MetricDisplay value={pct} unit="%" label="Completion" />
        <SegmentedProgress value={completed} max={total} segments={total > 0 ? Math.min(total, 40) : 20} showLabel />
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <div>
            <span className="label">In Progress</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body)', color: 'var(--color-text)' }}>{inProgress}</span>
          </div>
          <div>
            <span className="label">Blocked</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body)', color: blocked > 0 ? 'var(--color-critical)' : 'var(--color-text)' }}>{blocked}</span>
          </div>
          <div>
            <span className="label">Total</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body)', color: 'var(--color-text)' }}>{total}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

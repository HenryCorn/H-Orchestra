import { describe, it, expect } from 'vitest';
import { parseFeatureList } from '../feature-list.parser.js';

const PATH = '/mount/feature_list.json';

describe('parseFeatureList', () => {
  it('parses array format', () => {
    const content = JSON.stringify([
      { id: 't1', label: 'First task', status: 'pending', priority: 1, category: 'backend' },
    ]);
    const result = parseFeatureList(PATH, content);
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0]).toMatchObject({ id: 't1', label: 'First task', status: 'pending' });
  });

  it('parses {tasks:[]} wrapper format', () => {
    const content = JSON.stringify({
      tasks: [{ id: 't2', label: 'Second', status: 'completed', priority: 2, category: 'frontend' }],
    });
    const result = parseFeatureList(PATH, content);
    expect(result.tasks[0]?.status).toBe('completed');
  });

  it('coerces "done" status to completed', () => {
    const content = JSON.stringify([{ id: 'x', label: 'x', status: 'done', priority: 1, category: 'x' }]);
    const result = parseFeatureList(PATH, content);
    expect(result.tasks[0]?.status).toBe('completed');
  });

  it('coerces "in progress" to in_progress', () => {
    const content = JSON.stringify([{ id: 'x', label: 'x', status: 'in progress', priority: 1, category: 'x' }]);
    const result = parseFeatureList(PATH, content);
    expect(result.tasks[0]?.status).toBe('in_progress');
  });

  it('defaults unknown status to pending', () => {
    const content = JSON.stringify([{ id: 'x', label: 'x', status: 'whatever', priority: 1, category: 'x' }]);
    const result = parseFeatureList(PATH, content);
    expect(result.tasks[0]?.status).toBe('pending');
  });

  it('sets path on the returned FeatureList', () => {
    const result = parseFeatureList(PATH, '[]');
    expect(result.path).toBe(PATH);
  });
});

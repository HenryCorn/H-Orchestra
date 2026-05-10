import { useHarnessStore } from '../stores/harness.store';

export function useSkills() {
  return useHarnessStore((s) => s.skills);
}

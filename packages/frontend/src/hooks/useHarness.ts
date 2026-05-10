import { useHarnessStore } from '../stores/harness.store';

export function useHarness() {
  return useHarnessStore((s) => s.snapshot);
}

export function useFeatureList() {
  return useHarnessStore((s) => s.featureList);
}

export function useProgress() {
  return useHarnessStore((s) => s.progress);
}

export function useHarnessLoading() {
  return useHarnessStore((s) => s.loading);
}

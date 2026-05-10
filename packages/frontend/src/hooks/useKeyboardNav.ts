import { useEffect } from 'react';
import { useUIStore, type ActiveView } from '../stores/ui.store';

const KEY_MAP: Record<string, ActiveView> = {
  '1': 'dashboard',
  '2': 'tasks',
  '3': 'diagram',
  '4': 'agents',
  '5': 'tracing',
  '6': 'scaffold',
};

export function useKeyboardNav() {
  const setActiveView = useUIStore((s) => s.setActiveView);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const view = KEY_MAP[e.key];
      if (view) setActiveView(view);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveView]);
}

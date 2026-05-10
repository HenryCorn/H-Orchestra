import { useUIStore, type ActiveView } from '../../stores/ui.store';

const NAV_ITEMS: { view: ActiveView; label: string; glyph: string }[] = [
  { view: 'dashboard', label: 'DASH', glyph: '◈' },
  { view: 'tasks', label: 'TASKS', glyph: '▦' },
  { view: 'diagram', label: 'DIAG', glyph: '⇌' },
  { view: 'agents', label: 'AGENTS', glyph: '⬡' },
  { view: 'tracing', label: 'TRACE', glyph: '◎' },
  { view: 'scaffold', label: 'BUILD', glyph: '⊞' },
];

export function Sidebar() {
  const activeView = useUIStore((s) => s.activeView);
  const setActiveView = useUIStore((s) => s.setActiveView);

  return (
    <nav
      style={{
        width: 64,
        borderRight: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-1)',
        padding: 'var(--spacing-2) 0',
        flexShrink: 0,
      }}
    >
      {NAV_ITEMS.map(({ view, label, glyph }) => {
        const isActive = activeView === view;
        return (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            title={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-1)',
              height: 56,
              width: '100%',
              background: isActive ? 'var(--color-surface-raised)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--color-text)' : '2px solid transparent',
              cursor: 'pointer',
              color: isActive ? 'var(--color-text)' : 'var(--color-text-disabled)',
              transition: 'color 100ms linear, background 100ms linear',
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{glyph}</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

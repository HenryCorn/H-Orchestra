import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ConnectionBanner } from '../connection/ConnectionBanner';
import type { SSEStatus } from '../../hooks/useSSE';

interface Props {
  children: ReactNode;
  sseStatus: SSEStatus;
}

export function AppShell({ children, sseStatus }: Props) {
  return (
    <div
      className="dot-matrix"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <TopBar sseStatus={sseStatus} />
      <ConnectionBanner status={sseStatus} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--spacing-4)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  viewName: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[H-Orchestra] Error in ${this.props.viewName}:`, error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)',
            padding: 'var(--spacing-8)',
            border: '1px solid var(--color-critical)',
            background: 'var(--color-surface)',
          }}
        >
          <span className="label" style={{ color: 'var(--color-critical)' }}>
            {this.props.viewName} CRASHED
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-metadata)',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {this.state.error.message}
          </span>
          <button
            className="pill-btn"
            onClick={() => this.setState({ error: null })}
          >
            RETRY
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

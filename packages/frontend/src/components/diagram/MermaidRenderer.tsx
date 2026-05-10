import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    fontFamily: '"Space Mono", monospace',
    fontSize: '11px',
    background: '#111111',
    primaryColor: '#1A1A1A',
    primaryTextColor: '#E8E8E8',
    primaryBorderColor: '#2A2A2A',
    lineColor: '#999999',
    secondaryColor: '#222222',
    tertiaryColor: '#1A1A1A',
  },
});

interface Props {
  definition: string;
  onRender?: (svg: string) => void;
}

let idCounter = 0;

export function MermaidRenderer({ definition, onRender }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${++idCounter}`);

  useEffect(() => {
    if (!containerRef.current || !definition.trim()) return;

    setError(null);
    const id = idRef.current;

    mermaid
      .render(id, definition)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          onRender?.(svg);
        }
      })
      .catch((err: unknown) => {
        setError(String(err));
      });
  }, [definition]);

  if (error) {
    return (
      <div
        style={{
          border: '1px solid var(--color-critical)',
          padding: 'var(--spacing-4)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--font-size-metadata)',
          color: 'var(--color-critical)',
        }}
      >
        Diagram error: {error}
      </div>
    );
  }

  return <div ref={containerRef} style={{ maxWidth: '100%', overflow: 'auto' }} />;
}

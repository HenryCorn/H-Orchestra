import { useState, useCallback } from 'react';
import { useProgress } from '../../hooks/useHarness';
import { MermaidRenderer } from './MermaidRenderer';
import { PillButton } from '../primitives/PillButton';
import { Card } from '../primitives/Card';
import { buildMermaidFromProgress } from '../../utils/mermaid';

function exportSvgAsPng(svgString: string, filename = 'diagram.png') {
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 1200;
    canvas.height = img.naturalHeight || 800;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = url;
}

export function DiagramView() {
  const progress = useProgress();
  const [dslVisible, setDslVisible] = useState(false);
  const [renderedSvg, setRenderedSvg] = useState<string | null>(null);

  const definition = buildMermaidFromProgress(progress);

  const copyDsl = async () => {
    await navigator.clipboard.writeText(definition);
  };

  const handleRender = useCallback((svg: string) => setRenderedSvg(svg), []);

  const exportPng = () => {
    if (renderedSvg) exportSvgAsPng(renderedSvg, 'h-orchestra-diagram.png');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-heading">SEQUENCE DIAGRAM</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <PillButton onClick={() => setDslVisible((v) => !v)}>
            {dslVisible ? 'HIDE DSL' : 'SHOW DSL'}
          </PillButton>
          <PillButton onClick={() => void copyDsl()}>COPY DSL</PillButton>
          {renderedSvg && (
            <PillButton variant="active" onClick={exportPng}>EXPORT PNG</PillButton>
          )}
        </div>
      </div>

      {dslVisible && (
        <Card>
          <pre className="code-block" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            {definition}
          </pre>
        </Card>
      )}

      <Card>
        <MermaidRenderer definition={definition} onRender={handleRender} />
      </Card>
    </div>
  );
}

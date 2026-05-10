import { useEffect, useState, useRef } from 'react';
import { api } from '../../api/client';
import type { AgentTemplate, ScaffoldResult } from '@h-orchestra/shared';
import { Card } from '../primitives/Card';
import { PillButton } from '../primitives/PillButton';
import { Badge } from '../primitives/Badge';

export function ScaffoldView() {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [selected, setSelected] = useState<AgentTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [targetPath, setTargetPath] = useState('');
  const [result, setResult] = useState<ScaffoldResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.templates.list().then(setTemplates).catch(console.error);
  }, []);

  const handleZipImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError(null);
    try {
      const imported = await api.templates.importZip(file);
      setTemplates((prev) => [...prev.filter((t) => t.id !== imported.id), imported]);
    } catch (err) {
      setImportError(String(err));
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectTemplate = (t: AgentTemplate) => {
    setSelected(t);
    setResult(null);
    const defaults: Record<string, string> = {};
    for (const v of t.variables) {
      defaults[v.name] = String(v.default);
    }
    setVariables(defaults);
  };

  const scaffold = async () => {
    if (!selected || !targetPath) return;
    setLoading(true);
    try {
      const res = await api.scaffold.run({
        templateId: selected.id,
        targetPath,
        variables,
      });
      setResult(res);
    } catch (e) {
      setResult({ success: false, createdFiles: [], errors: [String(e)] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-heading">SCAFFOLD HARNESS</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          {importError && (
            <span className="text-metadata" style={{ color: 'var(--color-critical)' }}>{importError}</span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            style={{ display: 'none' }}
            onChange={(e) => void handleZipImport(e)}
          />
          <PillButton
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? 'IMPORTING...' : 'IMPORT ZIP'}
          </PillButton>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTemplate(t)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)',
              padding: 'var(--spacing-4)',
              background: selected?.id === t.id ? 'var(--color-surface-raised)' : 'var(--color-surface)',
              border: `1px solid ${selected?.id === t.id ? 'var(--color-text)' : 'var(--color-border)'}`,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.name}
              </span>
              <Badge>{t.ecosystem}</Badge>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
              {t.description}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <span className="text-heading">{selected.name.toUpperCase()} — VARIABLES</span>

            <div>
              <label className="label">Target Directory</label>
              <input
                className="input"
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                placeholder="/absolute/path/to/new/project"
              />
            </div>

            {selected.variables.map((v) => (
              <div key={v.name}>
                <label className="label">{v.label}</label>
                {v.type === 'enum' && v.enumValues ? (
                  <select
                    className="select"
                    value={variables[v.name] ?? String(v.default)}
                    onChange={(e) => setVariables((prev) => ({ ...prev, [v.name]: e.target.value }))}
                  >
                    {v.enumValues.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input"
                    value={variables[v.name] ?? String(v.default)}
                    onChange={(e) => setVariables((prev) => ({ ...prev, [v.name]: e.target.value }))}
                    placeholder={String(v.default)}
                  />
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-disabled)', marginTop: 'var(--spacing-1)', display: 'block' }}>
                  {v.description}
                </span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
              <PillButton onClick={() => setSelected(null)}>CANCEL</PillButton>
              <PillButton variant="active" onClick={() => void scaffold()} disabled={loading || !targetPath}>
                {loading ? 'SCAFFOLDING...' : 'SCAFFOLD'}
              </PillButton>
            </div>

            {result && (
              <div
                style={{
                  border: `1px solid ${result.success ? 'var(--color-border)' : 'var(--color-critical)'}`,
                  padding: 'var(--spacing-4)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-metadata)',
                }}
              >
                {result.success ? (
                  <div>
                    <span style={{ color: 'var(--color-text)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                      ✓ {result.createdFiles.length} files created
                    </span>
                    {result.createdFiles.map((f) => (
                      <div key={f} style={{ color: 'var(--color-text-secondary)' }}>{f}</div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {result.errors.map((e, i) => (
                      <div key={i} style={{ color: 'var(--color-critical)' }}>{e}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function MechanicalToggle({ checked, onChange, label }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" style={{ gap: 'var(--spacing-3)' }}>
      <button
        role="switch"
        aria-checked={checked}
        className={`toggle ${checked ? 'toggle--on' : ''}`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <div className="toggle__thumb" />
      </button>
      {label && <span className="text-metadata">{label}</span>}
    </label>
  );
}

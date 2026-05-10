export function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--color-black)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--spacing-8)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-metadata)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          BOOTSTRAPPED
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--font-size-display)',
            margin: 0,
          }}
        >
          H-ORCHESTRA
        </h1>
      </div>
    </main>
  );
}

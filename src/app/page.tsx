export default function LandingPage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        maxWidth: '600px',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          fontWeight: 700
        }}>Finboard</h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>Take Control of Your Finances</p>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>Track your expenses, analyze your spending patterns, and achieve your financial goals.</p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a href="/signup" style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: 'white',
            color: '#667eea',
            transition: 'all 0.3s ease'
          }}>Get Started Free</a>
          <a href="/login" style={{
            padding: '12px 24px',
            border: '2px solid white',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: 'transparent',
            color: 'white',
            transition: 'all 0.3s ease'
          }}>Sign In</a>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'Danubia' && password === 'F2372dff7c%') {
        localStorage.setItem('auth', 'true');
        router.push('/');
      } else {
        setError('Usuário ou senha incorretos');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: '300' }}>Painel</h1>
          <p style={{ fontSize: '12px', letterSpacing: '3px', color: '#999', textTransform: 'uppercase', margin: '0 0 20px 0' }}>
            Controle Centralizado
          </p>
          <p style={{ fontSize: '14px', margin: 0, color: '#666' }}>
            Danúbia Leite
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#999',
              display: 'block',
              marginBottom: '8px'
            }}>
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu usuário"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#999',
              display: 'block',
              marginBottom: '8px'
            }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="sua senha"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{
              fontSize: '14px',
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(175, 148, 140, 0.1)',
              color: '#af948c',
              borderRadius: '4px',
              margin: '0 0 16px 0'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#af948c',
              color: 'white',
              fontSize: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '32px',
          color: '#999',
          margin: '32px 0 0 0'
        }}>
          Painel exclusivo — Acesso restrito
        </p>
      </div>
    </div>
  );
}

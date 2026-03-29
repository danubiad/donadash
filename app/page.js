'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('auth');
    if (!token) {
      router.push('/login');
    } else {
      setAuth(true);
    }
  }, [router]);

  if (!auth) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', background: '#2a2a2a', color: 'white', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>DonaSystem</h2>
        <p style={{ margin: '0 0 40px 0', fontSize: '12px', color: '#999' }}>Painel de Controle</p>
        
        <nav>
          <div style={{ marginBottom: '16px' }}>
            <a href="/" style={{ color: '#af948c', textDecoration: 'none', fontSize: '14px' }}>Dashboard</a>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <a href="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Agentes</a>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <a href="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>Projetos</a>
          </div>
        </nav>
      </div>
      
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0' }}>Painel de Controle</h1>
          <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #999' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>A Fazer</h3>
            <div style={{ fontSize: '13px', marginBottom: '8px' }}>Buscar novidades em grupos</div>
            <div style={{ fontSize: '13px' }}>Atualizar catálogo</div>
          </div>
          
          <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #af948c' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#af948c', textTransform: 'uppercase', letterSpacing: '1px' }}>Fazendo</h3>
            <div style={{ fontSize: '13px' }}>Preparar email marketing</div>
          </div>
          
          <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #afa08c' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#afa08c', textTransform: 'uppercase', letterSpacing: '1px' }}>Revisão</h3>
            <div style={{ fontSize: '13px' }}>Design de campanha</div>
          </div>
          
          <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #96af8c' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#96af8c', textTransform: 'uppercase', letterSpacing: '1px' }}>Feito</h3>
            <div style={{ fontSize: '13px' }}>Relatório semanal</div>
          </div>
        </div>
      </main>
    </div>
  );
}

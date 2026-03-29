'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const firebaseConfig = {
  apiKey: "AIzaSyDSRV3tp-_MP9mdQNbwPErsJQnQ0ofZx0",
  authDomain: "donadash-594f7.firebaseapp.com",
  projectId: "donadash-594f7",
  storageBucket: "donadash-594f7.firebasestorage.app",
  messagingSenderId: "227540899665",
  appId: "1:227540899665:web:5ea25fa25abd8abc2f570",
  measurementId: "G-K2W46N4H7P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const agents = [
  { name: 'Content Harvester', role: 'Busca de novidades', status: 'idle' },
  { name: 'Catalog Manager', role: 'Gerenciador de catálogo', status: 'running' },
  { name: 'Email Automator', role: 'Automação de emails', status: 'idle' },
  { name: 'Tráfego Specialist', role: 'Gestão de tráfego pago', status: 'idle' },
];

const notifications = [
  { id: 1, type: 'alert', message: 'Catálogo Shopee precisa de atualização', priority: 'high' },
  { id: 2, type: 'info', message: 'Novo email de revendedora aguardando resposta', priority: 'medium' },
  { id: 3, type: 'success', message: 'Relatório semanal concluído com sucesso', priority: 'low' },
];

const pageContent = {
  dashboard: { title: 'Dashboard' },
  agentes: { title: 'Agentes' },
  conteudo: { title: 'Conteúdo' },
  funis: { title: 'Funis' },
  trafego: { title: 'Tráfego' },
  crm: { title: 'CRM' },
  biblioteca: { title: 'Biblioteca' },
  chat: { title: 'Chat' },
  suporte: { title: 'Suporte' },
  crons: { title: 'Crons' },
  pesquisa: { title: 'Pesquisa' },
  memoria: { title: 'Memória' },
  skills: { title: 'Skills' },
  seguranca: { title: 'Segurança' },
  logs: { title: 'Logs' },
  vendas: { title: 'Vendas' },
};

export default function Home() {
  const [auth, setAuth] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('auth');
    if (!token) {
      router.push('/login');
    } else {
      setAuth(true);
      loadTasks();
    }
  }, [router]);

  const loadTasks = async () => {
    try {
      const tasksCollection = collection(db, 'tasks');
      const taskSnapshot = await getDocs(tasksCollection);
      const tasksList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const tasksCollection = collection(db, 'tasks');
      await addDoc(tasksCollection, newTask);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const handleMoveTask = async (taskId, newColumn) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { column: newColumn });
      const updated = tasks.map(t => t.id === taskId ? { ...t, column: newColumn } : t);
      setTasks(updated);
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      await loadTasks();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    router.push('/login');
  };

  if (!auth) return null;

  const currentPage = pageContent[activeView] || { title: 'Dashboard' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', width: '100%' }}>
      {/* SIDEBAR */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', width: '100%' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
            {currentPage.title}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '14px' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* CONTEÚDO POR VIEW */}
        {activeView === 'dashboard' && (
          loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
          ) : (
            <Dashboard 
              tasks={tasks} 
              onAddTask={handleAddTask} 
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
          )
        )}

        {activeView === 'agentes' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {agents.map((agent, idx) => (
                <div key={idx} style={{ 
                  background: 'var(--bg-card)', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: `4px solid ${agent.status === 'running' ? 'var(--color-success)' : 'var(--text-tertiary)'}`,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>{agent.name}</h3>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '11px', 
                      background: agent.status === 'running' ? 'rgba(150, 175, 140, 0.15)' : 'rgba(153, 153, 153, 0.15)',
                      color: agent.status === 'running' ? 'var(--color-success)' : 'var(--text-tertiary)',
                      fontWeight: '600'
                    }}>
                      {agent.status === 'running' ? '🟢 Ativo' : '⚪ Inativo'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>{agent.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {['conteudo', 'funis', 'trafego', 'crm', 'biblioteca', 'chat', 'suporte', 'crons', 'pesquisa', 'memoria', 'skills', 'seguranca', 'logs', 'vendas'].includes(activeView) && (
          <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '8px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <p style={{ fontSize: '16px', margin: 0 }}>Seção "{currentPage.title}" em desenvolvimento</p>
            <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>Funcionalidades serão adicionadas em breve</p>
          </div>
        )}
      </main>
    </div>
  );
}

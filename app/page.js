'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'agentes', label: 'Agentes', icon: '🤖' },
  { id: 'conteudo', label: 'Conteúdo', icon: '📝' },
  { id: 'funis', label: 'Funis', icon: '📈' },
  { id: 'trafego', label: 'Tráfego', icon: '🎯' },
  { id: 'crm', label: 'CRM', icon: '👥' },
  { id: 'biblioteca', label: 'Biblioteca', icon: '📚' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'suporte', label: 'Suporte', icon: '🆘' },
  { id: 'crons', label: 'Crons', icon: '⏰' },
  { id: 'pesquisa', label: 'Pesquisa', icon: '🔍' },
  { id: 'memoria', label: 'Memória', icon: '🧠' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'seguranca', label: 'Segurança', icon: '🔐' },
  { id: 'logs', label: 'Logs', icon: '📋' },
  { id: 'vendas', label: 'Vendas', icon: '💰' },
];

const columns = [
  { id: 'backlog', title: 'A Fazer', color: '#999' },
  { id: 'doing', title: 'Fazendo', color: '#af948c' },
  { id: 'review', title: 'Revisão', color: '#afa08c' },
  { id: 'done', title: 'Feito', color: '#96af8c' },
];

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

const metrics = [
  { label: 'Faturamento (Mês)', value: 'R$ 80.000', color: '#af948c' },
  { label: 'Revendedoras Ativas', value: '1.240', color: '#96af8c' },
  { label: 'Leads da Semana', value: '342', color: '#afa08c' },
  { label: 'Conversão', value: '12.5%', color: '#8ca4af' },
];

const PageComponent = ({ view, title }) => (
  <div>
    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>{title}</h2>
    <div style={{ background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
      <p style={{ fontSize: '16px', margin: 0 }}>Seção "{title}" em desenvolvimento</p>
      <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>Funcionalidades serão adicionadas em breve</p>
    </div>
  </div>
);

export default function Home() {
  const [auth, setAuth] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', column: 'backlog' });
  const [view, setView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const saveTasks = (newTasks) => {
    try {
      setTasks(newTasks);
    } catch (error) {
      console.error('Erro ao salvar:', error);
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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const tasksCollection = collection(db, 'tasks');
      await addDoc(tasksCollection, newTask);
      setNewTask({ title: '', description: '', column: 'backlog' });
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

  if (!auth) return null;

  const currentMenu = menuItems.find(item => item.id === view);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* SIDEBAR */}
      <div style={{ 
        width: '280px', 
        background: '#1a1a1a', 
        color: 'white', 
        padding: '20px', 
        overflowY: 'auto', 
        borderRight: '1px solid #333',
        position: mobileMenuOpen ? 'fixed' : 'static',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 1000
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>DonaSystem</h2>
        <p style={{ margin: '0 0 30px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Painel de Controle</p>
        
        <nav style={{ marginBottom: '40px' }}>
          {menuItems.map(item => (
            <div 
              key={item.id}
              onClick={() => {
                setView(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                marginBottom: '12px',
                padding: '12px 16px',
                background: view === item.id ? '#af948c' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: view === item.id ? 'white' : '#ccc',
                borderLeft: view === item.id ? '3px solid #fff' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (view !== item.id) {
                  e.currentTarget.style.background = '#2a2a2a';
                }
              }}
              onMouseLeave={(e) => {
                if (view !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem('auth');
            router.push('/login');
          }}
          style={{
            background: '#af948c',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Sair
        </button>
      </div>
      
      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>
                {currentMenu?.label || 'Dashboard'}
              </h1>
              <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* STATUS BAR - Só mostra no Dashboard */}
          {view === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {metrics.map((metric, idx) => (
                <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: `4px solid ${metric.color}` }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{metric.label}</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: metric.color }}>{metric.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTEÚDO POR VIEW */}
        {view === 'dashboard' && (
          <>
            <form onSubmit={handleAddTask} style={{ marginBottom: '40px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Adicionar Nova Tarefa</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '12px', alignItems: 'flex-end' }}>
                <input
                  type="text"
                  placeholder="Título"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
                <input
                  type="text"
                  placeholder="Descrição"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                />
                <select
                  value={newTask.column}
                  onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
                <button type="submit" style={{ padding: '10px 20px', background: '#af948c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                  Adicionar
                </button>
              </div>
            </form>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Carregando tarefas...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {columns.map(column => (
                  <div key={column.id} style={{ background: 'white', borderRadius: '8px', padding: '16px', minHeight: '500px', border: `2px solid ${column.color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: column.color, fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {column.title}
                    </h3>
                    
                    {tasks
                      .filter(task => task.column === column.id)
                      .map(task => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('taskId', task.id);
                          }}
                          style={{
                            background: '#f9f9f9',
                            padding: '12px',
                            marginBottom: '12px',
                            borderRadius: '4px',
                            borderLeft: `4px solid ${column.color}`,
                            cursor: 'grab',
                            userSelect: 'none'
                          }}
                        >
                          <p style={{ fontSize: '14px', marginBottom: '4px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                            {task.title}
                          </p>
                          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
                            {task.description}
                          </p>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            style={{
                              fontSize: '11px',
                              padding: '4px 8px',
                              background: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            Deletar
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === 'agentes' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {agents.map((agent, idx) => (
                <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: `4px solid ${agent.status === 'running' ? '#96af8c' : '#999'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{agent.name}</h3>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      background: agent.status === 'running' ? '#d4f4dd' : '#f0f0f0',
                      color: agent.status === 'running' ? '#2d7a3d' : '#666'
                    }}>
                      {agent.status === 'running' ? '🟢 Ativo' : '⚪ Inativo'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{agent.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {['conteudo', 'funis', 'trafego', 'crm', 'biblioteca', 'chat', 'suporte', 'crons', 'pesquisa', 'memoria', 'skills', 'seguranca', 'logs', 'vendas'].includes(view) && (
          <PageComponent view={view} title={currentMenu?.label} />
        )}
      </main>
    </div>
  );
}

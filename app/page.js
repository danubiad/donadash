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

export default function Home() {
  const [auth, setAuth] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', column: 'backlog' });
  const [view, setView] = useState('kanban');
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

  const handleMoveTask = async (taskId, newColumn) => {
    try {
      // Atualizar no Firestore
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { column: newColumn });
      
      // Atualizar localmente
      const updated = tasks.map(t => t.id === taskId ? { ...t, column: newColumn } : t);
      setTasks(updated);
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      // Se falhar, recarrega do Firestore
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <div style={{ width: '250px', background: '#2a2a2a', color: 'white', padding: '20px', overflowY: 'auto', borderRight: '1px solid #444' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>DonaSystem</h2>
        <p style={{ margin: '0 0 40px 0', fontSize: '12px', color: '#999' }}>Painel de Controle</p>
        
        <nav>
          <div style={{ marginBottom: '16px', padding: '8px 12px', background: view === 'kanban' ? '#af948c' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setView('kanban')}>
            <a style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Dashboard</a>
          </div>
          <div style={{ marginBottom: '16px', padding: '8px 12px', background: view === 'agentes' ? '#af948c' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setView('agentes')}>
            <a style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Agentes</a>
          </div>
          <div style={{ marginBottom: '16px', padding: '8px 12px', background: view === 'notificacoes' ? '#af948c' : 'transparent', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setView('notificacoes')}>
            <a style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Notificações</a>
          </div>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem('auth');
            router.push('/login');
          }}
          style={{
            background: '#af948c',
            color: 'white',
            padding: '12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            marginTop: '40px',
            fontSize: '14px'
          }}
        >
          Sair
        </button>
      </div>
      
      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f5f5f5' }}>
        {/* HEADER COM STATUS */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Painel de Controle</h1>
            <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* STATUS BAR - MÉTRICAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {metrics.map((metric, idx) => (
              <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: `4px solid ${metric.color}` }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{metric.label}</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: metric.color }}>{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VIEW: KANBAN */}
        {view === 'kanban' && (
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
                  <div 
                key={column.id} 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('taskId');
                  console.log('Drop na coluna - taskId:', taskId, 'column:', column.id);
                  if (taskId) {
                    handleMoveTask(taskId, column.id);
                  }
                }}
                style={{ background: 'white', borderRadius: '8px', padding: '16px', minHeight: '500px', border: `2px solid ${column.color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
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
                            console.log('Drag start - taskId:', task.id);
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

        {/* VIEW: AGENTES */}
        {view === 'agentes' && (
          <div>
            <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Agentes Ativos</h2>
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

        {/* VIEW: NOTIFICAÇÕES */}
        {view === 'notificacoes' && (
          <div>
            <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Notificações</h2>
            <div style={{ maxWidth: '600px' }}>
              {notifications.map((notif) => (
                <div key={notif.id} style={{ 
                  background: 'white', 
                  padding: '16px', 
                  marginBottom: '12px', 
                  borderRadius: '8px', 
                  borderLeft: `4px solid ${notif.priority === 'high' ? '#ff6b6b' : notif.priority === 'medium' ? '#ffa94d' : '#96af8c'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>{notif.message}</p>
                      <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>
                        {notif.priority === 'high' ? '⚠️ Alta prioridade' : notif.priority === 'medium' ? '📌 Média prioridade' : '✅ Baixa prioridade'}
                      </span>
                    </div>
                    <button style={{ background: '#f0f0f0', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>
                      Marcar como lida
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

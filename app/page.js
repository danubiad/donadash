'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const columns = [
  { id: 'backlog', title: 'A Fazer', color: '#999' },
  { id: 'doing', title: 'Fazendo', color: '#af948c' },
  { id: 'review', title: 'Revisão', color: '#afa08c' },
  { id: 'done', title: 'Feito', color: '#96af8c' },
];

export default function Home() {
  const [auth, setAuth] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', column: 'backlog' });
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
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { column: newColumn });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, column: newColumn } : t));
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const tasksCollection = collection(db, 'tasks');
      await addDoc(tasksCollection, newTask);
      setNewTask({ title: '', description: '', column: 'backlog' });
      loadTasks();
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

  if (!auth || loading) return null;

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
      
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0' }}>Painel de Controle</h1>
          <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <form onSubmit={handleAddTask} style={{ marginBottom: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Adicionar Nova Tarefa</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input
              type="text"
              placeholder="Descrição"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
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
            <button type="submit" style={{ padding: '10px 20px', background: '#af948c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Adicionar
            </button>
          </div>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {columns.map(column => (
            <div key={column.id} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px', minHeight: '500px', border: `2px solid ${column.color}` }}>
              <h3 style={{ margin: '0 0 16px 0', color: column.color, fontSize: '14px', fontWeight: 'bold' }}>
                {column.title}
              </h3>
              
              {tasks
                .filter(task => task.column === column.id)
                .map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.effectAllowed = 'move'}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleMoveTask(task.id, column.id);
                    }}
                    style={{
                      background: 'white',
                      padding: '12px',
                      marginBottom: '12px',
                      borderRadius: '4px',
                      borderLeft: `4px solid ${column.color}`,
                      cursor: 'grab',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <p style={{ fontSize: '14px', marginBottom: '4px', fontWeight: 'bold' }}>
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
      </main>
    </div>
  );
}

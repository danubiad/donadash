'use client';
import { useState } from 'react';

const columns = [
  { id: 'backlog', title: 'A Fazer', color: '#6B7280' },
  { id: 'doing', title: 'Fazendo', color: '#8ca4af' },
  { id: 'review', title: 'Revisão', color: '#afa08c' },
  { id: 'done', title: 'Feito', color: '#96af8c' },
];

const metrics = [
  { label: 'Faturamento (Mês)', value: 'R$ 80.000', color: '#af948c' },
  { label: 'Revendedoras Ativas', value: '1.240', color: '#96af8c' },
  { label: 'Leads da Semana', value: '342', color: '#afa08c' },
  { label: 'Conversão', value: '12.5%', color: '#8ca4af' },
];

export default function Dashboard({ tasks, onAddTask, onDeleteTask, onMoveTask }) {
  const [newTask, setNewTask] = useState({ title: '', description: '', column: 'backlog' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    onAddTask(newTask);
    setNewTask({ title: '', description: '', column: 'backlog' });
  };

  return (
    <div>
      {/* METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {metrics.map((metric, idx) => (
          <div key={idx} style={{ 
            background: 'var(--bg-card)', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: 'var(--shadow-sm)',
            borderLeft: `4px solid ${metric.color}`,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {metric.label}
            </p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: metric.color }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* ADD TASK FORM */}
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: '40px', 
        padding: '20px', 
        background: 'var(--bg-card)', 
        borderRadius: '8px', 
        boxShadow: 'var(--shadow-sm)' 
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Adicionar Nova Tarefa</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '12px', alignItems: 'flex-end' }}>
          <input
            type="text"
            placeholder="Título"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            value={newTask.column}
            onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
          >
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.title}</option>
            ))}
          </select>
          <button type="submit" style={{ 
            background: 'var(--accent)', 
            color: 'white', 
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Adicionar
          </button>
        </div>
      </form>

      {/* KANBAN BOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {columns.map(column => (
          <div 
            key={column.id} 
            style={{ 
              background: 'var(--bg-card)', 
              borderRadius: '8px', 
              padding: '16px', 
              minHeight: '500px', 
              border: `2px solid ${column.color}`,
              boxShadow: 'var(--shadow-sm)'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const taskId = e.dataTransfer.getData('taskId');
              if (taskId) {
                onMoveTask(taskId, column.id);
              }
            }}
          >
            <h3 style={{ 
              margin: '0 0 16px 0', 
              color: column.color, 
              fontSize: '14px', 
              fontWeight: '700', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
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
                    background: 'var(--bg-main)',
                    padding: '12px',
                    marginBottom: '12px',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${column.color}`,
                    cursor: 'grab',
                    userSelect: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                >
                  <p style={{ fontSize: '14px', marginBottom: '4px', fontWeight: '600', margin: '0 0 4px 0' }}>
                    {task.title}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 8px 0' }}>
                    {task.description}
                  </p>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      background: 'var(--color-danger)',
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
    </div>
  );
}

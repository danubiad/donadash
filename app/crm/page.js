'use client';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

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
  { id: 'leads', title: 'Leads', color: '#8ca4af' },
  { id: 'abordados', title: 'Abordados', color: '#afa08c' },
  { id: 'agendados', title: 'Agendados', color: '#9d8caf' },
  { id: 'followup', title: 'Follow Up', color: '#afa08c' },
  { id: 'desistentes', title: 'Desistentes', color: '#af948c' },
  { id: 'compras', title: 'Compras Feitas', color: '#96af8c' },
];

export default function CRMPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'whatsapp',
    value: 0,
    notes: '',
    status: 'leads'
  });
  const [draggedLead, setDraggedLead] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const leadsCollection = collection(db, 'crm_leads');
      const leadsSnapshot = await getDocs(leadsCollection);
      const leadsList = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsList);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    if (!newLead.name.trim()) return;

    try {
      const leadsCollection = collection(db, 'crm_leads');
      await addDoc(leadsCollection, {
        ...newLead,
        value: parseInt(newLead.value) || 0,
        createdAt: new Date().toISOString()
      });
      setNewLead({
        name: '',
        phone: '',
        email: '',
        source: 'whatsapp',
        value: 0,
        notes: '',
        status: 'leads'
      });
      await loadLeads();
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
    }
  };

  const handleMoveLead = async (leadId, newStatus) => {
    try {
      const leadRef = doc(db, 'crm_leads', leadId);
      await updateDoc(leadRef, { status: newStatus });
      await loadLeads();
    } catch (error) {
      console.error('Erro ao mover lead:', error);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      const leadRef = doc(db, 'crm_leads', leadId);
      await deleteDoc(leadRef);
      await loadLeads();
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
    }
  };

  // Cálculos de métricas
  const totalLeads = leads.length;
  const leadsEmPipeline = leads.filter(l => ['leads', 'abordados', 'agendados', 'followup'].includes(l.status));
  const pipelineValue = leadsEmPipeline.reduce((sum, l) => sum + (l.value || 0), 0);
  const comprasFinal = leads.filter(l => l.status === 'compras');
  const totalConvertido = comprasFinal.reduce((sum, l) => sum + (l.value || 0), 0);
  const taxaConversao = totalLeads > 0 ? ((comprasFinal.length / totalLeads) * 100).toFixed(1) : 0;

  const filteredLeads = (status) => {
    return leads
      .filter(l => l.status === status)
      .filter(l => 
        !search || 
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search) ||
        l.email.toLowerCase().includes(search.toLowerCase())
      );
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando CRM...</div>;
  }

  return (
    <div>
      {/* MÉTRICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #8ca4af' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total de Leads</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#8ca4af' }}>{totalLeads}</p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #afa08c' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Pipeline</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#afa08c' }}>R$ {pipelineValue.toLocaleString('pt-BR')}</p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #96af8c' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Convertido</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#96af8c' }}>R$ {totalConvertido.toLocaleString('pt-BR')}</p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #af948c' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Taxa Conversão</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#af948c' }}>{taxaConversao}%</p>
        </div>
      </div>

      {/* FORMULÁRIO NOVO LEAD */}
      <form onSubmit={handleAddLead} style={{ 
        marginBottom: '40px', 
        padding: '20px', 
        background: 'var(--bg-card)', 
        borderRadius: '8px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Novo Lead</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Nome"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
          <input
            type="number"
            placeholder="Valor esperado (R$)"
            value={newLead.value}
            onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
          />
          <select
            value={newLead.source}
            onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="site">Site</option>
            <option value="indicacao">Indicação</option>
          </select>
          <input
            type="text"
            placeholder="Notas"
            value={newLead.notes}
            onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
          />
        </div>
        <button type="submit" style={{ background: 'var(--accent)', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
          Adicionar Lead
        </button>
      </form>

      {/* BUSCA */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '6px' }}
        />
      </div>

      {/* KANBAN BOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
        {columns.map(column => (
          <div
            key={column.id}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '8px',
              padding: '16px',
              minHeight: '600px',
              border: `2px solid ${column.color}`,
              boxShadow: 'var(--shadow-sm)'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedLead) {
                handleMoveLead(draggedLead.id, column.id);
              }
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', color: column.color, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>
              {column.title} ({filteredLeads(column.id).length})
            </h3>

            {filteredLeads(column.id).map(lead => (
              <div
                key={lead.id}
                draggable
                onDragStart={() => setDraggedLead(lead)}
                style={{
                  background: 'var(--bg-main)',
                  padding: '12px',
                  marginBottom: '10px',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${column.color}`,
                  cursor: 'grab',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 4px 0' }}>{lead.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>{lead.phone || lead.email}</p>
                {lead.value > 0 && (
                  <p style={{ fontSize: '12px', fontWeight: '600', color: column.color, margin: '0 0 8px 0' }}>
                    R$ {lead.value.toLocaleString('pt-BR')}
                  </p>
                )}
                {lead.notes && (
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                    {lead.notes}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '10px', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '3px' }}>
                    {lead.source}
                  </span>
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--color-danger)', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

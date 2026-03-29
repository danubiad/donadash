#!/usr/bin/env node

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'donadash-594f7'
});

const db = admin.firestore();

// Create WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Extrair informações de contato
function extractContactInfo(message) {
  const phone = message.from.replace('@c.us', '');
  const name = message._data.notifyName || message.author || 'Desconhecido';
  
  return {
    phone: `+${phone}`,
    name: name.trim(),
    source: 'whatsapp'
  };
}

// Criar ou atualizar lead no Firestore
async function createOrUpdateLead(contactInfo, message) {
  try {
    const leadsRef = db.collection('crm_leads');
    
    // Buscar lead existente
    const existing = await leadsRef
      .where('phone', '==', contactInfo.phone)
      .limit(1)
      .get();

    if (existing.empty) {
      // Criar novo lead
      await leadsRef.add({
        name: contactInfo.name,
        phone: contactInfo.phone,
        email: '',
        source: 'whatsapp',
        value: 0,
        notes: `Primeira mensagem: "${message.body}"`,
        status: 'leads',
        createdAt: new Date().toISOString(),
        lastMessage: message.body,
        lastMessageTime: new Date().toISOString(),
        messageCount: 1
      });
      
      console.log(`✅ Novo lead criado: ${contactInfo.name} (${contactInfo.phone})`);
    } else {
      // Atualizar lead existente
      const leadId = existing.docs[0].id;
      const leadData = existing.docs[0].data();
      
      await leadsRef.doc(leadId).update({
        lastMessage: message.body,
        lastMessageTime: new Date().toISOString(),
        messageCount: (leadData.messageCount || 0) + 1,
        notes: `${leadData.notes || ''}\n[${new Date().toLocaleTimeString()}] ${message.body}`
      });
      
      console.log(`📝 Lead atualizado: ${contactInfo.name} (${contactInfo.phone})`);
    }
  } catch (error) {
    console.error('❌ Erro ao salvar lead:', error);
  }
}

// Evento: QR Code gerado
client.on('qr', (qr) => {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  SCANNEA O QR CODE COM SEU WHATSAPP    ║');
  console.log('║  (Aponte a câmera do seu celular aqui) ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  qrcode.generate(qr, { small: true });
  
  console.log('\n⏳ Aguardando confirmação...\n');
});

// Evento: Cliente pronto
client.on('ready', () => {
  console.log('\n✅ WhatsApp conectado com sucesso!\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🟢 SISTEMA ATIVO - Puxando mensagens pro CRM');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('  Deixa este terminal aberto para que as mensagens');
  console.log('  continuem sendo sincronizadas com o Firestore.\n');
  console.log('  Para parar: Ctrl+C\n');
});

// Evento: Mensagem recebida
client.on('message_create', async (message) => {
  // Ignorar mensagens do próprio bot
  if (message.fromMe) {
    return;
  }

  // Ignorar grupos (apenas DMs)
  if (message.isGroup) {
    return;
  }

  console.log(`\n📱 Mensagem recebida:`);
  console.log(`   De: ${message._data.notifyName || 'Desconhecido'}`);
  console.log(`   Telefone: ${message.from.replace('@c.us', '')}`);
  console.log(`   Mensagem: "${message.body}"\n`);

  // Extrair informações de contato
  const contactInfo = extractContactInfo(message);

  // Criar ou atualizar lead
  await createOrUpdateLead(contactInfo, message);
});

// Evento: Erro
client.on('error', (error) => {
  console.error('❌ Erro na conexão:', error);
});

// Evento: Desconectado
client.on('disconnected', (reason) => {
  console.log('❌ Desconectado:', reason);
});

// Iniciar cliente
console.log('\n🚀 Iniciando WhatsApp Bot...\n');
client.initialize();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando bot...');
  client.destroy();
  process.exit(0);
});

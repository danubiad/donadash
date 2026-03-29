# Conectar WhatsApp ao CRM DonaSystem

## O que faz?

Este script conecta seu WhatsApp no terminal, gera um **QR Code** para você scanear com seu celular, e **automaticamente puxa todas as mensagens recebidas para o CRM** do painel.

## Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn
- Uma conta Google com Firebase configurado (já tem!)

## Passo 1: Instalar dependências

```bash
npm install whatsapp-web.js qrcode-terminal firebase-admin
```

Ou se usar Yarn:
```bash
yarn add whatsapp-web.js qrcode-terminal firebase-admin
```

## Passo 2: Baixar credenciais Firebase

**Você precisa de um arquivo `firebase-service-account.json`** com as credenciais de serviço do Firebase.

### Como obter:

1. Abra o **Firebase Console**: https://console.firebase.google.com/project/donadash-594f7/settings/serviceaccounts/adminsdk
2. Clique em **"Gerar nova chave privada"**
3. Um arquivo JSON vai ser baixado no seu computador
4. **Renomeie para `firebase-service-account.json`**
5. **Cole no diretório raiz do projeto** (ao lado do `whatsapp-bot.js`)

## Passo 3: Rodar o script

Na pasta do projeto, execute:

```bash
node whatsapp-bot.js
```

Ou adicione ao `package.json` (mais fácil):

```json
"scripts": {
  "whatsapp:connect": "node whatsapp-bot.js"
}
```

Então execute:
```bash
npm run whatsapp:connect
```

## Passo 4: Scanear o QR Code

1. O script vai gerar um **QR Code no terminal**
2. Abra o WhatsApp no seu **celular** (o mesmo número que quer conectar)
3. Aponte a câmera para o QR Code no terminal
4. Confirme a autenticação

## Passo 5: Acompanhar as mensagens

Assim que conectar, o script vai começar a receber mensagens e **automaticamente criar leads no CRM**:

```
📱 Mensagem recebida:
   De: Sara Silva
   Telefone: +5511999999999
   Mensagem: "Qual é o preço da calcinha?"

✅ Novo lead criado: Sara Silva (+5511999999999)
```

## O que acontece?

Cada mensagem recebida:
- ✅ Cria um **novo lead** no CRM (se for primeiro contato)
- ✅ **Atualiza** o lead existente (se já estiver no CRM)
- ✅ Registra a **última mensagem** e hora
- ✅ Conta **quantas mensagens** a pessoa mandou

## Ver leads no painel

1. Acesse: https://donadash.vercel.app
2. Faça login com `Danubia` / `F2372dff7c%`
3. Clique em **"CRM"** no menu lateral
4. Os leads aparecem na coluna **"Leads"**
5. Você pode arrastar para outras colunas (Abordados, Agendados, etc.)

## Deixar rodando 24/7

Se quiser que o bot fique **sempre ativo** (mesmo quando você fecha o terminal):

### Opção 1: PM2 (Recomendado)

```bash
npm install -g pm2
pm2 start whatsapp-bot.js --name "whatsapp-crm"
pm2 logs whatsapp-crm
pm2 save
```

### Opção 2: Screen (Linux/Mac)

```bash
screen -S whatsapp-bot
node whatsapp-bot.js
# Ctrl+A, depois D para sair (mas deixa rodando)
```

### Opção 3: Rodar em um servidor VPS

Se tiver um servidor Linux (DigitalOcean, AWS, etc), você pode fazer o bot rodar lá 24/7.

## Erros comuns

### "firebase-service-account.json not found"
- Verifique se o arquivo está na pasta raiz do projeto
- Certifique-se que o nome está **exato**: `firebase-service-account.json`

### "Cannot find module 'whatsapp-web.js'"
- Execute: `npm install whatsapp-web.js`

### "QR Code não aparece"
- Certifique-se que seu terminal suporta caracteres especiais
- Tente em outro terminal (VS Code, iTerm2, etc)

### "Timed out waiting for QR code"
- Sua conexão pode estar lenta
- Tente novamente em uma conexão mais rápida

## Próximos passos

1. ✅ Conectar WhatsApp
2. ⏳ Integrar Instagram (após WhatsApp funcionar)
3. ⏳ Integrar Shopee (após Instagram)
4. ⏳ Automação de respostas

## Suporte

Se tiver problemas, compartilhe o erro que aparece no terminal!

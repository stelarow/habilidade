# Guia Rápido: Netlify Functions com Logging Avançado

## 🚀 Deploy em Produção (Netlify)

### 1. Deploy Automático

As functions são **automaticamente deployadas** quando você faz push para o repositório conectado ao Netlify:

```bash
git add .
git commit -m "Add Netlify Functions with advanced logging"
git push origin main
```

✅ **As functions ficam disponíveis em produção em:**
- `https://seu-site.netlify.app/.netlify/functions/health-check`
- `https://seu-site.netlify.app/.netlify/functions/contact-handler`
- `https://seu-site.netlify.app/.netlify/functions/dev-logger`
- `https://seu-site.netlify.app/.netlify/functions/blog-analytics`

### 2. Verificar Deploy

```bash
# Testar health check em produção
curl https://seu-site.netlify.app/.netlify/functions/health-check

# Ou acessar diretamente no browser
```

### 3. Configurar Variáveis de Ambiente (Opcional)

No **Netlify Dashboard** > **Site settings** > **Environment variables**:

```
NODE_ENV=production
EMAIL_SERVICE_API_KEY=sua-chave-aqui
```

## 🛠 Desenvolvimento Local (Para Testes)

### 1. Setup Local (Opcional - apenas para desenvolvimento)

```bash
# Instalar Netlify CLI se não tiver
npm install -g netlify-cli

# Login no Netlify
netlify login

# Link o projeto (se necessário)
netlify link
```

### 2. Testar Localmente (Opcional)

```bash
# Opção 1: Servidor completo (site + functions)
npm run functions:dev
# Acesso: http://localhost:8888

# Opção 2: Apenas functions
npm run functions:serve
# Acesso: http://localhost:9999
```

### 3. Testes Locais (Opcional)

```bash
# Teste automático de todas as functions
npm run functions:test

# Testes individuais
npm run functions:invoke:health
npm run functions:invoke:contact
npm run functions:invoke:logger
```

## 📋 Functions Disponíveis

| Function | Endpoint | Uso |
|----------|----------|-----|
| `health-check` | `GET /.netlify/functions/health-check` | Monitoramento de saúde |
| `contact-handler` | `POST /.netlify/functions/contact-handler` | Formulários de contato |
| `dev-logger` | `POST /.netlify/functions/dev-logger` | Logs de desenvolvimento |
| `blog-analytics` | `POST /.netlify/functions/blog-analytics` | Analytics do blog |

## 💡 Integração no Frontend

### Setup Automático

```javascript
// No seu App.jsx ou main.jsx
import { setupAutomaticTracking } from './services/netlifyFunctions';

// Setup uma vez na inicialização
setupAutomaticTracking({
  trackPageViews: true,
  trackPerformance: true,
  trackErrors: true
});
```

### Hooks React

```javascript
import { useContactForm, useBlogAnalytics, useDevLogger } from './services/netlifyFunctions';

function ContactForm() {
  const { submitForm, isSubmitting, success, error } = useContactForm();
  
  const handleSubmit = async (formData) => {
    const result = await submitForm(formData);
    // result contém { success, data, error }
  };
  
  return (
    // Seu formulário aqui
    <button onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? 'Enviando...' : 'Enviar'}
    </button>
  );
}

function BlogPost() {
  const { trackBlogRead } = useBlogAnalytics();
  
  useEffect(() => {
    // Rastrear quando artigo é lido
    trackBlogRead({
      slug: 'meu-artigo',
      readingTime: 300,
      scrollDepth: 85
    });
  }, []);
}
```

## 📊 Visualizando Logs em Produção

### 1. 🔥 Logs em Produção (Netlify Dashboard)

**✅ PRINCIPAL - Para uso em produção:**

1. Acesse seu site no [Netlify Dashboard](https://app.netlify.com)
2. Vá em **Logs** > **Functions**
3. Selecione a function específica (health-check, contact-handler, etc.)
4. Use filtros:
   - **Real-time**: Logs ao vivo
   - **Last hour/day**: Histórico
   - **Text filter**: Buscar por "ERROR", "SUCCESS", ID específico
   - **Log level**: INFO, ERROR, WARN, DEBUG

**🔍 Exemplo de busca no Netlify:**
- Digite `"contact_"` para ver todas as submissões de contato
- Digite `"ERROR"` para ver apenas erros
- Digite `"req-abc123"` para rastrear uma requisição específica

### 2. 📱 Logs em Tempo Real

No Netlify Dashboard, use a opção **"Real-time"** para ver logs conforme acontecem:
- Ideal para debugging em produção
- Logs aparecem instantaneamente quando function é executada
- Filtre por function específica

### 3. 🗄️ Retenção de Logs

- **Planos gratuitos**: Logs ficam disponíveis por **24 horas**
- **Planos pagos**: Logs ficam disponíveis por **7 dias**

### 4. 🛠 Desenvolvimento Local (Opcional)

Logs aparecerão diretamente no terminal onde rodou:
- `npm run functions:dev`
- `npm run functions:serve`

### 5. Estrutura dos Logs

```json
{
  "timestamp": "2025-01-18T10:30:45.123Z",
  "level": "INFO",
  "message": "Contact form processed successfully",
  "requestId": "req-123",
  "function": "contact-handler",
  "submissionId": "contact_123"
}
```

## 🔧 Exemplo Prático: Formulário de Contato

### 1. Frontend (React)

```javascript
import { useContactForm } from './services/netlifyFunctions';

function ContactForm() {
  const { submitForm, isSubmitting, success, error } = useContactForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(formData);
  };
  
  if (success) {
    return <div>✅ Mensagem enviada com sucesso!</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Nome"
      />
      <input 
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
      />
      <input 
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        placeholder="Assunto"
      />
      <textarea 
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        placeholder="Mensagem"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
      {error && <div>❌ {error}</div>}
    </form>
  );
}
```

### 2. Logs que Aparecerão no Netlify Dashboard

```json
2025-01-18T10:30:45.123Z	req-abc123	INFO	Incoming request
2025-01-18T10:30:45.200Z	req-abc123	INFO	Form validation passed
2025-01-18T10:30:45.350Z	req-abc123	INFO	Contact submission processing completed
2025-01-18T10:30:45.351Z	req-abc123	INFO	Function completed successfully - Execution time: 228ms
```

## 🧪 Testando Functions em Produção

### 1. Teste Direto no Browser

```
https://seu-site.netlify.app/.netlify/functions/health-check
```

### 2. Teste via cURL

```bash
# Health Check
curl https://escolahabilidade.com/.netlify/functions/health-check

# Contact Form (substitua pelos seus dados)
curl -X POST https://escolahabilidade.com/.netlify/functions/contact-handler \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Produção",
    "email": "teste@example.com",
    "subject": "Teste de Function",
    "message": "Testando function em produção"
  }'

# Blog Analytics
curl -X POST https://escolahabilidade.com/.netlify/functions/blog-analytics \
  -H "Content-Type: application/json" \
  -d '{
    "event": "page_view",
    "page": "/blog/teste"
  }'
```

### 3. Teste via JavaScript Console do Browser

Abra o console do browser (F12) no seu site e execute:

```javascript
// Teste do health check
fetch('/.netlify/functions/health-check')
  .then(r => r.json())
  .then(console.log);

// Teste do formulário de contato
fetch('/.netlify/functions/contact-handler', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Teste Browser',
    email: 'teste@example.com', 
    subject: 'Teste',
    message: 'Testando via browser console'
  })
})
.then(r => r.json())
.then(console.log);
```

## 🐛 Troubleshooting Rápido

### Function retorna 404

```bash
# Verificar se function existe
ls netlify/functions/

# Verificar se está exportando corretamente
grep "exports.handler" netlify/functions/sua-function.js
```

### Logs não aparecem

```bash
# Verificar se está usando console.log
grep "console.log\|logger\." netlify/functions/sua-function.js

# Testar function local
npm run functions:invoke:health
```

### CORS Error

Adicionar headers na response:

```javascript
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(data)
};
```

## 📚 Recursos Úteis

- **Documentação completa**: `netlify/functions/README.md`
- **Logs do Netlify**: [Dashboard](https://app.netlify.com) > Logs > Functions
- **CLI Help**: `netlify functions --help`
- **Debugging**: `npm run functions:debug` + Chrome DevTools

## 🔔 Monitoramento em Produção

### 1. Health Check Automático

Use a function health-check para monitoramento:

```bash
# Criar um cron job ou usar serviços como UptimeRobot
# Verifica a cada 5 minutos:
curl https://escolahabilidade.com/.netlify/functions/health-check
```

### 2. Alertas Baseados em Logs

No Netlify Dashboard, você pode:
- Configurar **Log Drains** (planos Enterprise)
- Usar **Function Metrics** para ver performance
- Monitorar **Error Rate** e **Invocation Count**

### 3. Exemplos de Logs Importantes

**🟢 Sucesso:**
```
INFO	Contact form processed successfully	{"submissionId":"contact_123"}
```

**🟡 Warning:**
```
WARN	Slow performance detected	{"duration":5000,"threshold":3000}
```

**🔴 Erro:**
```
ERROR	Contact submission processing failed	{"error":"Network timeout"}
```

### 4. Métricas Importantes

- **Execution time**: Deve ser < 2s para boa UX
- **Error rate**: Deve ser < 1% 
- **Memory usage**: Monitor para otimização
- **Invocation count**: Para entender uso

## 🚀 Deploy e Atualizações

### 1. Deploy Automático

```bash
# Fazer mudanças nas functions
git add netlify/functions/
git commit -m "Update functions with new features"
git push origin main

# Functions são automaticamente redesployadas
```

### 2. Verificar Deploy

1. Acesse **Netlify Dashboard** > **Deploys**
2. Veja se deploy incluiu as functions
3. Teste as functions após deploy
4. Verifique logs para erros

### 3. Rollback se Necessário

No Netlify Dashboard > **Deploys**:
- Clique no deploy anterior
- Click **"Publish deploy"** para fazer rollback

## 🎯 Próximos Passos para Produção

1. **✅ Fazer push das functions** para deploy automático
2. **📊 Configurar monitoramento** com health-check
3. **📧 Integrar contact-handler** com seu sistema de email
4. **📈 Usar blog-analytics** para métricas reais
5. **🔍 Monitorar logs** regularmente no Netlify Dashboard
6. **⚠️ Configurar alertas** para erros críticos

---

**🔥 IMPORTANTE para Produção**: 
- As functions funcionam **automaticamente em produção** após o push
- Logs ficam disponíveis **24h (free) ou 7 dias (paid)** 
- Use **Netlify Dashboard > Logs > Functions** para ver tudo em tempo real!
# 🎓 Escola Habilidade - Website

Site institucional da Escola Habilidade com sistema de formulário de contato integrado.

## ✨ Funcionalidades

- 🎨 Design moderno e responsivo
- 📱 Totalmente otimizado para mobile
- 📧 **Sistema de envio de emails (EmailJS)**
- 💬 Fallback para WhatsApp
- 🚀 Performance otimizada
- ♿ Acessibilidade implementada

## 📧 Sistema de Contato

O formulário de contato possui **dupla camada de segurança**:

1. **Envio por Email** (Principal)
   - Utiliza EmailJS para envio direto
   - Destino: `alessandro.ferreira@escolahabilidade.com`
   - Feedback visual ao usuário

2. **WhatsApp** (Fallback)
   - Ativado automaticamente se email falhar
   - Garante que nenhum lead seja perdido
   - Redirecionamento automático

## 🚀 Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Entre na pasta
cd Habilidade

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### 📧 Configurar EmailJS

1. **Acesse** [EmailJS.com](https://emailjs.com) e crie uma conta
2. **Configure** seguindo o guia em `EMAILJS_SETUP.md`
3. **Atualize** as chaves em `src/components/ContactForm.jsx`:

```javascript
const EMAIL_CONFIG = {
  SERVICE_ID: 'seu_service_id',
  TEMPLATE_ID: 'seu_template_id', 
  PUBLIC_KEY: 'sua_public_key'
};
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ContactForm.jsx  # 📧 Formulário com EmailJS
│   ├── Header.jsx       # Cabeçalho/Navegação
│   ├── Hero.jsx         # Seção principal
│   └── ...
├── utils/               # Utilitários
│   └── emailConfig.js   # ⚙️ Configurações de email
├── hooks/               # Hooks customizados
└── constants/           # Constantes
```

## 🔧 Tecnologias

- **React 19** - Framework principal
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **EmailJS** - Sistema de emails
- **Phosphor Icons** - Ícones
- **ESLint** - Linting

## 📱 Contato

- 📧 Email: alessandro.ferreira@escolahabilidade.com
- 📱 WhatsApp: (48) 98855-9491
- 📍 Endereço: Rua Exemplo, 123 - Kobrasol, São José - SC

---

**Desenvolvido para Escola Habilidade** 🎓

# Escola Habilidade

Site da Escola Habilidade desenvolvido com React e Vite.

## Tecnologias Utilizadas

- React 19
- Vite 7
- Tailwind CSS 4
- React Router Dom
- EmailJS

## Funcionalidades

- Design responsivo e moderno
- Sistema de contato por email
- Navegação fluida entre páginas
- Otimizado para performance

## Deploy

O site está automaticamente deployado no GitHub Pages através de GitHub Actions.

URL: https://stelarow.github.io/habilidade/

## Última atualização

Site atualizado com curso Design Gráfico corrigido - 2025-01-27 16:30

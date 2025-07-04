# Configuração MCP - Servidores Model Context Protocol

## 📍 Localização do Arquivo de Configuração

**Caminho:** `/mnt/c/Users/H2/AppData/Roaming/Claude/claude_desktop_config.json`

## 🚀 Como Acessar e Usar os MCPs

### 1. Para Editar as Configurações:
```bash
# Acessar o arquivo de configuração
code "/mnt/c/Users/H2/AppData/Roaming/Claude/claude_desktop_config.json"

# Ou via terminal
nano "/mnt/c/Users/H2/AppData/Roaming/Claude/claude_desktop_config.json"
```

### 2. Para Ativar os MCPs:
1. **Reiniciar o Claude Desktop** após qualquer alteração
2. Os MCPs ficam disponíveis automaticamente nas próximas sessões
3. Verificar na interface do Claude se os servidores estão conectados

### 3. Para Testar se os MCPs Estão Funcionando:
```bash
# Verificar se o arquivo existe
ls -la "/mnt/c/Users/H2/AppData/Roaming/Claude/claude_desktop_config.json"

# Ver o conteúdo atual
cat "/mnt/c/Users/H2/AppData/Roaming/Claude/claude_desktop_config.json"
```

## 🔧 Servidores MCP Configurados

| Servidor | Função | Requer Token |
|----------|---------|--------------|
| **context7** | Documentação e bibliotecas | ✅ API Key |
| **filesystem** | Acesso ao sistema de arquivos | ❌ |
| **git** | Operações Git avançadas | ❌ |
| **github** | Integração com GitHub | ✅ Token |
| **brave-search** | Busca web | ✅ API Key |
| **postgres** | Banco de dados PostgreSQL | ❌ |
| **puppeteer** | Automação de navegador | ❌ |
| **sqlite** | Banco de dados SQLite | ❌ |
| **fetch** | Requisições HTTP | ❌ |
| **everything** | Busca de arquivos Windows | ❌ |

## 🔑 Configuração de Tokens API (Opcional)

Para serviços que precisam de autenticação, edite o arquivo e substitua os placeholders:

```json
{
  "mcpServers": {
    "context7": {
      "env": {
        "CONTEXT7_API_KEY": "sua_chave_context7_aqui"
      }
    },
    "github": {
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "seu_token_github_aqui"
      }
    },
    "brave-search": {
      "env": {
        "BRAVE_API_KEY": "sua_chave_brave_aqui"
      }
    }
  }
}
```

## 📦 Instalação de Dependências (Se Necessário)

```bash
# Instalar servidores MCP globalmente
npm install -g @context7/mcp-server
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-puppeteer
npm install -g @modelcontextprotocol/server-sqlite
npm install -g @modelcontextprotocol/server-fetch
npm install -g @modelcontextprotocol/server-everything
```

## 🔄 Comandos Úteis

```bash
# Backup da configuração atual
cp "/mnt/c/Users/H2/AppData/Roaming/Claude/claude_desktop_config.json" "/mnt/c/Users/H2/habilidade/backup_mcp_config.json"

# Restaurar backup
cp "/mnt/c/Users/H2/habilidade/backup_mcp_config.json" "/mnt/c/Users/H2/AppData/Roaming/Claude/claude_desktop_config.json"

# Verificar se Claude está usando os MCPs
# (Após reiniciar o Claude Desktop, os servidores devem aparecer na interface)
```

## 📋 Checklist de Ativação

- [ ] Arquivo `claude_desktop_config.json` criado
- [ ] Reiniciar Claude Desktop
- [ ] Verificar se servidores MCP aparecem na interface
- [ ] Configurar tokens API se necessário
- [ ] Testar funcionalidades específicas dos MCPs

## 🆘 Solução de Problemas

- **MCPs não aparecem:** Verificar se o arquivo JSON está válido
- **Erro de conexão:** Verificar se as dependências estão instaladas
- **Falha de autenticação:** Verificar tokens API
- **Caminho incorreto:** Usar sempre o caminho absoluto completo

---

**Última atualização:** $(date)  
**Projeto:** /mnt/c/Users/H2/habilidade  
**Ambiente:** WSL2 Linux
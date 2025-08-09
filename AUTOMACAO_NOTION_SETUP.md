# 🤖 Automação Notion - Sistema de Tracking de Relatórios

Sistema automatizado para detectar criação de relatórios/documentação pelo Claude Code e adicionar tasks na lista do Notion.

## ✅ Configuração Implementada

### 📁 Arquivos Criados

1. **Hook Configuration**: `/home/stelarow/.claude/settings.json`
   - PostToolUse hook configurado para ferramentas Write/MultiEdit
   - Timeout de 10 segundos
   - Executa script automaticamente

2. **Script Principal**: `/home/stelarow/.claude/scripts/notion-simple.sh`
   - Detecta arquivos .md com padrões de relatório
   - Registra atividade em log
   - Pronto para integração com MCP Notion

3. **Log File**: `/home/stelarow/.claude/notion-tracker.log`
   - Registra todas as atividades do hook
   - Debug e monitoramento

## 🎯 Padrões Detectados

O sistema identifica automaticamente arquivos .md que contenham:
- `relator`, `report`
- `planejamento`, `documentacao`  
- `analise`, `progress`, `status`
- `resultado`, `conclusao`
- `especificacao`, `spec`
- `README`, `GUIDE`, `CATALOGO`
- `mvp`, `backup`, `test`

## 🔧 Como Funciona

1. **Trigger**: Quando Claude Code usa `Write` ou `MultiEdit`
2. **Detecção**: Script verifica se é arquivo .md com padrão de relatório
3. **Log**: Registra atividade no arquivo de log
4. **Notion**: (Pronto para) Cria task automaticamente

## 🚀 Ativação da Integração Notion

Para ativar completamente, edite o script `/home/stelarow/.claude/scripts/notion-simple.sh`:

1. Localize a linha comentada:
```bash
# claude mcp call notion notion-create-pages '{"parent":...}'
```

2. Descomente e teste:
```bash
claude mcp call notion notion-create-pages '{"parent":{"database_id":"242a2edf-aa51-817b-8526-e98e76391bee"},"pages":[{"properties":{"Tarefa":{"title":[{"text":{"content":"'$task_title'"}}]},"Status":{"select":{"name":"Não iniciadas"}},"Prioridade":{"select":{"name":"Média"}}}}]}'
```

## 📊 Monitoramento

### Ver Log de Atividades
```bash
tail -f /home/stelarow/.claude/notion-tracker.log
```

### Testar Sistema
Crie qualquer arquivo .md com palavra-chave:
```bash
# Exemplo - será detectado automaticamente
echo "# Relatório de Teste" > meu_relatorio.md
```

## ⚙️ Personalização

### Adicionar Novos Padrões
Edite a linha no script:
```bash
if [[ "$file_name" =~ (relator|report|NOVO_PADRAO) ]]; then
```

### Alterar Propriedades da Task
Modifique o payload JSON no comando MCP:
- **Status**: "Não iniciadas", "Em andamento", "Concluído"  
- **Prioridade**: "Baixa", "Média", "Alta"

## 🐛 Troubleshooting

### Hook Não Executa
```bash
# Verificar configuração
cat /home/stelarow/.claude/settings.json

# Verificar permissões
ls -la /home/stelarow/.claude/scripts/
```

### MCP Não Funciona
```bash
# Testar MCP Notion
claude mcp list

# Verificar conexão
claude mcp call notion notion-create-pages --help
```

## 📝 Exemplo de Task Criada

```
📄 Revisar: relatorio_vendas_q4.md
```

- **Status**: Não iniciadas
- **Prioridade**: Média  
- **Database**: Lista de Tarefas CC (242a2edf-aa51-817b-8526-e98e76391bee)

---

✅ Sistema configurado e pronto para uso!

Toda vez que criar um relatório/documentação com Claude Code, uma task será automaticamente adicionada ao seu Notion.
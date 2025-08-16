
/sc:implement implementar a otimização de performance descrita no documento.

CONTEXTO:
- Site em produção funcionando 100%
- Performance Score atual: ~70
- Meta: ≥85 mantendo funcionalidades

REQUISITOS CRÍTICOS:
1. NÃO quebrar funcionalidades existentes:
   - Blog posts devem carregar conteúdo
   - Teste vocacional deve funcionar
   - Formulários devem enviar emails
   - Animações da home devem funcionar

2. Implementar APENAS as mudanças da fase/documento atual
4. Adicionar console.log temporário para validação
5. Seguir a estratégia conservadora do documento

PROCESSO:
1. Implementar mudanças conforme documento
2. Adicionar logs de validação
3. Testar localmente com npm run build:production com timeout de 15 minutos e npm run dev
4. Verificar funcionalidades críticas
5. Só então fazer commit

VALIDAÇÃO OBRIGATÓRIA:
- [ ] Blog: Acessar um artigo e verificar se conteúdo carrega
- [ ] Teste Vocacional: Verificar se página abre
- [ ] Console: Sem erros críticos
- [ ] Build: Sem warnings relevantes




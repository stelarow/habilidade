---
inclusion: always. Deve sempre ser usado para construir as specs e nas tasks deve aparecer quando e quais mcps devem ser usados para as tarefas.
---

# MCP Tool Usage Guidelines

## Decision Tree for Tool Selection

### When working with files in `plataforma-ensino/`:
- **Database/Schema changes** → Use Supabase MCP
- **React/Next.js implementation questions** → Use Context7 Documentation  
- **Auth/middleware testing** → Use Puppeteer Testing
- **Complex architectural decisions** → Use Sequential Thinking

### When working with marketing site (root directory):
- **React/Vite implementation questions** → Use Context7 Documentation
- **EmailJS form testing** → Use Puppeteer Testing
- **UI component implementation** → Use Magic UI MCP
- **Performance optimization** → Use Sequential Thinking

### When working with any UI components:
- **Need Magic UI components** → Use Magic UI MCP first
- **Custom component patterns** → Use Context7 Documentation
- **Component testing** → Use Puppeteer Testing

## Tool-Specific Guidelines

### Supabase MCP
**Triggers**: Files in `plataforma-ensino/`, database mentions, auth issues, RLS policies
- Always run `list_tables` before schema changes
- Use `apply_migration` for DDL, never direct SQL
- Run `get_advisors` after any DDL changes
- Check `get_logs` when debugging auth/database issues
- Generate TypeScript types after schema changes

### Context7 Documentation  
**Triggers**: React hooks, Next.js patterns, Tailwind classes, third-party libraries
- **ALWAYS use for updated documentation** - prioritize over assumptions
- Always resolve library ID first: `resolve_library_id` → `get_library_docs`
- Focus searches: "hooks", "routing", "performance", "authentication"
- For React: search "react" for hooks and patterns
- For Next.js: search "next.js" for App Router and middleware
- For Tailwind: search "tailwindcss" for utility patterns

### Magic UI MCP
**Triggers**: UI component requests, animations, special effects, buttons
- **Use for minimal errors in component generation**
- Use `getUIComponents` to see all available components
- Use specific getters: `getButtons`, `getAnimations`, `getSpecialEffects`
- Prioritize Magic UI over custom implementations
- Check device mocks for responsive testing

### Puppeteer Testing
**Triggers**: Form testing, responsive design, auth flows, EmailJS integration
- Connect to existing Chrome: `connect_active_tab` first
- Test EmailJS forms: navigate → fill → submit → verify
- Test responsive: screenshot at different viewport sizes
- Test auth flows: login → redirect → verify middleware

### Sequential Thinking
**Triggers**: Multi-step problems, architectural decisions, debugging complex issues
- Use for refactoring decisions across both projects
- Break down performance optimization strategies  
- Plan feature implementations that span multiple files
- Debug issues that involve multiple systems (auth + database + UI)

## Project-Specific Patterns

### Database Operations (Platform Only)
```
1. list_tables → understand current schema
2. apply_migration → make changes  
3. get_advisors → check for RLS issues
4. generate_typescript_types → update types
```

### Component Implementation
```
1. getUIComponents (Magic UI) → check available components
2. resolve_library_id + get_library_docs → get implementation patterns
3. Implement with Magic UI first, Context7 patterns second
4. Test with Puppeteer if interactive
```

### Form Testing (Critical for EmailJS)
```
1. connect_active_tab → existing Chrome
2. navigate → form page
3. fill → all required fields
4. click → submit button
5. evaluate → check EmailJS success/WhatsApp fallback
```

### Performance Debugging
```
1. Sequential thinking → break down the problem
2. Context7 → lookup optimization patterns
3. Puppeteer → test performance impact
4. Implement → apply optimizations
```

## Task Creation Guidelines

When creating tasks in specs, always specify which MCPs should be used:
- **Database tasks** → Include Supabase MCP calls
- **Implementation tasks** → Include Context7 + Magic UI MCP calls  
- **Testing tasks** → Include Puppeteer MCP calls
- **Complex tasks** → Include Sequential Thinking MCP calls

## Efficiency Rules

### Parallel Operations
- Run multiple Supabase queries simultaneously when independent
- Fetch multiple Context7 docs for related topics in parallel
- Take multiple Puppeteer screenshots at different breakpoints simultaneously

### Caching Strategy  
- Cache Context7 library IDs for repeated lookups
- Reuse Puppeteer browser connections across tests
- Store Supabase schema info to avoid repeated `list_tables`

### Specific Optimizations
- For React questions: resolve "react" library ID once, reuse
- For database work: batch migrations when possible
- For testing: combine scenarios (auth + responsive + forms) in single session
- For Magic UI: get all component types needed in single call
# Exemplo de Uso do Componente TrustedCompanies

Este documento demonstra como usar o componente `TrustedCompanies` em diferentes contextos.

## Importação

```jsx
import TrustedCompanies from '../components/TrustedCompanies';
```

## Uso na Página Inicial (variant="home")

```jsx
function Home() {
  return (
    <>
      <Hero />
      <Courses />
      <Reviews />
      <TrustedCompanies variant="home" />
      <ContactForm />
    </>
  );
}
```

**Características:**
- Layout em grid (2 linhas)
- Mostra mix de todas as empresas
- Inclui estatísticas
- Design compacto para mobile

## Uso em Páginas de Curso (variant="course")

```jsx
function CursoAutoCAD() {
  return (
    <>
      <CourseHero />
      <CourseContent />
      <TrustedCompanies 
        variant="course" 
        courseSlug="autocad-2d-3d" 
      />
      <Testimonials />
    </>
  );
}
```

**Características:**
- Layout em carrossel horizontal
- Filtra empresas por categoria do curso
- Animação mais lenta e suave
- Título específico para cursos

## Personalização Avançada

```jsx
<TrustedCompanies 
  variant="course"
  courseSlug="marketing-digital"
  title="Empresas que transformaram seu marketing"
  subtitle="Cases de sucesso na região"
  theme="dark"
  className="my-custom-class"
/>
```

## Mapeamento de Cursos

O componente automaticamente mapeia slugs de curso para categorias de empresa:

- `sketchup-enscape` → empresas de design
- `autocad-2d-3d` → empresas de design
- `informatica` → empresas de informática
- `marketing-digital` → empresas de marketing
- `design-grafico` → empresas de design + marketing

## Adicionando Novas Empresas

Para adicionar novas empresas, edite `/src/data/trustedCompanies.js`:

```javascript
export const trustedCompaniesData = {
  design: [
    // empresas existentes...
    {
      name: "Nova Empresa",
      logo: "/images/companies/nova-empresa.png",
      description: "Descrição da empresa"
    }
  ]
};
```

## Props Disponíveis

| Prop | Tipo | Padrão | Descrição |
|------|------|---------|-----------|
| variant | `"home"` \| `"course"` | `"home"` | Layout a usar |
| courseSlug | string \| null | null | Slug do curso para filtrar empresas |
| title | string \| null | null | Título personalizado |
| subtitle | string \| null | null | Subtítulo personalizado |
| theme | `"light"` \| `"dark"` | `"light"` | Tema de cores |
| className | string | `""` | Classes CSS adicionais |

## Implementação Concluída

✅ **Página Inicial** - Seção adicionada entre Reviews e LatestBlogSection
✅ **Página SketchUp + Enscape** - CompaniesSection substituída pelo novo componente
✅ **Correções de dados** - MR→RM, Mobiliário→Mobiliário e Miniaturas

## Próximos Passos Sugeridos

1. Adicionar o componente a outras páginas de curso conforme necessário
2. Coletar logos de mais empresas para expandir o banco de dados
3. Implementar lazy loading para as imagens dos logos
4. Adicionar analytics para trackear interações com a seção
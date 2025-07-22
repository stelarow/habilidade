# PRD Section 4: Marketing Website Specifications
[← Back to Index](./index.md) | [← Previous: User Requirements](./03-user-requirements.md) | [Next: Learning Platform Specs →](./05-learning-platform-specs.md)

---

## Overview

The marketing website serves as the primary entry point for prospective students, showcasing courses and converting visitors into enrolled learners.

### Key Objectives
1. **Lead Generation:** Capture interested prospects
2. **Course Discovery:** Easy navigation and search
3. **Trust Building:** Social proof and credibility
4. **Performance:** Fast, responsive experience
5. **Conversion:** Optimize enrollment funnel

---

## Homepage Specifications

### Hero Section
```
Component Structure
├── Dynamic Background (Course-themed animations)
├── Headline: "Transforme sua Carreira com Cursos Práticos"
├── Subheadline: Value proposition
├── CTA Buttons
│   ├── Primary: "Ver Cursos"
│   └── Secondary: "Assistir Demo"
├── Trust Indicators
│   ├── Student count: "5.000+ alunos"
│   ├── Course count: "20+ cursos"
│   └── Rating: "4.8/5 estrelas"
└── Scroll Indicator (animated)
```

### Featured Courses Carousel
**Specifications:**
- Display: 3-4 featured courses
- Information shown:
  - Course thumbnail
  - Title and instructor
  - Duration and level
  - Price (with discount if applicable)
  - Rating and reviews count
- Interaction: Hover effects, click to course page
- Auto-rotation: Every 5 seconds (pausable)

### How It Works Section
```typescript
interface HowItWorksStep {
  number: string;
  icon: PhosphorIcon;
  title: string;
  description: string;
  animation: 'fadeIn' | 'slideUp' | 'scaleIn';
}

const steps: HowItWorksStep[] = [
  {
    number: "01",
    icon: MagnifyingGlass,
    title: "Escolha seu Curso",
    description: "Navegue por nossa seleção de cursos",
    animation: "fadeIn"
  },
  // ... more steps
];
```

### Testimonials Section
**Dynamic Content Requirements:**
- Minimum 6 testimonials
- Rotating display (3 visible)
- Include:
  - Student photo
  - Name and profession
  - Course taken
  - Testimonial text
  - Star rating
- Video testimonials (optional)

### FAQ Section
**Common Questions:**
1. Course access duration
2. Certificate details
3. Technical requirements
4. Payment options
5. Refund policy

**Implementation:**
- Accordion style
- Search functionality
- Category grouping
- Analytics tracking

---

## Course Catalog Page

### Filtering & Search System
```
Filter Sidebar
├── Categories
│   ├── [ ] Programação (12)
│   ├── [ ] Design (8)
│   ├── [ ] Marketing (6)
│   └── [ ] Análise de Dados (4)
├── Level
│   ├── [ ] Iniciante (15)
│   ├── [ ] Intermediário (10)
│   └── [ ] Avançado (5)
├── Duration
│   ├── [ ] < 10 horas (8)
│   ├── [ ] 10-30 horas (12)
│   └── [ ] > 30 horas (10)
├── Price Range
│   └── [Slider: R$0 - R$500]
└── Ratings
    └── [★★★★☆ & up]
```

### Course Card Design
```html
<article class="course-card">
  <div class="thumbnail">
    <img src="course-thumb.jpg" alt="Course Name">
    <span class="badge">Mais Vendido</span>
    <button class="preview-btn">Preview</button>
  </div>
  <div class="content">
    <h3>Desenvolvimento Web Completo</h3>
    <p class="instructor">com João Silva</p>
    <div class="meta">
      <span>⏱ 40 horas</span>
      <span>📊 Intermediário</span>
    </div>
    <div class="rating">
      <span>★★★★★</span>
      <span>4.8 (234 reviews)</span>
    </div>
    <div class="price">
      <span class="original">R$ 199</span>
      <span class="sale">R$ 149</span>
    </div>
  </div>
</article>
```

### Search Functionality
- **Real-time search:** As-you-type results
- **Search scope:** Title, description, instructor
- **Fuzzy matching:** Handle typos
- **Search suggestions:** Popular searches
- **No results handling:** Suggest alternatives

---

## Course Detail Page

### Page Structure
```
Course Detail Layout
├── Breadcrumb Navigation
├── Course Hero Section
│   ├── Video Preview (Mux player)
│   ├── Course Title
│   ├── Tagline
│   ├── Instructor Info
│   ├── Ratings & Stats
│   └── Enrollment CTA (sticky)
├── Course Information Tabs
│   ├── Overview
│   ├── Curriculum
│   ├── Instructor
│   ├── Reviews
│   └── FAQ
├── Sidebar
│   ├── Price Box
│   ├── Course Includes
│   ├── Requirements
│   └── Share Buttons
└── Related Courses
```

### Course Hero Section
**Video Preview Requirements:**
- Auto-play muted on desktop
- Play button overlay on mobile
- Maximum 2-minute preview
- Captions available
- Analytics tracking

**Enrollment CTA States:**
```typescript
type CTAState = 
  | 'default'      // "Matricule-se Agora"
  | 'inCart'       // "Ir para Carrinho"
  | 'enrolled'     // "Acessar Curso"
  | 'unavailable'  // "Em Breve";
```

### Curriculum Display
```
Module Structure
├── Module 1: Fundamentos
│   ├── ✓ Aula 1.1: Introdução (10:32)
│   ├── ✓ Aula 1.2: Configuração (15:45)
│   ├── 🔒 Aula 1.3: Primeiro Projeto (25:00)
│   └── 🔒 Quiz: Teste seus Conhecimentos
├── Module 2: Intermediário
│   └── [Collapsed - 8 aulas]
└── [Expand All] [Collapse All]
```

### Instructor Section
**Information Display:**
- Professional photo
- Bio (150-200 words)
- Credentials/Experience
- Social media links
- Other courses by instructor
- Total students taught
- Average rating

### Reviews System
**Review Components:**
- Overall rating display
- Rating distribution chart
- Individual reviews with:
  - Reviewer name
  - Date
  - Rating
  - Verified purchase badge
  - Helpful votes
- Pagination (10 per page)
- Sort options (recent, helpful, rating)

---

## Contact Form System

### Form Implementation
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  course?: string; // Pre-filled if from course page
  message: string;
  source: 'homepage' | 'course' | 'footer';
}

// EmailJS Configuration
const EMAIL_CONFIG = {
  SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
  TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
  ADMIN_EMAIL: 'alessandro.ferreira@escolahabilidade.com'
};
```

### Form States & Feedback
```
Form States
├── Default (empty form)
├── Typing (real-time validation)
├── Submitting (loading spinner)
├── Success (confirmation message)
├── Error (with retry option)
└── WhatsApp Fallback (if email fails)
```

### WhatsApp Integration
```javascript
// Fallback configuration
const WHATSAPP_CONFIG = {
  number: '5548988559491',
  defaultMessage: (data: ContactFormData) => 
    `Olá! Vim do site e tenho interesse no curso ${data.course || 'seus cursos'}.
     
     Nome: ${data.name}
     Email: ${data.email}
     
     ${data.message}`,
  trackingEvent: 'whatsapp_fallback_used'
};
```

---

## Performance Optimization

### Image Optimization
```javascript
// Lazy loading configuration
const imageConfig = {
  formats: ['webp', 'jpg'], // Progressive enhancement
  sizes: {
    thumbnail: '300x200',
    card: '600x400',
    hero: '1920x1080'
  },
  lazy: {
    rootMargin: '50px',
    threshold: 0.01
  }
};
```

### Background Animations
**Course-Specific Backgrounds:**
1. **Programming:** Matrix-style code rain
2. **Design:** Geometric shapes morphing
3. **Marketing:** Network connections
4. **Data Science:** Data visualization particles
5. **Video Editing:** Film strip effects

**Performance Controls:**
```typescript
interface PerformanceSettings {
  animations: 'full' | 'reduced' | 'none';
  videoAutoplay: boolean;
  backgroundComplexity: 'high' | 'medium' | 'low';
  
  // Adaptive based on device
  detectPerformance(): void;
  applySettings(): void;
}
```

### Resource Management
```javascript
// Memory Manager Implementation
class MemoryManager {
  private resourcePool: Map<string, Resource>;
  private maxMemory: number = 50 * 1024 * 1024; // 50MB
  
  allocate(resource: Resource): void {
    if (this.currentUsage + resource.size > this.maxMemory) {
      this.cleanup();
    }
    this.resourcePool.set(resource.id, resource);
  }
  
  cleanup(): void {
    // Remove least recently used resources
    const sorted = Array.from(this.resourcePool.entries())
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    
    while (this.currentUsage > this.maxMemory * 0.7) {
      const [id] = sorted.shift();
      this.release(id);
    }
  }
}
```

---

## SEO & Marketing Features

### SEO Implementation
```html
<!-- Course Page Meta Tags -->
<meta name="description" content="Aprenda ${courseName} com ${instructor}. ${duration} horas de conteúdo prático. Certificado incluso.">
<meta property="og:title" content="${courseName} - Escola Habilidade">
<meta property="og:image" content="${courseThumbnail}">
<meta property="og:type" content="course">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "${courseName}",
  "description": "${courseDescription}",
  "provider": {
    "@type": "Organization",
    "name": "Escola Habilidade"
  }
}
</script>
```

### Analytics Tracking
```typescript
// Event tracking configuration
const trackingEvents = {
  // Page views
  courseView: (courseId: string) => ({
    event: 'page_view',
    page_type: 'course',
    course_id: courseId
  }),
  
  // User actions
  ctaClick: (location: string, courseId?: string) => ({
    event: 'cta_click',
    cta_location: location,
    course_id: courseId
  }),
  
  // Conversion funnel
  beginCheckout: (courseId: string, price: number) => ({
    event: 'begin_checkout',
    currency: 'BRL',
    value: price,
    items: [{ id: courseId }]
  })
};
```

---

## A/B Testing Framework

### Test Configuration
```typescript
interface ABTest {
  id: string;
  name: string;
  variants: {
    control: any;
    variant_a: any;
    variant_b?: any;
  };
  traffic_allocation: number[]; // [50, 50] or [33, 33, 34]
  success_metrics: string[];
  duration: number; // days
}

// Example: CTA Button Test
const ctaTest: ABTest = {
  id: 'cta_color_test_2025_01',
  name: 'CTA Button Color Test',
  variants: {
    control: { color: '#d400ff', text: 'Matricule-se' },
    variant_a: { color: '#00c4ff', text: 'Começar Agora' }
  },
  traffic_allocation: [50, 50],
  success_metrics: ['click_rate', 'conversion_rate'],
  duration: 14
};
```

---

[Next Section: Learning Platform Specifications →](./05-learning-platform-specs.md)

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-22  
**Section Owner:** Frontend Team
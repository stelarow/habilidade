# 🧪 GUIA DE TESTES - ESCOLA HABILIDADE

## 📋 VISÃO GERAL

Estratégia abrangente de testes para garantir qualidade e confiabilidade nos dois sistemas: Marketing Site (React/Vite) e Learning Platform (Next.js/Supabase).

---

## 🎯 ESTRATÉGIA DE TESTES

### Pirâmide de Testes
```
                    E2E Tests (10%)
                /                    \
           Integration Tests (20%)
          /                        \
     Unit Tests (70%)
```

### Tipos de Teste por Sistema

#### Marketing Site (React/Vite)
- **Unit Tests**: Componentes isolados, hooks, utilitários
- **Integration Tests**: Fluxos de formulário, navegação
- **E2E Tests**: Jornada completa do usuário

#### Learning Platform (Next.js)
- **Unit Tests**: Componentes, APIs, business logic
- **Integration Tests**: Autenticação, CRUD operations
- **E2E Tests**: Fluxos completos de estudante/admin

---

## 🔧 CONFIGURAÇÃO DE FERRAMENTAS

### Jest + Testing Library (Ambos os projetos)

#### Instalação
```bash
# Marketing Site
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom

# Learning Platform
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

#### Jest Config - Marketing Site
```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-react'] }],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.stories.{js,jsx}',
    '!src/main.jsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

#### Jest Config - Learning Platform
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Playwright (E2E Tests)

#### Instalação
```bash
# Instalar Playwright
npm install --save-dev @playwright/test
npx playwright install
```

#### Playwright Config
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 🧩 TESTES UNITÁRIOS

### Componentes React (Marketing Site)

#### Teste de Componente Simples
```javascript
// src/components/__tests__/Header.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
)

describe('Header Component', () => {
  test('renders logo and navigation', () => {
    render(<HeaderWithRouter />)
    
    expect(screen.getByAltText(/escola habilidade/i)).toBeInTheDocument()
    expect(screen.getByText(/cursos/i)).toBeInTheDocument()
    expect(screen.getByText(/blog/i)).toBeInTheDocument()
    expect(screen.getByText(/contato/i)).toBeInTheDocument()
  })

  test('opens mobile menu on hamburger click', () => {
    render(<HeaderWithRouter />)
    
    const hamburger = screen.getByLabelText(/toggle menu/i)
    fireEvent.click(hamburger)
    
    expect(screen.getByRole('navigation')).toHaveClass('mobile-menu-open')
  })

  test('handles login button click', () => {
    const mockRedirect = jest.fn()
    window.location.href = mockRedirect
    
    render(<HeaderWithRouter />)
    
    const loginButton = screen.getByText(/entrar/i)
    fireEvent.click(loginButton)
    
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining('plataformahabilidade.netlify.app')
    )
  })
})
```

#### Teste de Hook Customizado
```javascript
// src/hooks/__tests__/useBlogAPI.test.js
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBlogPosts } from '../useBlogAPI'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useBlogPosts Hook', () => {
  test('fetches blog posts successfully', async () => {
    const mockPosts = [
      { id: '1', title: 'Test Post', slug: 'test-post' }
    ]
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ posts: mockPosts }),
    })

    const { result } = renderHook(() => useBlogPosts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data.pages[0].posts).toEqual(mockPosts)
  })

  test('handles API error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useBlogPosts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error.message).toBe('API Error')
  })
})
```

### Componentes Next.js (Learning Platform)

#### Teste de Página
```typescript
// src/app/dashboard/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import DashboardPage from '../page'

// Mock do hook de auth
jest.mock('@/hooks/useAuth')
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('Dashboard Page', () => {
  test('shows loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      loading: true,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      updateProfile: jest.fn(),
      isAdmin: false,
      isInstructor: false,
      isStudent: false,
    })

    render(<DashboardPage />)
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  test('renders student dashboard', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'student@test.com' },
      profile: { id: '1', role: 'student', full_name: 'Student' },
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      updateProfile: jest.fn(),
      isAdmin: false,
      isInstructor: false,
      isStudent: true,
    })

    render(<DashboardPage />)
    
    expect(screen.getByText(/bem-vindo, student/i)).toBeInTheDocument()
    expect(screen.getByText(/meus cursos/i)).toBeInTheDocument()
    expect(screen.getByText(/progresso geral/i)).toBeInTheDocument()
  })
})
```

#### Teste de API Route
```typescript
// src/app/api/blog/posts/__tests__/route.test.ts
import { GET } from '../route'
import { createMocks } from 'node-mocks-http'
import { NextRequest } from 'next/server'

// Mock do Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          lte: jest.fn(() => ({
            order: jest.fn(() => ({
              range: jest.fn(() => Promise.resolve({
                data: [
                  {
                    id: '1',
                    title: 'Test Post',
                    slug: 'test-post',
                    excerpt: 'Test excerpt',
                  }
                ],
                error: null,
                count: 1,
              })),
            })),
          })),
        })),
      })),
    })),
  })),
}))

describe('/api/blog/posts', () => {
  test('GET returns blog posts', async () => {
    const request = new NextRequest('http://localhost:3000/api/blog/posts')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.posts).toHaveLength(1)
    expect(data.posts[0]).toMatchObject({
      id: '1',
      title: 'Test Post',
      slug: 'test-post',
    })
  })

  test('GET handles pagination', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/blog/posts?page=2&limit=5'
    )
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.pagination).toMatchObject({
      currentPage: 2,
      limit: 5,
    })
  })
})
```

---

## 🔗 TESTES DE INTEGRAÇÃO

### Fluxo de Autenticação
```typescript
// src/__tests__/integration/auth-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('Authentication Flow', () => {
  test('complete login flow', async () => {
    const user = userEvent.setup()
    
    render(<AppWithRouter />)

    // Navigate to login
    const loginButton = screen.getByText(/entrar/i)
    await user.click(loginButton)

    // Fill login form
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Wait for redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    })
  })

  test('handles login error', async () => {
    const user = userEvent.setup()
    
    // Mock failed login
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' }),
    })

    render(<AppWithRouter />)

    const loginButton = screen.getByText(/entrar/i)
    await user.click(loginButton)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
    })
  })
})
```

### CRUD Operations
```typescript
// src/__tests__/integration/course-management.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CourseManagement from '@/components/admin/CoursesManagement'
import { AuthProvider } from '@/contexts/AuthContext'

const CourseManagementWithAuth = () => (
  <AuthProvider>
    <CourseManagement />
  </AuthProvider>
)

describe('Course Management Integration', () => {
  beforeEach(() => {
    // Mock admin user
    jest.spyOn(require('@/hooks/useAuth'), 'useAuth').mockReturnValue({
      user: { id: 'admin-1' },
      profile: { role: 'admin' },
      isAdmin: true,
      loading: false,
    })
  })

  test('creates new course', async () => {
    const user = userEvent.setup()
    
    render(<CourseManagementWithAuth />)

    // Click new course button
    const newCourseButton = screen.getByText(/novo curso/i)
    await user.click(newCourseButton)

    // Fill course form
    const titleInput = screen.getByLabelText(/título/i)
    const descriptionInput = screen.getByLabelText(/descrição/i)
    const priceInput = screen.getByLabelText(/preço/i)

    await user.type(titleInput, 'Novo Curso de React')
    await user.type(descriptionInput, 'Descrição do curso')
    await user.type(priceInput, '197.00')

    // Submit form
    const saveButton = screen.getByText(/salvar/i)
    await user.click(saveButton)

    // Verify course was created
    await waitFor(() => {
      expect(screen.getByText(/curso criado com sucesso/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Novo Curso de React')).toBeInTheDocument()
  })

  test('deletes course', async () => {
    const user = userEvent.setup()
    
    render(<CourseManagementWithAuth />)

    // Find course to delete
    const deleteButton = screen.getByLabelText(/excluir curso/i)
    await user.click(deleteButton)

    // Confirm deletion
    const confirmButton = screen.getByText(/confirmar exclusão/i)
    await user.click(confirmButton)

    // Verify course was deleted
    await waitFor(() => {
      expect(screen.getByText(/curso excluído com sucesso/i)).toBeInTheDocument()
    })
  })
})
```

---

## 🎭 TESTES E2E (PLAYWRIGHT)

### Setup Utilities
```typescript
// src/__tests__/e2e/utils/auth-helper.ts
import { Page } from '@playwright/test'

export class AuthHelper {
  constructor(private page: Page) {}

  async loginAsStudent(email = 'student@test.com', password = 'password123') {
    await this.page.goto('/auth/login')
    await this.page.fill('[data-testid="email-input"]', email)
    await this.page.fill('[data-testid="password-input"]', password)
    await this.page.click('[data-testid="login-button"]')
    await this.page.waitForURL('/dashboard')
  }

  async loginAsAdmin(email = 'admin@test.com', password = 'admin123') {
    await this.page.goto('/auth/login')
    await this.page.fill('[data-testid="email-input"]', email)
    await this.page.fill('[data-testid="password-input"]', password)
    await this.page.click('[data-testid="login-button"]')
    await this.page.waitForURL('/admin')
  }

  async logout() {
    await this.page.click('[data-testid="user-dropdown"]')
    await this.page.click('[data-testid="logout-button"]')
    await this.page.waitForURL('/')
  }
}
```

### Student Journey Test
```typescript
// src/__tests__/e2e/student-journey.spec.ts
import { test, expect } from '@playwright/test'
import { AuthHelper } from './utils/auth-helper'

test.describe('Student Journey', () => {
  test('complete course enrollment and lesson completion', async ({ page }) => {
    const auth = new AuthHelper(page)

    // Login as student
    await auth.loginAsStudent()

    // Navigate to course catalog
    await page.click('text=Catálogo de Cursos')
    await expect(page).toHaveURL('/courses')

    // Select a course
    await page.click('[data-testid="course-card"]:first-child')
    await expect(page.locator('h1')).toContainText('Curso')

    // Enroll in course
    await page.click('[data-testid="enroll-button"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()

    // Go to first lesson
    await page.click('[data-testid="start-course-button"]')
    await expect(page.locator('[data-testid="video-player"]')).toBeVisible()

    // Mark lesson as complete
    await page.click('[data-testid="complete-lesson-button"]')
    await expect(page.locator('[data-testid="lesson-completed"]')).toBeVisible()

    // Check progress update
    await page.goto('/dashboard')
    await expect(page.locator('[data-testid="progress-bar"]')).toHaveAttribute(
      'aria-valuenow',
      expect.stringMatching(/[1-9]\d*/)
    )
  })

  test('mobile responsive behavior', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    const auth = new AuthHelper(page)
    await auth.loginAsStudent()

    // Test mobile navigation
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()

    // Test course card layout on mobile
    await page.goto('/courses')
    const courseCards = page.locator('[data-testid="course-card"]')
    await expect(courseCards.first()).toBeVisible()

    // Verify responsive video player
    await courseCards.first().click()
    await page.click('[data-testid="start-course-button"]')
    
    const videoPlayer = page.locator('[data-testid="video-player"]')
    await expect(videoPlayer).toBeVisible()
    
    // Check video player responsiveness
    const videoRect = await videoPlayer.boundingBox()
    expect(videoRect?.width).toBeLessThanOrEqual(375)
  })
})
```

### Admin Workflow Test
```typescript
// src/__tests__/e2e/admin-workflow.spec.ts
import { test, expect } from '@playwright/test'
import { AuthHelper } from './utils/auth-helper'

test.describe('Admin Workflow', () => {
  test('create and publish blog post', async ({ page }) => {
    const auth = new AuthHelper(page)
    await auth.loginAsAdmin()

    // Navigate to blog management
    await page.click('text=Blog')
    await expect(page).toHaveURL('/admin/blog')

    // Create new post
    await page.click('[data-testid="new-post-button"]')
    await expect(page).toHaveURL('/admin/blog/posts/new')

    // Fill post form
    await page.fill('[data-testid="post-title"]', 'Test Blog Post')
    await page.fill('[data-testid="post-slug"]', 'test-blog-post')
    await page.fill('[data-testid="post-excerpt"]', 'This is a test post')
    
    // Fill content using rich text editor
    await page.click('[data-testid="content-editor"]')
    await page.type('[data-testid="content-editor"]', 'This is the main content of the blog post.')

    // Select category
    await page.click('[data-testid="category-select"]')
    await page.click('text=Programação')

    // Set SEO fields
    await page.click('text=SEO')
    await page.fill('[data-testid="seo-title"]', 'Test Blog Post - SEO Title')
    await page.fill('[data-testid="seo-description"]', 'SEO description for test post')

    // Save and publish
    await page.click('[data-testid="publish-button"]')
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Post publicado')

    // Verify post appears in list
    await page.goto('/admin/blog/posts')
    await expect(page.locator('text=Test Blog Post')).toBeVisible()
  })

  test('manage course curriculum', async ({ page }) => {
    const auth = new AuthHelper(page)
    await auth.loginAsAdmin()

    // Navigate to course management
    await page.goto('/admin/courses')
    
    // Select existing course
    await page.click('[data-testid="course-row"]:first-child [data-testid="edit-button"]')

    // Add new lesson
    await page.click('[data-testid="add-lesson-button"]')
    
    await page.fill('[data-testid="lesson-title"]', 'Nova Aula de Teste')
    await page.fill('[data-testid="lesson-description"]', 'Descrição da aula')
    await page.fill('[data-testid="video-url"]', 'https://vimeo.com/123456789')
    await page.fill('[data-testid="duration"]', '15')

    // Save lesson
    await page.click('[data-testid="save-lesson-button"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()

    // Verify lesson in curriculum
    await expect(page.locator('text=Nova Aula de Teste')).toBeVisible()

    // Test lesson reordering
    const lessonItem = page.locator('[data-testid="lesson-item"]').first()
    const dragHandle = lessonItem.locator('[data-testid="drag-handle"]')
    
    await dragHandle.dragTo(page.locator('[data-testid="lesson-item"]').nth(1))
    
    // Save curriculum order
    await page.click('[data-testid="save-curriculum-button"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })
})
```

---

## 📊 COVERAGE E RELATÓRIOS

### Coverage Configuration
```javascript
// jest.config.js - Coverage settings
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
```

### Scripts Package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test:coverage && npm run test:e2e",
    "test:ci": "npm run test:coverage -- --watchAll=false && npm run test:e2e"
  }
}
```

### GitHub Actions CI
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run Playwright tests
        run: npm run test:e2e
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🚀 PERFORMANCE TESTING

### Lighthouse CI
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/courses',
        'http://localhost:3000/blog',
        'http://localhost:3000/dashboard',
      ],
      startServerCommand: 'npm run start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

### Load Testing (K6)
```javascript
// load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  vus: 10, // 10 virtual users
  duration: '30s',
}

export default function () {
  // Test blog API
  let blogResponse = http.get('http://localhost:3000/api/blog/posts')
  check(blogResponse, {
    'blog API status is 200': (r) => r.status === 200,
    'blog API response time < 500ms': (r) => r.timings.duration < 500,
  })

  // Test course API
  let courseResponse = http.get('http://localhost:3000/api/courses')
  check(courseResponse, {
    'course API status is 200': (r) => r.status === 200,
    'course API response time < 1000ms': (r) => r.timings.duration < 1000,
  })

  sleep(1)
}
```

---

## 🐛 DEBUG E TROUBLESHOOTING

### Debug Configuration
```javascript
// Debug utilities
export const testDebug = {
  logRender: (component) => {
    console.log('Rendered component:', component.debug())
  },
  
  waitForElement: async (screen, selector, timeout = 5000) => {
    return await screen.findByText(selector, {}, { timeout })
  },
  
  mockApiCall: (url, response) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => response,
    })
  },
  
  resetMocks: () => {
    jest.clearAllMocks()
    global.fetch.mockClear()
  },
}
```

### Common Test Patterns
```typescript
// Test utilities
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            {children}
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    )
  }
  
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export const mockUser = (role: 'student' | 'instructor' | 'admin' = 'student') => ({
  id: `${role}-123`,
  email: `${role}@test.com`,
  profile: {
    id: `${role}-123`,
    role,
    full_name: `Test ${role}`,
  },
  isAdmin: role === 'admin',
  isInstructor: role === 'instructor',
  isStudent: role === 'student',
})
```

---

## 📈 MELHORES PRÁTICAS

### Test Organization
1. **Arrange-Act-Assert**: Estrutura clara dos testes
2. **Descriptive Names**: Nomes que explicam o comportamento
3. **One Assertion**: Foco em um comportamento por teste
4. **Test Data**: Factories para dados de teste consistentes
5. **Cleanup**: Limpar mocks e estado entre testes

### Performance Tips
1. **Parallel Execution**: Testes independentes em paralelo
2. **Selective Testing**: Executar apenas testes relevantes
3. **Mock External Services**: Evitar chamadas de rede reais
4. **Efficient Setup**: Reutilizar configurações comuns
5. **Fast Feedback**: Testes unitários rápidos primeiro

### Maintenance
1. **Regular Updates**: Manter ferramentas atualizadas
2. **Flaky Test Detection**: Identificar e corrigir testes instáveis
3. **Coverage Monitoring**: Acompanhar cobertura ao longo do tempo
4. **Documentation**: Documentar padrões e convenções
5. **Team Training**: Garantir que a equipe conhece as práticas

---

*Documentação atualizada em: 30/07/2025*
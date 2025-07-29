/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import components to test
import BlogCard from '../../components/blog/BlogCard';
import BlogNavigation from '../../components/blog/BlogNavigation';
import TableOfContents from '../../components/blog/TableOfContents';
import AdvancedSearch from '../../components/blog/AdvancedSearch';
import ShareButtons from '../../components/blog/ShareButtons';

// Additional test utilities
import { trackSearch } from '../../services/analyticsService';

// Mock hooks
jest.mock('../../hooks/useBlogAPI', () => ({
  usePrefetchPost: jest.fn(() => jest.fn()),
  useCategories: jest.fn(() => ({ 
    data: { 
      data: { 
        categories: [
          { id: 1, name: 'Tecnologia', slug: 'tecnologia', post_count: 5 },
          { id: 2, name: 'Educa��o', slug: 'educacao', post_count: 3 }
        ] 
      }
    }, 
    isLoading: false 
  }))
}));

jest.mock('../../hooks/useBlogResponsive', () => ({
  useBlogResponsive: jest.fn(() => ({
    getTypographyClasses: jest.fn(() => 'text-base'),
    shouldUseAnimations: jest.fn(() => true),
    getResponsiveImageProps: jest.fn(() => ({}))
  }))
}));

jest.mock('../../services/analyticsService', () => ({
  trackSearch: jest.fn()
}));

// Test wrapper with providers
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Mock post data
const mockPost = {
  id: 1,
  slug: 'test-post',
  title: 'Test Blog Post',
  excerpt: 'This is a test excerpt for the blog post',
  content: 'This is the full content of the test blog post',
  featured_image_url: 'https://example.com/image.jpg',
  created_at: '2025-01-01T00:00:00Z',
  author_name: 'Test Author',
  categories: [{ name: 'Tecnologia', slug: 'tecnologia' }],
  tags: ['react', 'testing', 'javascript']
};

describe('BlogCard Component', () => {
  test('renders blog card with post data', () => {
    render(
      <TestWrapper>
        <BlogCard post={mockPost} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt for the blog post')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Tecnologia')).toBeInTheDocument();
  });

  test('handles prefetch on hover', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BlogCard post={mockPost} />
      </TestWrapper>
    );

    const card = screen.getByRole('article');
    
    // Test hover prefetch with delay
    await user.hover(card);
    
    // Wait for prefetch timeout
    await waitFor(() => {
      // Prefetch should be triggered after hover delay
      expect(card).toBeInTheDocument();
    }, { timeout: 500 });
  });

  test('displays reading time correctly', () => {
    const longContentPost = {
      ...mockPost,
      content: 'word '.repeat(400) // 400 words H 2 minutes
    };

    render(
      <TestWrapper>
        <BlogCard post={longContentPost} />
      </TestWrapper>
    );

    expect(screen.getByText('2 min')).toBeInTheDocument();
  });

  test('handles image loading states', async () => {
    render(
      <TestWrapper>
        <BlogCard post={mockPost} />
      </TestWrapper>
    );

    // Should show loading state initially
    const image = screen.getByAltText('Test Blog Post');
    expect(image).toHaveClass('opacity-0');
  });

  test('handles image error fallback', async () => {
    const postWithoutImage = { ...mockPost, featured_image_url: null };

    render(
      <TestWrapper>
        <BlogCard post={postWithoutImage} />
      </TestWrapper>
    );

    expect(screen.getByText('Artigo')).toBeInTheDocument();
  });

  test('renders different variants correctly', () => {
    const { rerender } = render(
      <TestWrapper>
        <BlogCard post={mockPost} variant="featured" />
      </TestWrapper>
    );

    let card = screen.getByRole('article');
    expect(card).toHaveClass('blog-card-featured');

    rerender(
      <TestWrapper>
        <BlogCard post={mockPost} variant="compact" />
      </TestWrapper>
    );

    card = screen.getByRole('article');
    expect(card).toHaveClass('bg-zinc-800/40');
  });

  test('truncates long excerpts', () => {
    const longExcerptPost = {
      ...mockPost,
      excerpt: 'a'.repeat(200) // Very long excerpt
    };

    render(
      <TestWrapper>
        <BlogCard post={longExcerptPost} />
      </TestWrapper>
    );

    const excerpt = screen.getByText(/a+\.\.\./);
    expect(excerpt).toBeInTheDocument();
  });

  test('handles tags display with overflow', () => {
    const manyTagsPost = {
      ...mockPost,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
    };

    render(
      <TestWrapper>
        <BlogCard post={manyTagsPost} />
      </TestWrapper>
    );

    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument(); // Shows overflow count
  });
});

describe('BlogNavigation Component', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: jest.fn(),
    selectedCategory: null,
    onCategoryChange: jest.fn()
  };

  test('renders search input with keyboard shortcut hint', () => {
    render(
      <TestWrapper>
        <BlogNavigation {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/Pesquisar artigos.*Ctrl\+K/)).toBeInTheDocument();
  });

  test('handles search input changes', async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();

    render(
      <TestWrapper>
        <BlogNavigation {...defaultProps} onSearchChange={onSearchChange} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/Pesquisar artigos/);
    await user.type(searchInput, 'test query');

    expect(onSearchChange).toHaveBeenCalledWith('test query');
  });

  test('displays categories with post counts', () => {
    render(
      <TestWrapper>
        <BlogNavigation {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Post count
    expect(screen.getByText('Educa��o')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Post count
  });

  test('handles category selection', async () => {
    const user = userEvent.setup();
    const onCategoryChange = jest.fn();

    render(
      <TestWrapper>
        <BlogNavigation {...defaultProps} onCategoryChange={onCategoryChange} />
      </TestWrapper>
    );

    const techCategory = screen.getByText('Tecnologia');
    await user.click(techCategory);

    expect(onCategoryChange).toHaveBeenCalledWith('tecnologia');
  });

  test('shows active filters count', () => {
    render(
      <TestWrapper>
        <BlogNavigation 
          {...defaultProps} 
          searchQuery="test" 
          selectedCategory="tecnologia" 
        />
      </TestWrapper>
    );

    expect(screen.getByText('2 filtros ativos')).toBeInTheDocument();
  });

  test('handles keyboard shortcuts', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <BlogNavigation {...defaultProps} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/Pesquisar artigos/);
    
    // Test Ctrl+K shortcut
    await user.keyboard('{Control>}k{/Control}');
    expect(searchInput).toHaveFocus();
  });

  test('renders horizontal variant', () => {
    render(
      <TestWrapper>
        <BlogNavigation {...defaultProps} variant="horizontal" />
      </TestWrapper>
    );

    expect(screen.getByText('Filtros')).toBeInTheDocument();
  });

  test('clears all filters', async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    const onCategoryChange = jest.fn();

    render(
      <TestWrapper>
        <BlogNavigation 
          {...defaultProps}
          searchQuery="test"
          selectedCategory="tecnologia"
          onSearchChange={onSearchChange}
          onCategoryChange={onCategoryChange}
        />
      </TestWrapper>
    );

    const clearButton = screen.getByText('Limpar todos');
    await user.click(clearButton);

    expect(onSearchChange).toHaveBeenCalledWith('');
    expect(onCategoryChange).toHaveBeenCalledWith(null);
  });
});

describe('TableOfContents Component', () => {
  const mockHtmlContent = `
    <h1>First Header</h1>
    <p>Some content</p>
    <h2>Second Header</h2>
    <p>More content</p>
    <h3>Third Header</h3>
    <p>Even more content</p>
  `;

  beforeEach(() => {
    // Mock DOM methods
    document.querySelector = jest.fn((selector) => {
      if (selector === 'article') {
        const mockElement = document.createElement('div');
        mockElement.innerHTML = mockHtmlContent;
        return mockElement;
      }
      return null;
    });
  });

  test('extracts headers from content', () => {
    render(<TableOfContents content={mockHtmlContent} />);

    expect(screen.getByText('First Header')).toBeInTheDocument();
    expect(screen.getByText('Second Header')).toBeInTheDocument();
    expect(screen.getByText('Third Header')).toBeInTheDocument();
  });

  test('handles collapsible functionality', async () => {
    const user = userEvent.setup();

    render(<TableOfContents content={mockHtmlContent} collapsible={true} />);

    const toggleButton = screen.getByLabelText(/Recolher �ndice/);
    await user.click(toggleButton);

    // TOC content should be hidden
    expect(screen.queryByText('First Header')).not.toBeInTheDocument();
  });

  test('does not render with insufficient headers', () => {
    const shortContent = '<h1>Only Header</h1><p>Content</p>';
    
    const { container } = render(<TableOfContents content={shortContent} minHeaders={3} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('filters headers by max level', () => {
    const contentWithDeepHeaders = `
      <h1>H1</h1>
      <h2>H2</h2>
      <h3>H3</h3>
      <h4>H4</h4>
      <h5>H5</h5>
      <h6>H6</h6>
    `;

    render(<TableOfContents content={contentWithDeepHeaders} maxLevel={3} />);

    expect(screen.getByText('H1')).toBeInTheDocument();
    expect(screen.getByText('H2')).toBeInTheDocument();
    expect(screen.getByText('H3')).toBeInTheDocument();
    expect(screen.queryByText('H4')).not.toBeInTheDocument();
  });

  test('handles header click navigation', async () => {
    const user = userEvent.setup();
    const mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    render(<TableOfContents content={mockHtmlContent} />);

    const headerButton = screen.getByText('First Header').closest('button');
    await user.click(headerButton);

    expect(mockScrollTo).toHaveBeenCalled();
  });

  test('shows reading progress', () => {
    render(<TableOfContents content={mockHtmlContent} showProgress={true} />);

    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  test('renders mobile version differently', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<TableOfContents content={mockHtmlContent} mobileBreakpoint={768} />);

    const container = screen.getByText('�ndice').closest('.toc-mobile');
    expect(container).toBeInTheDocument();
  });
});

describe('AdvancedSearch Component', () => {
  const defaultProps = {
    onSearch: jest.fn(),
    onFiltersChange: jest.fn(),
    initialFilters: {}
  };

  test('renders search input and advanced filters toggle', () => {
    render(
      <TestWrapper>
        <AdvancedSearch {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/Pesquisar artigos/)).toBeInTheDocument();
    expect(screen.getByText('Filtros Avan�ados')).toBeInTheDocument();
  });

  test('expands and collapses advanced filters', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AdvancedSearch {...defaultProps} />
      </TestWrapper>
    );

    const toggleButton = screen.getByText('Filtros Avan�ados');
    
    // Initially collapsed
    expect(screen.queryByText('Categorias')).not.toBeInTheDocument();

    await user.click(toggleButton);

    // Should be expanded
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Autores')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  test('handles search input with tracking', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();

    render(
      <TestWrapper>
        <AdvancedSearch {...defaultProps} onFiltersChange={onFiltersChange} />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/Pesquisar artigos/);
    await user.type(searchInput, 'test search');

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'test search' })
    );
  });

  test('handles category multi-select', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AdvancedSearch {...defaultProps} expanded={true} />
      </TestWrapper>
    );

    const categorySelect = screen.getByText('Selecionar categorias');
    await user.click(categorySelect);

    const techOption = screen.getByText('Tecnologia');
    await user.click(techOption);

    expect(screen.getByText('1 selecionado')).toBeInTheDocument();
  });

  test('handles date range selection', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();

    render(
      <TestWrapper>
        <AdvancedSearch {...defaultProps} expanded={true} onFiltersChange={onFiltersChange} />
      </TestWrapper>
    );

    const startDateInput = screen.getAllByDisplayValue('')[0]; // First date input
    await user.type(startDateInput, '2025-01-01');

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        dateRange: expect.objectContaining({ start: '2025-01-01' })
      })
    );
  });

  test('handles reading time filter', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AdvancedSearch {...defaultProps} expanded={true} />
      </TestWrapper>
    );

    const readingTimeSelect = screen.getByDisplayValue('Qualquer dura��o');
    await user.selectOptions(readingTimeSelect, '1-3');

    // Check if reading time was updated
    expect(readingTimeSelect.value).toBe('1-3');
  });

  test('clears all filters', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();

    render(
      <TestWrapper>
        <AdvancedSearch 
          {...defaultProps}
          expanded={true}
          initialFilters={{ query: 'test', categories: ['tech'] }}
          onFiltersChange={onFiltersChange}
        />
      </TestWrapper>
    );

    const clearButton = screen.getByText('Limpar filtros');
    await user.click(clearButton);

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        query: '',
        categories: [],
        authors: [],
        tags: []
      })
    );
  });

  test('shows active filters count', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          {...defaultProps}
          initialFilters={{ query: 'test', categories: ['tech'] }}
        />
      </TestWrapper>
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Active filters count
  });

  test('handles keyboard shortcuts', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AdvancedSearch {...defaultProps} />
      </TestWrapper>
    );

    // Test Ctrl+Shift+F shortcut
    await user.keyboard('{Control>}{Shift>}f{/Shift}{/Control}');

    expect(screen.getByText('Categorias')).toBeInTheDocument(); // Should expand
  });
});

describe('ShareButtons Component', () => {
  const defaultProps = {
    url: 'https://example.com/test-post',
    title: 'Test Post Title'
  };

  beforeEach(() => {
    // Reset navigator mocks
    delete navigator.share;
    delete navigator.clipboard;
  });

  test('renders social media buttons', () => {
    render(<ShareButtons {...defaultProps} />);

    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Copiar link')).toBeInTheDocument();
  });

  test('renders compact version', () => {
    render(<ShareButtons {...defaultProps} compact={true} />);

    expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Copiar link')).toBeInTheDocument();
  });

  test('shows native share button when Web Share API is supported', () => {
    // Mock Web Share API support
    Object.assign(navigator, {
      share: jest.fn(() => Promise.resolve())
    });

    render(<ShareButtons {...defaultProps} />);

    expect(screen.getByText('Compartilhar')).toBeInTheDocument();
  });

  test('handles native share', async () => {
    const user = userEvent.setup();
    const mockShare = jest.fn(() => Promise.resolve());
    
    Object.assign(navigator, {
      share: mockShare
    });

    render(<ShareButtons {...defaultProps} />);

    const shareButton = screen.getByText('Compartilhar');
    await user.click(shareButton);

    expect(mockShare).toHaveBeenCalledWith({
      title: 'Test Post Title',
      url: 'https://example.com/test-post'
    });
  });

  test('handles clipboard copy', async () => {
    const user = userEvent.setup();
    const mockWriteText = jest.fn(() => Promise.resolve());
    
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText
      }
    });

    render(<ShareButtons {...defaultProps} />);

    const copyButton = screen.getByText('Copiar link');
    await user.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith('https://example.com/test-post');
    
    // Should show success state
    await waitFor(() => {
      expect(screen.getByText('Link copiado!')).toBeInTheDocument();
    });
  });

  test('handles clipboard copy fallback', async () => {
    const user = userEvent.setup();
    
    // Mock document.execCommand for fallback
    document.execCommand = jest.fn(() => true);
    document.createElement = jest.fn(() => ({
      value: '',
      focus: jest.fn(),
      select: jest.fn()
    }));
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();

    render(<ShareButtons {...defaultProps} />);

    const copyButton = screen.getByText('Copiar link');
    await user.click(copyButton);

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  test('opens social media share windows', async () => {
    const user = userEvent.setup();
    const mockOpen = jest.fn();
    window.open = mockOpen;

    render(<ShareButtons {...defaultProps} />);

    const facebookButton = screen.getByText('Facebook');
    await user.click(facebookButton);

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer'),
      'share-facebook',
      expect.stringContaining('width=600,height=400')
    );
  });

  test('handles share URL encoding', () => {
    const propsWithSpecialChars = {
      url: 'https://example.com/test post?param=value',
      title: 'Test Post & More'
    };

    render(<ShareButtons {...propsWithSpecialChars} />);

    // URLs should be properly encoded in href attributes
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  test('handles responsive behavior correctly', () => {
    // Mock different viewport sizes
    const originalInnerWidth = global.innerWidth;
    const originalInnerHeight = global.innerHeight;

    // Mobile
    global.innerWidth = 375;
    global.innerHeight = 667;
    
    const { rerender } = render(<ShareButtons {...defaultProps} />);
    
    // Should show compact layout on mobile
    expect(screen.getByText('Compartilhar')).toBeInTheDocument();

    // Desktop  
    global.innerWidth = 1024;
    global.innerHeight = 768;
    
    rerender(<ShareButtons {...defaultProps} />);
    
    // Should show full layout on desktop
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();

    // Restore original values
    global.innerWidth = originalInnerWidth;
    global.innerHeight = originalInnerHeight;
  });

  test('tracks sharing analytics', async () => {
    const user = userEvent.setup();
    const mockTrackShare = jest.fn();
    
    // Mock analytics service
    jest.doMock('../../services/analyticsService', () => ({
      trackShare: mockTrackShare
    }));

    render(<ShareButtons {...defaultProps} />);

    const facebookButton = screen.getByText('Facebook');
    await user.click(facebookButton);

    expect(mockTrackShare).toHaveBeenCalledWith('facebook', defaultProps.url);
  });

  test('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    const mockShare = jest.fn(() => Promise.reject(new Error('Network error')));
    
    Object.assign(navigator, {
      share: mockShare
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ShareButtons {...defaultProps} />);

    const shareButton = screen.getByText('Compartilhar');
    await user.click(shareButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});

// Performance Tests
describe('Blog Components Performance', () => {
  test('BlogCard renders efficiently with large datasets', () => {
    const largeMockPost = {
      ...mockPost,
      content: 'word '.repeat(5000), // Very large content
      tags: Array.from({ length: 50 }, (_, i) => `tag${i}`), // Many tags
      categories: Array.from({ length: 10 }, (_, i) => ({
        name: `Category ${i}`,
        slug: `category-${i}`
      }))
    };

    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <BlogCard post={largeMockPost} />
      </TestWrapper>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render within reasonable time (100ms threshold)
    expect(renderTime).toBeLessThan(100);
    
    // Should still display content correctly
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
  });

  test('TableOfContents handles large document structures', () => {
    const largeContent = Array.from({ length: 100 }, (_, i) => 
      `<h${(i % 6) + 1}>Header ${i}</h${(i % 6) + 1}><p>Content ${i}</p>`
    ).join('');

    const startTime = performance.now();
    
    render(<TableOfContents content={largeContent} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(150);
  });

  test('AdvancedSearch filters perform well with many options', async () => {
    const user = userEvent.setup();
    
    // Mock large category list
    jest.doMock('../../hooks/useBlogAPI', () => ({
      useCategories: jest.fn(() => ({ 
        data: { 
          data: { 
            categories: Array.from({ length: 100 }, (_, i) => ({
              id: i,
              name: `Category ${i}`,
              slug: `category-${i}`,
              post_count: Math.floor(Math.random() * 50)
            }))
          } 
        }, 
        isLoading: false 
      }))
    }));

    const startTime = performance.now();

    render(
      <TestWrapper>
        <AdvancedSearch {...{ onSearch: jest.fn(), onFiltersChange: jest.fn(), initialFilters: {} }} expanded={true} />
      </TestWrapper>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(200);
  });
});

// Accessibility Tests
describe('Blog Components Accessibility', () => {
  test('BlogCard has proper ARIA labels and keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <BlogCard post={mockPost} />
      </TestWrapper>
    );

    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();

    // Should be keyboard navigable
    card.focus();
    expect(card).toHaveFocus();

    // Should have proper link structure
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  test('BlogNavigation search input has proper labels', () => {
    render(
      <TestWrapper>
        <BlogNavigation searchQuery="" onSearchChange={jest.fn()} />
      </TestWrapper>
    );

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveAttribute('placeholder', expect.stringContaining('Pesquisar artigos'));
  });

  test('ShareButtons have proper ARIA labels', () => {
    render(<ShareButtons {...{ url: 'https://example.com', title: 'Test' }} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  test('TableOfContents navigation is accessible', () => {
    const mockContent = '<h1>Header 1</h1><h2>Header 2</h2>';
    
    render(<TableOfContents content={mockContent} />);

    const tocNav = screen.getByRole('navigation');
    expect(tocNav).toHaveAttribute('aria-label', expect.stringContaining('Índice'));
  });
});

// Error Boundary Tests  
describe('Blog Components Error Handling', () => {
  test('BlogCard handles malformed post data', () => {
    const malformedPost = {
      // Missing required fields
      slug: null,
      title: '',
      content: null,
      categories: undefined
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <TestWrapper>
          <BlogCard post={malformedPost} />
        </TestWrapper>
      );
    }).not.toThrow();

    consoleSpy.mockRestore();
  });

  test('ShareButtons handle missing Web APIs gracefully', () => {
    // Remove Web APIs
    delete navigator.share;
    delete navigator.clipboard;

    expect(() => {
      render(<ShareButtons url="https://example.com" title="Test" />);
    }).not.toThrow();

    // Should still render fallback buttons
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });

  test('TableOfContents handles invalid HTML content', () => {
    const invalidContent = '<h1>Unclosed header<p>Malformed <div>HTML</h1>';

    expect(() => {
      render(<TableOfContents content={invalidContent} />);
    }).not.toThrow();
  });
});

// Edge Cases Tests
describe('Blog Components Edge Cases', () => {
  test('BlogCard handles empty categories and tags', () => {
    const emptyPost = {
      ...mockPost,
      categories: [],
      tags: [],
      author_name: null,
      featured_image_url: null
    };

    render(
      <TestWrapper>
        <BlogCard post={emptyPost} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Artigo')).toBeInTheDocument(); // Fallback image
  });

  test('BlogNavigation handles empty categories response', () => {
    jest.doMock('../../hooks/useBlogAPI', () => ({
      useCategories: jest.fn(() => ({ 
        data: { data: { categories: [] } }, 
        isLoading: false 
      }))
    }));

    render(
      <TestWrapper>
        <BlogNavigation searchQuery="" onSearchChange={jest.fn()} />
      </TestWrapper>
    );

    expect(screen.getByText('Nenhuma categoria disponível')).toBeInTheDocument();
  });

  test('AdvancedSearch handles filter combinations correctly', async () => {
    const user = userEvent.setup();
    const onFiltersChange = jest.fn();

    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearch={jest.fn()}
          onFiltersChange={onFiltersChange}
          initialFilters={{}}
          expanded={true}
        />
      </TestWrapper>
    );

    // Apply multiple filters
    const searchInput = screen.getByPlaceholderText(/Pesquisar artigos/);
    await user.type(searchInput, 'test query');

    // Select date range
    const startDate = screen.getAllByDisplayValue('')[0];
    await user.type(startDate, '2025-01-01');

    // Verify combined filters are applied
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'test query',
        dateRange: expect.objectContaining({ start: '2025-01-01' })
      })
    );
  });

  test('ShareButtons handle special characters in URLs and titles', () => {
    const specialProps = {
      url: 'https://example.com/post?param=value&other=test',
      title: 'Test Post: "Special" Characters & More!'
    };

    render(<ShareButtons {...specialProps} />);

    // Should render without errors
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });
});

// Mobile-specific Tests
describe('Blog Components Mobile Behavior', () => {
  beforeEach(() => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });
    
    // Mock touch events
    global.ontouchstart = true;
    global.navigator.maxTouchPoints = 5;
  });

  test('BlogCard touch interactions work correctly', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <BlogCard post={mockPost} />
      </TestWrapper>
    );

    const card = screen.getByRole('article');
    
    // Simulate touch events
    fireEvent.touchStart(card);
    fireEvent.touchEnd(card);

    // Should handle touch without errors
    expect(card).toBeInTheDocument();
  });

  test('TableOfContents shows mobile dropdown', () => {
    const mockContent = '<h1>Header 1</h1><h2>Header 2</h2>';
    
    render(<TableOfContents content={mockContent} mobileBreakpoint={768} />);

    const tocContainer = screen.getByText('Índice').closest('.toc-mobile');
    expect(tocContainer).toBeInTheDocument();
  });

  test('AdvancedSearch collapses appropriately on mobile', () => {
    render(
      <TestWrapper>
        <AdvancedSearch 
          onSearch={jest.fn()}
          onFiltersChange={jest.fn()}
          initialFilters={{}}
        />
      </TestWrapper>
    );

    // Should show mobile-optimized version
    expect(screen.getByText('Filtros Avançados')).toBeInTheDocument();
  });
});

// Integration test for component interactions
describe('Blog Components Integration', () => {
  test('BlogNavigation filters affect BlogCard rendering', async () => {
    const user = userEvent.setup();
    const mockPosts = [mockPost];
    const onFiltersChange = jest.fn();

    const TestComponent = () => {
      const [filters, setFilters] = React.useState({});
      
      const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        onFiltersChange(newFilters);
      };

      return (
        <div>
          <BlogNavigation
            searchQuery={filters.query || ''}
            selectedCategory={filters.selectedCategory}
            onSearchChange={(query) => handleFiltersChange({...filters, query})}
            onCategoryChange={(category) => handleFiltersChange({...filters, selectedCategory: category})}
          />
          {mockPosts
            .filter(post => !filters.query || post.title.toLowerCase().includes(filters.query.toLowerCase()))
            .map(post => <BlogCard key={post.id} post={post} />)
          }
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Initially should show the post
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();

    // Search for something that doesn't match
    const searchInput = screen.getByPlaceholderText(/Pesquisar artigos/);
    await user.type(searchInput, 'nonexistent');

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'nonexistent' })
    );
  });
});
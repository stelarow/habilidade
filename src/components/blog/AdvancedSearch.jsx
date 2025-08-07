import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom'; // Not needed for SSG
import { 
  MagnifyingGlass, 
  Funnel, 
  CalendarBlank,
  Clock,
  Tag,
  User,
  X,
  CaretDown,
  Check,
  SlidersHorizontal,
  Eraser
} from '@phosphor-icons/react';
import { useCategories } from '../../hooks/useBlogAPI';
import { trackSearch } from '../../services/analyticsService';

/**
 * AdvancedSearch Component
 * Provides comprehensive search and filtering capabilities for blog posts
 */

const AdvancedSearch = ({ 
  onSearch, 
  onFiltersChange, 
  initialFilters = {},
  className = '',
  expanded = false,
  onExpandedChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [filters, setFilters] = useState({
    query: '',
    categories: [],
    authors: [],
    dateRange: { start: '', end: '' },
    readingTime: { min: 0, max: 0 },
    tags: [],
    ...initialFilters
  });
  
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [selectedCategories, setSelectedCategories] = useState(new Set(initialFilters.categories || []));
  const [selectedAuthors, setSelectedAuthors] = useState(new Set(initialFilters.authors || []));
  const [selectedTags, setSelectedTags] = useState(new Set(initialFilters.tags || []));
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || { start: '', end: '' });
  const [readingTimeRange, setReadingTimeRange] = useState(initialFilters.readingTime || { min: 0, max: 0 });
  
  const searchInputRef = useRef(null);
  const location = useLocation();
  // Navigation handled via native browser for SSG
  
  // Fetch categories for filter options
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.data?.categories || [];
  
  // Mock data for authors and tags (in production, these would come from API)
  const availableAuthors = [
    { id: 1, name: 'Equipe Habilidade', slug: 'equipe-habilidade' },
    { id: 2, name: 'Alessandro Ferreira', slug: 'alessandro-ferreira' },
    { id: 3, name: 'Especialista Tech', slug: 'especialista-tech' }
  ];
  
  const availableTags = [
    { id: 1, name: 'Iniciante', slug: 'iniciante' },
    { id: 2, name: 'Avan�ado', slug: 'avancado' },
    { id: 3, name: 'Tutorial', slug: 'tutorial' },
    { id: 4, name: 'Dicas', slug: 'dicas' },
    { id: 5, name: 'Carreira', slug: 'carreira' },
    { id: 6, name: 'Projetos', slug: 'projetos' }
  ];

  // Reading time options
  const readingTimeOptions = [
    { label: 'Qualquer dura��o', min: 0, max: 0 },
    { label: '1-3 min', min: 1, max: 3 },
    { label: '3-7 min', min: 3, max: 7 },
    { label: '7-15 min', min: 7, max: 15 },
    { label: '15+ min', min: 15, max: 999 }
  ];

  // Update filters when individual states change
  useEffect(() => {
    const newFilters = {
      query: searchQuery,
      categories: Array.from(selectedCategories),
      authors: Array.from(selectedAuthors),
      dateRange,
      readingTime: readingTimeRange,
      tags: Array.from(selectedTags)
    };
    
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [searchQuery, selectedCategories, selectedAuthors, dateRange, readingTimeRange, selectedTags, onFiltersChange]);

  // Handle URL synchronization
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Update URL with current filters
    if (searchQuery.trim()) {
      searchParams.set('search', searchQuery.trim());
    } else {
      searchParams.delete('search');
    }
    
    if (selectedCategories.size > 0) {
      searchParams.set('categories', Array.from(selectedCategories).join(','));
    } else {
      searchParams.delete('categories');
    }
    
    if (selectedAuthors.size > 0) {
      searchParams.set('authors', Array.from(selectedAuthors).join(','));
    } else {
      searchParams.delete('authors');
    }
    
    if (selectedTags.size > 0) {
      searchParams.set('tags', Array.from(selectedTags).join(','));
    } else {
      searchParams.delete('tags');
    }
    
    if (dateRange.start || dateRange.end) {
      searchParams.set('dateStart', dateRange.start);
      searchParams.set('dateEnd', dateRange.end);
    } else {
      searchParams.delete('dateStart');
      searchParams.delete('dateEnd');
    }
    
    if (readingTimeRange.min > 0 || readingTimeRange.max > 0) {
      searchParams.set('readingMin', readingTimeRange.min.toString());
      searchParams.set('readingMax', readingTimeRange.max.toString());
    } else {
      searchParams.delete('readingMin');
      searchParams.delete('readingMax');
    }
    
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    if (newUrl !== `${location.pathname}${location.search}`) {
      // For SSG, use native browser navigation with replace
      window.history.replaceState(null, '', newUrl);
    }
  }, [filters, location.pathname]);

  // Handle search input
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    // Track search events
    if (value.trim() && value.length >= 3) {
      trackSearch(value.trim(), 0, selectedCategories.size > 0 ? Array.from(selectedCategories)[0] : null);
    }
  };

  // Handle category toggle
  const handleCategoryToggle = (categorySlug) => {
    const newSelection = new Set(selectedCategories);
    if (newSelection.has(categorySlug)) {
      newSelection.delete(categorySlug);
    } else {
      newSelection.add(categorySlug);
    }
    setSelectedCategories(newSelection);
  };

  // Handle author toggle
  const handleAuthorToggle = (authorSlug) => {
    const newSelection = new Set(selectedAuthors);
    if (newSelection.has(authorSlug)) {
      newSelection.delete(authorSlug);
    } else {
      newSelection.add(authorSlug);
    }
    setSelectedAuthors(newSelection);
  };

  // Handle tag toggle
  const handleTagToggle = (tagSlug) => {
    const newSelection = new Set(selectedTags);
    if (newSelection.has(tagSlug)) {
      newSelection.delete(tagSlug);
    } else {
      newSelection.add(tagSlug);
    }
    setSelectedTags(newSelection);
  };

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle reading time range change
  const handleReadingTimeChange = (option) => {
    setReadingTimeRange({
      min: option.min,
      max: option.max
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories(new Set());
    setSelectedAuthors(new Set());
    setSelectedTags(new Set());
    setDateRange({ start: '', end: '' });
    setReadingTimeRange({ min: 0, max: 0 });
    
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    
    // For SSG, reset URL to pathname only
    window.history.replaceState(null, '', location.pathname);
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategories.size > 0) count++;
    if (selectedAuthors.size > 0) count++;
    if (selectedTags.size > 0) count++;
    if (dateRange.start || dateRange.end) count++;
    if (readingTimeRange.min > 0 || readingTimeRange.max > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Ctrl/Cmd + Shift + F to toggle advanced filters
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        setIsExpanded(!isExpanded);
        onExpandedChange?.(!isExpanded);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, onExpandedChange]);

  // Multi-select component
  const MultiSelect = ({ options, selected, onToggle, placeholder, icon: Icon, loading = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-left text-zinc-300 hover:border-zinc-600/50 focus:border-purple-500/50 focus:outline-none transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-zinc-500" />
            <span className="text-sm">
              {selected.size > 0 
                ? `${selected.size} selecionado${selected.size !== 1 ? 's' : ''}`
                : placeholder
              }
            </span>
          </div>
          <CaretDown size={16} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-48 sm:max-h-60 overflow-y-auto bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl z-50">
            {loading ? (
              <div className="p-3 text-center text-zinc-500">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : (
              <>
                {options.length === 0 ? (
                  <div className="p-3 text-center text-zinc-500 text-sm">
                    Nenhuma op��o dispon�vel
                  </div>
                ) : (
                  options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onToggle(option.slug)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-zinc-700/50 transition-colors"
                    >
                      <div className={`w-4 h-4 border border-zinc-600 rounded flex items-center justify-center ${
                        selected.has(option.slug) ? 'bg-purple-500 border-purple-500' : ''
                      }`}>
                        {selected.has(option.slug) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm text-zinc-300">{option.name}</span>
                      {option.post_count && (
                        <span className="ml-auto text-xs text-zinc-500">
                          {option.post_count}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-zinc-800/30 border border-zinc-700/50 rounded-lg ${className}`}>
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlass size={20} className="text-zinc-500" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Pesquisar artigos... (Ctrl+K)"
            value={searchQuery}
            onChange={handleSearchInput}
            className="w-full pl-10 pr-12 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500/50 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Toggle Advanced Filters Button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            onExpandedChange?.(!isExpanded);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 rounded-lg text-zinc-300 transition-colors"
        >
          <SlidersHorizontal size={16} />
          <span className="text-sm">Filtros Avan�ados</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <CaretDown size={16} className={`ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-700/50 pt-4">
          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Categorias
              </label>
              <MultiSelect
                options={categories}
                selected={selectedCategories}
                onToggle={handleCategoryToggle}
                placeholder="Selecionar categorias"
                icon={Tag}
                loading={categoriesLoading}
              />
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Autores
              </label>
              <MultiSelect
                options={availableAuthors}
                selected={selectedAuthors}
                onToggle={handleAuthorToggle}
                placeholder="Selecionar autores"
                icon={User}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tags
              </label>
              <MultiSelect
                options={availableTags}
                selected={selectedTags}
                onToggle={handleTagToggle}
                placeholder="Selecionar tags"
                icon={Tag}
              />
            </div>

            {/* Reading Time */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tempo de Leitura
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                <select
                  value={readingTimeRange.min === 0 && readingTimeRange.max === 0 ? '' : `${readingTimeRange.min}-${readingTimeRange.max}`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      handleReadingTimeChange({ min: 0, max: 0 });
                    } else {
                      const [min, max] = value.split('-').map(Number);
                      handleReadingTimeChange({ min, max });
                    }
                  }}
                  className="w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 focus:border-purple-500/50 focus:outline-none transition-colors"
                >
                  {readingTimeOptions.map((option, index) => (
                    <option 
                      key={index} 
                      value={option.min === 0 && option.max === 0 ? '' : `${option.min}-${option.max}`}
                      className="bg-zinc-800 text-zinc-300"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Per�odo de Publica��o
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <CalendarBlank size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 focus:border-purple-500/50 focus:outline-none transition-colors"
                  placeholder="Data inicial"
                />
              </div>
              <div className="relative">
                <CalendarBlank size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 focus:border-purple-500/50 focus:outline-none transition-colors"
                  placeholder="Data final"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-zinc-500">
              <kbd className="px-2 py-1 text-xs bg-zinc-700/50 border border-zinc-600/50 rounded">
                Ctrl+Shift+F
              </kbd>
              <span className="ml-2">para alternar filtros</span>
            </div>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-colors"
              >
                <Eraser size={16} />
                Limpar filtros
              </button>
            )}
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <Funnel size={16} className="text-purple-400" />
              <span className="text-sm text-purple-300">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} ativo{activeFiltersCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
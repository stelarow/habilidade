/**
 * useCourseSuggestions Hook - Hook personalizado para sugestões de cursos
 * Integra com o sistema de matching e gerencia estado das sugestões
 */

import { useState, useEffect, useMemo } from 'react';
import { suggestCourses, filterSuggestions } from '../utils/courseMatchingService';

/**
 * Hook para obter sugestões de cursos baseadas em post de blog
 */
export const useCourseSuggestions = (post, options = {}) => {
  const {
    maxSuggestions = 3,
    minScore = 1,
    includeGeneric = true,
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutos
    filters = {}
  } = options;

  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Função para buscar sugestões
  const fetchSuggestions = useMemo(() => {
    return async (forceRefresh = false) => {
      if (!post) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Busca sugestões
        const rawSuggestions = suggestCourses(post, {
          maxSuggestions,
          minScore,
          includeGeneric,
          useCache: !forceRefresh
        });

        // Aplica filtros se fornecidos
        const filteredSuggestions = Object.keys(filters).length > 0
          ? filterSuggestions(rawSuggestions, filters)
          : rawSuggestions;

        setSuggestions(filteredSuggestions);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error('Error fetching course suggestions:', err);
        setError(err.message || 'Erro ao buscar sugestões de cursos');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
  }, [post, maxSuggestions, minScore, includeGeneric, filters]);

  // Busca inicial
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Auto-refresh se habilitado
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      fetchSuggestions();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchSuggestions]);

  // Função para forçar refresh
  const refresh = () => {
    fetchSuggestions(true);
  };

  // Métricas das sugestões
  const metrics = useMemo(() => {
    if (!suggestions.length) return null;

    const totalScore = suggestions.reduce((sum, item) => sum + item.score, 0);
    const averageScore = totalScore / suggestions.length;
    const bestMatch = suggestions[0];
    const hasGeneric = suggestions.some(item => item.isGeneric);

    return {
      totalSuggestions: suggestions.length,
      averageScore: Math.round(averageScore * 100) / 100,
      bestMatch: bestMatch ? {
        title: bestMatch.course.basicInfo.title,
        score: bestMatch.score,
        reason: bestMatch.relevanceReason
      } : null,
      hasGeneric
    };
  }, [suggestions]);

  return {
    suggestions,
    isLoading,
    error,
    lastUpdated,
    refresh,
    metrics
  };
};

/**
 * Hook para sugestões em tempo real durante digitação (para admin)
 */
export const useRealtimeCourseSuggestions = (content, options = {}) => {
  const {
    debounceMs = 500,
    minLength = 50
  } = options;

  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!content || content.length < minLength) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsAnalyzing(true);
      
      // Simula post para análise
      const mockPost = {
        title: '',
        content: content,
        excerpt: '',
        categories: [],
        tags: []
      };

      try {
        const newSuggestions = suggestCourses(mockPost, {
          maxSuggestions: 5,
          minScore: 0.5,
          includeGeneric: false
        });

        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error in realtime suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsAnalyzing(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [content, debounceMs, minLength]);

  return {
    suggestions,
    isAnalyzing
  };
};

/**
 * Hook para comparar mudanças em sugestões
 */
export const useCourseSuggestionsComparison = (post, previousPost) => {
  const currentSuggestions = useCourseSuggestions(post);
  const previousSuggestions = useCourseSuggestions(previousPost);

  const comparison = useMemo(() => {
    if (!currentSuggestions.suggestions.length && !previousSuggestions.suggestions.length) {
      return null;
    }

    const currentIds = new Set(currentSuggestions.suggestions.map(s => s.course.basicInfo.id));
    const previousIds = new Set(previousSuggestions.suggestions.map(s => s.course.basicInfo.id));

    const added = currentSuggestions.suggestions.filter(s => !previousIds.has(s.course.basicInfo.id));
    const removed = previousSuggestions.suggestions.filter(s => !currentIds.has(s.course.basicInfo.id));
    const kept = currentSuggestions.suggestions.filter(s => previousIds.has(s.course.basicInfo.id));

    return {
      added,
      removed,
      kept,
      hasChanges: added.length > 0 || removed.length > 0,
      improvementScore: currentSuggestions.metrics?.averageScore - (previousSuggestions.metrics?.averageScore || 0)
    };
  }, [currentSuggestions.suggestions, previousSuggestions.suggestions, currentSuggestions.metrics, previousSuggestions.metrics]);

  return {
    current: currentSuggestions,
    previous: previousSuggestions,
    comparison
  };
};

/**
 * Hook para cache local de sugestões
 */
export const useCachedCourseSuggestions = (post, options = {}) => {
  const {
    cacheKey: customCacheKey = null,
    cacheExpiry = 10 * 60 * 1000, // 10 minutos
    ...otherOptions
  } = options;

  const cacheKey = customCacheKey || `suggestions_${post?.slug || 'unknown'}`;
  
  const [cachedData, setCachedData] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheExpiry) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Error reading cached suggestions:', error);
    }
    return null;
  });

  const suggestions = useCourseSuggestions(post, otherOptions);

  // Atualiza cache quando há novas sugestões
  useEffect(() => {
    if (suggestions.suggestions.length > 0 && !suggestions.isLoading) {
      try {
        const cacheData = {
          data: suggestions.suggestions,
          timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        setCachedData(suggestions.suggestions);
      } catch (error) {
        console.warn('Error saving suggestions to cache:', error);
      }
    }
  }, [suggestions.suggestions, suggestions.isLoading, cacheKey]);

  return {
    ...suggestions,
    suggestions: suggestions.isLoading && cachedData ? cachedData : suggestions.suggestions,
    isCached: suggestions.isLoading && !!cachedData
  };
};

export default useCourseSuggestions;
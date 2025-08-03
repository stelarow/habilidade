// Blog API service - agora conectado ao Supabase
import { supabaseBlogAPI } from './supabaseBlogAPI.js';

// Re-export das funções do Supabase API
export const blogAPI = {
  health: supabaseBlogAPI.health,
  getAllPosts: supabaseBlogAPI.getAllPosts,
  getPostBySlug: supabaseBlogAPI.getPostBySlug,
  getPostsByCategory: supabaseBlogAPI.getPostsByCategory,
  getCategories: supabaseBlogAPI.getCategories,
  searchPosts: supabaseBlogAPI.searchPosts,
  getConfig: supabaseBlogAPI.getConfig,
  setDebugMode: supabaseBlogAPI.setDebugMode
};

// Exports helpers
export const getBlogAPIConfig = () => blogAPI.getConfig();
export const setBlogAPIDebug = (enabled) => blogAPI.setDebugMode(enabled);
export const checkBlogAPIHealth = () => blogAPI.health.checkHealth();

export default blogAPI;
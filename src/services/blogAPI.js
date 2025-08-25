// Blog API service - Sistema Estático baseado em JSON local
import { staticBlogAPI } from './staticBlogAPI.js';

// Re-export das funções do Static API
export const blogAPI = {
  health: staticBlogAPI.health,
  getAllPosts: staticBlogAPI.getAllPosts,
  getPostBySlug: staticBlogAPI.getPostBySlug,
  getPostsByCategory: staticBlogAPI.getPostsByCategory,
  getCategories: staticBlogAPI.getCategories,
  searchPosts: staticBlogAPI.searchPosts,
  getConfig: staticBlogAPI.getConfig,
  setDebugMode: staticBlogAPI.setDebugMode
};

// Exports helpers
export const getBlogAPIConfig = () => blogAPI.getConfig();
export const setBlogAPIDebug = (enabled) => blogAPI.setDebugMode(enabled);
export const checkBlogAPIHealth = () => blogAPI.health.checkHealth();

export default blogAPI;
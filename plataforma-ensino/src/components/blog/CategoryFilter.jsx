import React from 'react';
import { Filter, X } from 'phosphor-react';

const CategoryFilter = ({ 
  categories = [], 
  selectedCategory = null, 
  onCategoryChange = () => {},
  showCounts = true,
  className = ''
}) => {
  const totalCount = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

  return (
    <div className={`flex flex-wrap gap-2 mb-6 ${className}`}>
      <button
        onClick={() => onCategoryChange(null)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          !selectedCategory 
            ? 'bg-purple-600 text-white' 
            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
        }`}
      >
        <Filter size={16} />
        Todos
        {showCounts && (
          <span className="opacity-75">
            ({totalCount})
          </span>
        )}
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id || category.slug}
          onClick={() => onCategoryChange(category.slug)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === category.slug
              ? 'bg-purple-600 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          }`}
        >
          {category.name}
          {showCounts && category.count && (
            <span className="opacity-75">
              ({category.count})
            </span>
          )}
        </button>
      ))}
      
      {selectedCategory && (
        <button
          onClick={() => onCategoryChange(null)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
          title="Limpar filtros"
        >
          <X size={16} />
          Limpar
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
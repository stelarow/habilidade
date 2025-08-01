import React from 'react';
import { Link } from 'react-router-dom';
import { CaretRight, House, Article } from 'phosphor-react';

const BlogHeader = ({ breadcrumbs = [] }) => {
  // Default breadcrumbs structure
  const defaultBreadcrumbs = [
    { label: 'Início', href: '/', icon: House },
    { label: 'Blog', href: '/blog', icon: Article }
  ];

  // Merge default with custom breadcrumbs
  const allBreadcrumbs = [...defaultBreadcrumbs, ...breadcrumbs];

  return (
    <section className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800/50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm">
            {allBreadcrumbs.map((crumb, index) => {
              const isLast = index === allBreadcrumbs.length - 1;
              const Icon = crumb.icon;
              
              return (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <CaretRight size={14} className="text-zinc-600" />
                  )}
                  
                  {isLast ? (
                    <span 
                      className="flex items-center gap-1 text-zinc-400 font-medium"
                      aria-current="page"
                    >
                      {Icon && <Icon size={16} />}
                      {crumb.label}
                    </span>
                  ) : (
                    <Link 
                      to={crumb.href} 
                      onClick={crumb.href === '/' ? (e) => { e.preventDefault(); window.location.href = '/'; } : undefined}
                      className="flex items-center gap-1 text-zinc-300 hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm px-1 py-0.5"
                    >
                      {Icon && <Icon size={16} />}
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Blog Section Title */}
        <div className="flex items-center gap-3">
          <Article size={32} className="text-fuchsia-400" />
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Blog
            </h1>
            <p className="text-zinc-400 text-sm">
              Artigos sobre tecnologia, educação e desenvolvimento de carreira
            </p>
          </div>
        </div>

        {/* Optional sidebar navigation hint */}
        <div className="mt-4 pt-4 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-500">
            Navegue pelas categorias ou use a busca para encontrar conteúdo específico
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHeader;
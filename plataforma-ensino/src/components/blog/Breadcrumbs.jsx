import React from 'react';
import { Link } from 'react-router-dom';
import { CaretRight, House } from 'phosphor-react';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <House size={16} />
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <CaretRight size={12} className="text-zinc-600" />
            
            {item.current ? (
              <span className="text-zinc-300 font-medium truncate max-w-xs md:max-w-md">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-zinc-400 hover:text-zinc-300 transition-colors truncate max-w-xs md:max-w-md"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
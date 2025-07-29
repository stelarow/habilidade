import React from 'react';

const BlogBadge = ({
  children,
  variant = 'category',
  size = 'medium',
  categorySlug,
  className = '',
  icon: Icon,
  ...props
}) => {
  // Base classes following site's design system
  const baseClasses = "inline-flex items-center gap-1 font-medium rounded-full border transition-all duration-300";
  
  // Category-specific colors matching site's theme
  const categoryColors = {
    'tecnologia': 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30',
    'educacao': 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30',
    'carreira': 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30',
    'design': 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30',
    'programacao': 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30',
    'marketing': 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30',
    'ia': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30',
    'bi': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30',
  };
  
  // Variant styles
  const variants = {
    category: categorySlug ? categoryColors[categorySlug] || 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/30' : 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    tag: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/50 hover:bg-zinc-600/50 hover:text-zinc-300',
    status: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30',
    featured: 'bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30',
    new: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30',
    premium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30'
  };

  // Size styles
  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  };

  // Combine classes
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <span className={classes} {...props}>
      {Icon && <Icon size={size === 'small' ? 12 : size === 'large' ? 16 : 14} />}
      {children}
    </span>
  );
};

export default BlogBadge;
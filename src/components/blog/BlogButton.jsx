import React from 'react';
import { Link } from 'react-router-dom';

const BlogButton = ({ 
  children,
  variant = 'primary',
  size = 'medium',
  to,
  href,
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  // Base classes following site's design system
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-lg";
  
  // Variant styles matching site's button system
  const variants = {
    primary: "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:from-fuchsia-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/25 focus:ring-fuchsia-400 btn-neon",
    secondary: "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 focus:ring-zinc-400",
    outline: "bg-transparent text-fuchsia-400 border border-fuchsia-400 hover:bg-fuchsia-400 hover:text-white focus:ring-fuchsia-400",
    ghost: "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white focus:ring-zinc-400",
    share: "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600 hover:text-white border border-zinc-600/50 hover:border-zinc-500",
    cta: "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:shadow-orange-500/25 focus:ring-orange-400",
    category: "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/50 hover:border-zinc-600"
  };

  // Size styles
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };

  // Disabled styles
  const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none";

  // Combine classes
  const classes = `
    ${baseClasses}
    ${variants[variant] || variants.primary}
    ${sizes[size]}
    ${disabled ? disabledClasses : ''}
    ${className}
  `.trim();

  // Content with icon
  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon size={size === 'small' ? 16 : size === 'large' ? 20 : 18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'small' ? 16 : size === 'large' ? 20 : 18} />}
    </>
  );

  // Return appropriate element based on props
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button 
      className={classes} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default BlogButton;
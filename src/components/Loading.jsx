const Loading = ({ 
  size = 'md', 
  color = 'fuchsia', 
  className = '',
  text = null,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    fuchsia: 'border-fuchsia-400 border-t-transparent',
    cyan: 'border-cyan-400 border-t-transparent',
    white: 'border-white border-t-transparent',
    primary: 'border-purple-400 border-t-transparent'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className={`${sizeClasses[size]} bg-fuchsia-400 rounded-full animate-pulse`}></div>
        <div className={`${sizeClasses[size]} bg-cyan-400 rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
        <div className={`${sizeClasses[size]} bg-purple-400 rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
        {text && <span className="ml-2 text-zinc-300 text-sm">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-fuchsia-400 to-cyan-400 rounded-full animate-ping`}></div>
        {text && <span className="text-zinc-300 text-sm">{text}</span>}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin`}
      ></div>
      {text && <span className="text-zinc-300 text-sm">{text}</span>}
    </div>
  );
};

export default Loading; 
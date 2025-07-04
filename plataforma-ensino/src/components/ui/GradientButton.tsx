import React from 'react';
import Link from 'next/link';

interface GradientButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

function GradientButton({ 
  href, 
  children, 
  className = '', 
  type = 'button',
  onClick,
  disabled = false,
  ...props 
}: GradientButtonProps) {
  const base = 'btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${base} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      className={classes} 
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default GradientButton;
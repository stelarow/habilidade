function GradientButton({ href, children, className = '', ...props }) {
  const base = 'btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition';
  const classes = `${base} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export default GradientButton; 
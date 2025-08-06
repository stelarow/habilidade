function GradientButton({ href, children, className = '', ...props }) {
  const base = 'btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition';
  const classes = `${base} ${className}`;

  if (href) {
    // Handle smooth scrolling for anchor links
    const handleClick = (e) => {
      if (href.startsWith('#')) {
        e.preventDefault();
        const element = document.getElementById(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    return (
      <a href={href} className={classes} onClick={handleClick} {...props}>
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
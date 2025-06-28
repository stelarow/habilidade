function Section({ id, className = '', children, ...props }) {
  const base = 'relative flex flex-col items-center justify-center min-h-screen px-4';
  const classes = `${base} ${className}`;
  return (
    <section id={id} className={classes} {...props}>
      {children}
    </section>
  );
}

export default Section; 
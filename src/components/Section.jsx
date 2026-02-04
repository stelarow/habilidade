function Section({ id, className = '', fullHeight = false, children, as: Tag = 'section', ...props }) {
  const minHeight = fullHeight ? 'min-h-screen' : 'min-h-0';
  const base = `relative flex flex-col items-center justify-center ${minHeight} px-4`;
  const classes = `${base} ${className}`;
  return (
    <Tag id={id} className={classes} {...props}>
      {children}
    </Tag>
  );
}

export default Section; 
import React from 'react';
import SEOHead from '../shared/SEOHead';
import BlogHeader from './BlogHeader';

const BlogLayout = ({ 
  children, 
  title = "Blog - Escola Habilidade", 
  description = "Artigos sobre tecnologia, educação e desenvolvimento de carreira",
  breadcrumbs = [],
  showBlogHeader = true,
  className = ""
}) => {
  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        type="website"
      />
      
      {/* Blog-specific header with breadcrumbs */}
      {showBlogHeader && (
        <BlogHeader breadcrumbs={breadcrumbs} />
      )}
      
      {/* Main content container with consistent spacing */}
      <div className={`py-8 ${className}`}>
        {children}
      </div>
    </>
  );
};

export default BlogLayout;
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
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
  // Cleanup effect to reset title when component unmounts
  React.useEffect(() => {
    return () => {
      // Reset to default home title when leaving blog
      document.title = 'Escola Habilidade - Transformando Vidas através da Educação Tecnológica';
    };
  }, []);

  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        type="website"
      />
      
      {/* Header idêntico ao site principal */}
      <Header />
      
      {/* Blog-specific header with breadcrumbs */}
      {showBlogHeader && (
        <BlogHeader breadcrumbs={breadcrumbs} />
      )}
      
      {/* Main content container with consistent spacing */}
      <main 
        id="main-content"
        className={`min-h-screen bg-zinc-950 pt-16 ${className}`}
        role="main"
      >
        {/* Container with consistent max-width and padding */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      {/* Footer idêntico ao site principal */}
      <Footer />
    </>
  );
};

export default BlogLayout;
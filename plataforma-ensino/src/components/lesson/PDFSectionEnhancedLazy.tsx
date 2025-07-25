import React from 'react';
import dynamic from 'next/dynamic';

// Import CSS statically to avoid dynamic import issues
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Lazy load the heavy PDF components with proper loading states
const Document = dynamic(
  () => import('react-pdf').then(mod => ({ default: mod.Document })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading PDF engine...</p>
      </div>
    ),
    ssr: false
  }
);

const Page = dynamic(
  () => import('react-pdf').then(mod => ({ default: mod.Page })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse bg-gray-300 rounded-lg w-full h-96"></div>
      </div>
    ),
    ssr: false
  }
);

// Re-export the enhanced component with lazy loading
const PDFSectionEnhanced = dynamic(
  () => import('./PDFSectionEnhanced'),
  {
    loading: () => (
      <section className="relative bg-muted rounded-lg mb-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 rounded-b-lg p-8 min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4 mx-auto"></div>
            <p className="text-gray-600 font-medium">Initializing PDF viewer...</p>
            <p className="text-gray-500 text-sm mt-2">Loading PDF libraries...</p>
          </div>
        </div>
      </section>
    ),
    ssr: false
  }
);

export { Document, Page };
export default PDFSectionEnhanced;
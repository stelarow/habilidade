'use client'

import React from 'react'
import { PDFData } from '@/types/lesson'

interface PDFViewerProps {
  pdf: PDFData
  className?: string
}

/**
 * PDFViewer - Enhanced PDF viewer component
 * 
 * PLACEHOLDER for Fase 2: Desenvolvimento de Componentes
 * 
 * Will implement:
 * - Custom toolbar with brand colors
 * - Zoom controls and page navigation
 * - Reading progress tracking
 * - Bookmark functionality
 * - Search within PDF
 * - Fullscreen mode
 * - Download button
 */
export function PDFViewer({ pdf, className }: PDFViewerProps) {
  return (
    <div className={`pdf-viewer-container ${className || ''}`}>
      <div className="pdf-viewer-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">📄</div>
          <h3>PDF Viewer</h3>
          <p>Fase 2 Implementation Pending</p>
          <div className="placeholder-details">
            <p><strong>Title:</strong> {pdf.title}</p>
            <p><strong>Filename:</strong> {pdf.filename}</p>
            <p><strong>Size:</strong> {(pdf.size / 1024 / 1024).toFixed(2)} MB</p>
            {pdf.pageCount && <p><strong>Pages:</strong> {pdf.pageCount}</p>}
            <p><strong>Downloadable:</strong> {pdf.downloadable ? 'Yes' : 'No'}</p>
          </div>
          {pdf.downloadable && (
            <button className="download-button">
              📥 Download PDF
            </button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .pdf-viewer-container {
          width: 100%;
          height: 100%;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pdf-viewer-placeholder {
          background: linear-gradient(145deg, rgba(0, 196, 255, 0.1), rgba(0, 150, 200, 0.1));
          border: 2px dashed rgba(0, 196, 255, 0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        
        .placeholder-content {
          color: #fff;
        }
        
        .placeholder-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .placeholder-details {
          margin-top: 1rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .placeholder-details p {
          margin: 0.25rem 0;
        }
        
        .download-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 196, 255, 0.2);
          border: 1px solid rgba(0, 196, 255, 0.5);
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .download-button:hover {
          background: rgba(0, 196, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
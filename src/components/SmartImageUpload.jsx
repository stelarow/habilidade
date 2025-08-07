import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image, CheckCircle, AlertCircle, X, Eye } from '@phosphor-icons/react';
import imageUploadProcessor from '../utils/imageUploadProcessor';

const SmartImageUpload = ({ 
  onUpload, 
  context = 'blog',
  multiple = false,
  maxFiles = 5,
  className = '',
  showPreview = true 
}) => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(async (selectedFiles) => {
    if (!selectedFiles?.length) return;

    setProcessing(true);
    const fileArray = Array.from(selectedFiles);

    try {
      const results = await imageUploadProcessor.processBatch(fileArray, context, {
        quality: 0.85,
        maintainAspectRatio: true,
        useAIUpscaling: true
      });

      // Process successful uploads
      const processedFiles = await Promise.all(
        results.results.map(async (result) => ({
          id: Date.now() + Math.random(),
          file: result.file,
          processed: result.processed,
          originalDimensions: result.originalDimensions,
          finalDimensions: result.finalDimensions,
          message: result.message,
          preview: await imageUploadProcessor.generatePreview(result.file),
          status: 'success'
        }))
      );

      // Add error files
      const errorFiles = results.errors.map(error => ({
        id: Date.now() + Math.random(),
        fileName: error.file,
        error: error.error,
        status: 'error'
      }));

      const allFiles = [...processedFiles, ...errorFiles];
      
      if (multiple) {
        setFiles(prev => [...prev, ...allFiles].slice(0, maxFiles));
      } else {
        setFiles(allFiles.slice(0, 1));
      }

      // Call upload callback with successful files
      if (onUpload && processedFiles.length > 0) {
        onUpload(multiple ? processedFiles : processedFiles[0]);
      }

    } catch (error) {
      console.error('Erro no processamento de imagens:', error);
      setFiles(prev => [...prev, {
        id: Date.now(),
        fileName: 'Erro geral',
        error: error.message,
        status: 'error'
      }]);
    } finally {
      setProcessing(false);
    }
  }, [context, multiple, maxFiles, onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeFile = useCallback((id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const showPreviewModal = useCallback((file) => {
    setPreviewImage(file);
  }, []);

  const getContextInfo = () => {
    const info = {
      blog: { minWidth: 800, minHeight: 600, description: 'Blog articles' },
      card: { minWidth: 600, minHeight: 400, description: 'Card images' },
      hero: { minWidth: 1200, minHeight: 800, description: 'Hero banners' },
      thumbnail: { minWidth: 300, minHeight: 200, description: 'Thumbnails' }
    };
    return info[context] || info.blog;
  };

  const contextInfo = getContextInfo();

  return (
    <div className={`smart-image-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500'
          }
          ${processing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-3 rounded-full transition-colors
            ${dragActive 
              ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }
          `}>
            <Upload size={24} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Upload de Imagens Inteligente
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Arraste e solte ou clique para selecionar imagens
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Contexto: {contextInfo.description} • Mínimo: {contextInfo.minWidth}x{contextInfo.minHeight}px
            </p>
          </div>

          {processing && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
              <span className="text-sm">Processando imagens...</span>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Imagens Processadas ({files.length})
          </h4>
          
          {files.map((file) => (
            <div
              key={file.id}
              className={`
                flex items-center gap-4 p-4 rounded-lg border
                ${file.status === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }
              `}
            >
              {/* Status Icon */}
              <div className={`
                flex-shrink-0 p-2 rounded-full
                ${file.status === 'success' 
                  ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400'
                }
              `}>
                {file.status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {file.file?.name || file.fileName}
                </p>
                
                {file.status === 'success' ? (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    <p>{file.message}</p>
                    {file.originalDimensions && file.finalDimensions && (
                      <p className="text-xs mt-1">
                        {file.processed 
                          ? `${file.originalDimensions.width}x${file.originalDimensions.height} → ${Math.round(file.finalDimensions.width)}x${Math.round(file.finalDimensions.height)}`
                          : `${file.originalDimensions.width}x${file.originalDimensions.height} (original)`
                        }
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-600 dark:text-red-400">{file.error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {file.status === 'success' && file.preview && showPreview && (
                  <button
                    onClick={() => showPreviewModal(file)}
                    className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                    title="Visualizar"
                  >
                    <Eye size={16} />
                  </button>
                )}
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
                  title="Remover"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Preview - {previewImage.file?.name}
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <img
                src={previewImage.preview}
                alt="Preview"
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
              
              <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                <p><strong>Dimensões:</strong> {Math.round(previewImage.finalDimensions.width)}x{Math.round(previewImage.finalDimensions.height)}</p>
                <p><strong>Processado:</strong> {previewImage.processed ? 'Sim' : 'Não'}</p>
                <p><strong>Status:</strong> {previewImage.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartImageUpload;
import React, { useState } from 'react';
import SmartImageUpload from '../components/SmartImageUpload';

/**
 * Example component demonstrating the Smart Image Upload system
 * Shows how to integrate automatic image processing and optimization
 */
const SmartImageUploadExample = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (images) => {
    setUploading(true);
    
    try {
      // In a real implementation, you would upload to your server/storage
      // For this example, we'll just simulate processing
      console.log('Images processed and ready for upload:', images);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to our local state
      if (Array.isArray(images)) {
        setUploadedImages(prev => [...prev, ...images]);
      } else {
        setUploadedImages(prev => [...prev, images]);
      }
      
      console.log('✅ Upload completed successfully');
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Sistema de Upload Inteligente de Imagens
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Sistema automático que redimensiona imagens pequenas, otimiza qualidade e 
          valida dimensões antes do upload. Ideal para artigos de blog e conteúdo web.
        </p>
      </div>

      {/* Different context examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blog Context */}
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload para Blog</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Imagens para artigos - mínimo 800x600px, redimensionamento automático.
          </p>
          <SmartImageUpload
            context="blog"
            multiple={true}
            maxFiles={5}
            onUpload={handleImageUpload}
            showPreview={true}
          />
        </div>

        {/* Hero Context */}
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload para Hero</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Imagens principais - mínimo 1200x800px, qualidade premium.
          </p>
          <SmartImageUpload
            context="hero"
            multiple={false}
            onUpload={handleImageUpload}
            showPreview={true}
          />
        </div>

        {/* Card Context */}
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload para Cards</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Imagens de cards - mínimo 600x400px, otimização balanceada.
          </p>
          <SmartImageUpload
            context="card"
            multiple={true}
            maxFiles={3}
            onUpload={handleImageUpload}
            showPreview={true}
          />
        </div>

        {/* Thumbnail Context */}
        <div className="bg-zinc-800/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload para Thumbnails</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Miniaturas - mínimo 300x200px, compressão otimizada.
          </p>
          <SmartImageUpload
            context="thumbnail"
            multiple={true}
            maxFiles={10}
            onUpload={handleImageUpload}
            showPreview={true}
          />
        </div>
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
            <span className="text-blue-400">Fazendo upload das imagens processadas...</span>
          </div>
        </div>
      )}

      {/* Uploaded Images Summary */}
      {uploadedImages.length > 0 && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Imagens Enviadas ({uploadedImages.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                {image.preview && (
                  <img
                    src={image.preview}
                    alt={image.file?.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                
                <div className="text-sm">
                  <p className="font-medium text-white truncate">
                    {image.file?.name}
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">
                    {Math.round(image.finalDimensions?.width)}x{Math.round(image.finalDimensions?.height)}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {image.processed ? '🔧 Otimizada' : '✓ Original'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Features */}
      <div className="bg-zinc-800/30 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recursos do Sistema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-zinc-300">✨ Otimizações Automáticas</h4>
            <ul className="text-zinc-400 space-y-1 text-xs">
              <li>• Redimensionamento inteligente para imagens pequenas</li>
              <li>• Upscaling de alta qualidade (até 2x)</li>
              <li>• Compressão com preservação de qualidade</li>
              <li>• Aplicação de filtros de nitidez</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-zinc-300">🛡️ Validações</h4>
            <ul className="text-zinc-400 space-y-1 text-xs">
              <li>• Verificação de dimensões mínimas</li>
              <li>• Validação de formatos suportados</li>
              <li>• Limite de tamanho de arquivo</li>
              <li>• Verificação de integridade</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-zinc-300">⚡ Performance</h4>
            <ul className="text-zinc-400 space-y-1 text-xs">
              <li>• Processamento em lote</li>
              <li>• Preview instantâneo</li>
              <li>• Processamento assíncrono</li>
              <li>• Cache de otimizações</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-zinc-300">🎯 Contextos</h4>
            <ul className="text-zinc-400 space-y-1 text-xs">
              <li>• Blog: 800x600px mínimo</li>
              <li>• Hero: 1200x800px mínimo</li>
              <li>• Card: 600x400px mínimo</li>
              <li>• Thumbnail: 300x200px mínimo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartImageUploadExample;
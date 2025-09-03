import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretLeft, CaretRight, PlayCircle, Pause } from '@phosphor-icons/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import VideoPlayer from './VideoPlayer';

const ProjetistaGalleryWithLightbox = ({ 
  items, 
  columns = 4, 
  className = "",
  showTitles = true,
  layout = "grid", // "grid" | "featured"
  featuredIndex = 0 // qual item será destacado
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    // Se o item é um vídeo, começar reproduzindo automaticamente
    const item = items[index];
    setIsVideoPlaying(item?.type === 'video');
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsVideoPlaying(false);
  };

  const navigateToNext = () => {
    const nextIndex = (selectedIndex + 1) % items.length;
    setSelectedIndex(nextIndex);
    // Auto-reproduzir se o próximo item for vídeo
    const nextItem = items[nextIndex];
    setIsVideoPlaying(nextItem?.type === 'video');
  };

  const navigateToPrev = () => {
    const prevIndex = (selectedIndex - 1 + items.length) % items.length;
    setSelectedIndex(prevIndex);
    // Auto-reproduzir se o item anterior for vídeo
    const prevItem = items[prevIndex];
    setIsVideoPlaying(prevItem?.type === 'video');
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const currentItem = selectedIndex !== null ? items[selectedIndex] : null;
  const featuredItem = items[featuredIndex] || items[0];
  const otherItems = items.filter((_, index) => index !== featuredIndex);

  // Renderizar layout featured (assimétrico)
  const renderFeaturedLayout = () => (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${className}`}>
      {/* Item em Destaque - Ocupa 2 colunas */}
      <div className="lg:col-span-2">
        <Card className="group relative overflow-hidden bg-zinc-800/50 border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
          <CardContent className="p-0">
            <AspectRatio ratio={16 / 9}>
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => openLightbox(featuredIndex)}
              >
                {featuredItem.type === 'video' ? (
                  <>
                    <VideoPlayer
                      src={featuredItem.src}
                      title={featuredItem.title}
                      muted={true}
                      autoPlay={false}
                      controls={true}
                      className=""
                      aspectRatio="w-full h-full"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={featuredItem.src}
                      alt={featuredItem.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
                
                {/* Info overlay para item destacado */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {featuredItem.title}
                    </h3>
                    {featuredItem.description && (
                      <p className="text-white/80 text-sm line-clamp-2">
                        {featuredItem.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AspectRatio>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Itens Menores - 1 coluna */}
      <div className="space-y-4">
        {otherItems.slice(0, 4).map((item, index) => {
          const originalIndex = items.findIndex(originalItem => originalItem === item);
          return (
            <Card key={originalIndex} className="group relative overflow-hidden bg-zinc-800/50 border-zinc-700/50 hover:border-purple-400/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-0">
                <AspectRatio ratio={4 / 3}>
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => openLightbox(originalIndex)}
                  >
                    {item.type === 'video' ? (
                      <>
                        <VideoPlayer
                          src={item.src}
                          title={item.title}
                          muted={true}
                          autoPlay={false}
                          controls={true}
                          aspectRatio="w-full h-full"
                          className=""
                        />
                      </>
                    ) : (
                      <>
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    )}
                    
                    {showTitles && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-medium line-clamp-1">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-white/60 text-xs line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AspectRatio>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Renderizar layout grid normal
  const renderGridLayout = () => (
    <div 
      className={`grid gap-4 ${
        columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
        columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      } ${className}`}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="group relative aspect-video bg-zinc-800 rounded-lg overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => openLightbox(index)}
        >
          {item.type === 'video' ? (
            <>
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-12 h-12 text-white/80" />
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                  VIDEO
                </div>
              </div>
            </>
          ) : (
            <>
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}
          
          {showTitles && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-medium line-clamp-1">
                {item.title}
              </p>
              {item.description && (
                <p className="text-white/80 text-xs line-clamp-1">
                  {item.description}
                </p>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <>
      {/* Gallery - Layout condicional */}
      {layout === "featured" ? renderFeaturedLayout() : renderGridLayout()}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {items.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToPrev();
                  }}
                >
                  <CaretLeft className="w-6 h-6" />
                </button>

                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToNext();
                  }}
                >
                  <CaretRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Content */}
            <motion.div
              className="max-w-7xl max-h-[90vh] w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {currentItem?.type === 'video' ? (
                <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <video
                    src={currentItem.src}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay={isVideoPlaying}
                    playsInline
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onLoadedData={() => {
                      // Se deve reproduzir automaticamente, forçar play quando carregar
                      if (isVideoPlaying) {
                        const video = document.querySelector('video');
                        video?.play().catch(console.log); // Catch para browsers que bloqueiam autoplay
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={currentItem?.src}
                    alt={currentItem?.title}
                    className="w-full h-full object-contain max-h-[80vh] rounded-lg"
                  />
                </div>
              )}

              {/* Item Info */}
              {(currentItem?.title || currentItem?.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  {currentItem.title && (
                    <h3 className="text-white text-xl font-bold mb-1">
                      {currentItem.title}
                    </h3>
                  )}
                  {currentItem.description && (
                    <p className="text-white/80 text-sm">
                      {currentItem.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Indicators */}
            {items.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === selectedIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                      // Auto-reproduzir se o item selecionado for vídeo
                      const selectedItem = items[index];
                      setIsVideoPlaying(selectedItem?.type === 'video');
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjetistaGalleryWithLightbox;
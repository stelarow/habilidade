import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretLeft, CaretRight, PlayCircle, Pause } from '@phosphor-icons/react';

const ProjetistaGalleryWithLightbox = ({ 
  items, 
  columns = 4, 
  className = "",
  showTitles = true 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsVideoPlaying(false);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsVideoPlaying(false);
  };

  const navigateToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % items.length);
    setIsVideoPlaying(false);
  };

  const navigateToPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsVideoPlaying(false);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const currentItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <>
      {/* Gallery Grid */}
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
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
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
                      setIsVideoPlaying(false);
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
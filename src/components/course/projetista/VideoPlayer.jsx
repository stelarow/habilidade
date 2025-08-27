import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Pause, SpeakerSlash, SpeakerHigh } from '@phosphor-icons/react';

const VideoPlayer = ({ 
  src, 
  poster = null, 
  title = "", 
  autoPlay = false, 
  muted = false, 
  controls = true,
  className = "",
  aspectRatio = "aspect-video"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    togglePlay();
  };

  return (
    <div 
      className={`relative ${aspectRatio} bg-zinc-800 rounded-lg overflow-hidden group cursor-pointer ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        muted={isMuted}
        autoPlay={autoPlay}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedData={() => {
          if (autoPlay && videoRef.current) {
            videoRef.current.play();
          }
        }}
      >
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {/* Overlay with play/pause button */}
      <motion.div
        className="absolute inset-0 bg-black/40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: (!isPlaying || showControls) ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <PlayCircle className="w-8 h-8" />
          )}
        </motion.button>
      </motion.div>

      {/* Controls overlay */}
      {controls && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showControls ? 1 : 0,
            y: showControls ? 0 : 20 
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            {/* Title */}
            {title && (
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium line-clamp-1">
                  {title}
                </h4>
              </div>
            )}

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              >
                {isMuted ? (
                  <SpeakerSlash className="w-4 h-4" />
                ) : (
                  <SpeakerHigh className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Video type indicator */}
      <div className="absolute top-2 right-2">
        <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          VIDEO
        </div>
      </div>

      {/* Loading state */}
      {!isPlaying && !poster && (
        <div className="absolute inset-0 bg-zinc-700 animate-pulse flex items-center justify-center">
          <div className="text-zinc-400 text-sm">Carregando...</div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
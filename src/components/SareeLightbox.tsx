import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  images: string[];
  open: boolean;
  startIndex?: number;
  onClose: () => void;
  alt?: string;
};

const SareeLightbox = ({ images, open, startIndex = 0, onClose, alt = "Saree close-up" }: Props) => {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (open) {
      setIndex(startIndex);
      setZoomed(false);
    }
  }, [open, startIndex]);

  const next = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, next, prev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
    setZoomed((z) => !z);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (zoomed || images.length < 2) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (zoomed || !touchStartRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    // Only treat as horizontal swipe if dominantly horizontal
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragX(dx);
    }
  };

  const onTouchEnd = () => {
    if (zoomed || !touchStartRef.current) {
      setDragX(0);
      touchStartRef.current = null;
      return;
    }
    const elapsed = Date.now() - touchStartRef.current.time;
    const threshold = 60;
    const isFlick = elapsed < 300 && Math.abs(dragX) > 30;
    if (dragX <= -threshold || (isFlick && dragX < 0)) {
      next();
    } else if (dragX >= threshold || (isFlick && dragX > 0)) {
      prev();
    }
    setDragX(0);
    touchStartRef.current = null;
  };

  return (
    <AnimatePresence>
      {open && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Saree gallery"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gold-deep/15">
            <div className="text-xs uppercase tracking-[0.35em] text-gold-deep">
              {index + 1} / {images.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="p-2 hover:text-gold transition-colors"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:text-gold transition-colors"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image stage */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden touch-pan-y"
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 md:left-6 z-10 p-3 bg-background/60 hover:bg-background border border-gold-deep/20 hover:border-gold transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={images[index]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full h-full flex items-center justify-center px-4 md:px-20 py-6 ${
                  zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={toggleZoom}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={images[index]}
                  alt={`${alt} — view ${index + 1}`}
                  draggable={false}
                  className="max-w-full max-h-full object-contain select-none transition-transform duration-300 ease-out"
                  style={{
                    transform: zoomed
                      ? "scale(2.4)"
                      : `translateX(${dragX}px) scale(1)`,
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                    transition: dragX !== 0 ? "none" : undefined,
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <button
                type="button"
                onClick={next}
                className="absolute right-3 md:right-6 z-10 p-3 bg-background/60 hover:bg-background border border-gold-deep/20 hover:border-gold transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="border-t border-gold-deep/15 px-4 md:px-10 py-4 overflow-x-auto">
              <div className="flex gap-2 justify-center min-w-min">
                {images.map((url, i) => (
                  <button
                    key={url + i}
                    type="button"
                    onClick={() => {
                      setZoomed(false);
                      setIndex(i);
                    }}
                    className={`shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-all ${
                      i === index ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Jump to image ${i + 1}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SareeLightbox;

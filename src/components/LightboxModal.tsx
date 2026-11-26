import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Product, formatVND } from '../data/products';

interface LightboxModalProps {
  products: Product[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onQuickOrder: (product: Product) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  products,
  currentIndex,
  onClose,
  onNavigate,
  onQuickOrder,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, originX: 0, originY: 0 });
  const stageRef = useRef<HTMLDivElement | null>(null);

  const isOpen = currentIndex !== null && products[currentIndex] !== undefined;
  const product = isOpen ? products[currentIndex] : null;

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetView();
  }, [currentIndex, resetView]);

  const clampZoom = (next: number) => Math.min(4, Math.max(1, Number(next.toFixed(2))));

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => clampZoom(prev + 0.45));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = clampZoom(prev - 0.45);
      if (next <= 1) {
        setOffset({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handleDoubleClick = () => {
    if (zoom > 1.05) {
      resetView();
    } else {
      setZoom(2.25);
      setOffset({ x: 0, y: 0 });
    }
  };

  const handlePrev = useCallback(() => {
    if (currentIndex === null || products.length === 0) return;
    const prevIdx = (currentIndex - 1 + products.length) % products.length;
    onNavigate(prevIdx);
  }, [currentIndex, products.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null || products.length === 0) return;
    const nextIdx = (currentIndex + 1) % products.length;
    onNavigate(nextIdx);
  }, [currentIndex, products.length, onNavigate]);

  // Native non-passive wheel listener for smooth zoom without background scroll
  useEffect(() => {
    if (!isOpen) return;
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      setZoom((prev) => {
        const next = clampZoom(prev + delta);
        if (next <= 1) {
          setOffset({ x: 0, y: 0 });
        }
        return next;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === '+' || e.key === '=') handleZoomIn();
      else if (e.key === '-') handleZoomOut();
      else if (e.key === '0') resetView();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, handleZoomIn, handleZoomOut, resetView]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxPan = 220 * zoom;
    setOffset({
      x: Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.originX + dx)),
      y: Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.originY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer already released
      }
    }
  };

  if (!isOpen || !product || currentIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#1A0E09]/95 backdrop-blur-md text-[#FFFDF9]"
      role="dialog"
      aria-modal="true"
      aria-label={`Xem chi tiết ảnh ${product.name}`}
    >
      {/* Top Toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-white/10 bg-[#1A0E09]/80 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold tracking-wider text-[#D4AF37] tabular-nums whitespace-nowrap">
            {currentIndex + 1} / {products.length}
          </span>
          <span className="text-white/30" aria-hidden="true">·</span>
          <span className="text-xs sm:text-sm text-white/80 truncate">{product.code}</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Thu nhỏ (-)"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="min-w-[3.2rem] text-center text-xs font-medium tabular-nums text-white/90">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 4}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Phóng to (+)"
            aria-label="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetView}
            disabled={zoom === 1 && offset.x === 0 && offset.y === 0}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            title="Khôi phục kích thước gốc (0)"
            aria-label="Khôi phục kích thước gốc"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/15 mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-[#B91C1C] transition-colors"
            title="Đóng (Esc)"
            aria-label="Đóng trình xem ảnh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={stageRef}
        className={`relative flex-1 flex items-center justify-center overflow-hidden select-none touch-none ${
          zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Previous Button */}
        {products.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white transition-colors"
            aria-label="Ảnh sản phẩm trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Zoomable & Pannable Image */}
        <div
          className="flex items-center justify-center max-w-full max-h-full p-4 sm:p-8"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            draggable={false}
            referrerPolicy="no-referrer"
            className="max-h-[66vh] sm:max-h-[72vh] w-auto max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Button */}
        {products.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-white transition-colors"
            aria-label="Ảnh sản phẩm tiếp theo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Subtle Zoom Hint when at 1x */}
        {zoom === 1 && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/55 border border-white/10 text-[11px] text-white/80 whitespace-nowrap">
            Bấm đúp hoặc lăn chuột để phóng to soi nét chữ socola
          </div>
        )}
      </div>

      {/* Bottom Product & Zalo CTA Bar */}
      <div className="border-t border-white/10 bg-[#1A0E09]/95 px-4 sm:px-8 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <span className="font-semibold">{product.code}</span>
              <span aria-hidden="true">·</span>
              <span className="text-white/70 truncate">{product.category}</span>
            </div>
            <h3 className="font-serif text-base sm:text-xl font-semibold text-[#FFFDF9] truncate mt-0.5">
              {product.name}
            </h3>
            <p className="text-base sm:text-lg font-bold text-[#F87171] tabular-nums mt-0.5">
              {formatVND(product.price)}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onQuickOrder(product);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chốt mẫu này qua Zalo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

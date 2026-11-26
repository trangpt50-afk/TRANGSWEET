import React, { useEffect } from 'react';
import { Check, Expand, Gift, MessageCircle, X } from 'lucide-react';
import { Product, formatVND } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onZoomImage: (product: Product) => void;
  onQuickOrder: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onZoomImage,
  onQuickOrder,
}) => {
  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#2C1810]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết ${product.name}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FFFDF9] border border-[#2C1810]/12 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FFFDF9]/90 hover:bg-[#F3EAE0] text-[#2C1810] border border-[#2C1810]/10 transition-colors"
          aria-label="Đóng chi tiết sản phẩm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Image Column — Clicking opens Lightbox Zoom */}
        <div className="md:w-1/2 bg-[#F9F4EC] relative flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => onZoomImage(product)}
            className="group relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white focus-visible:outline-2 focus-visible:outline-[#2E6B1E]"
            title="Bấm để phóng to xem chi tiết ảnh"
          >
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C1810]/80 text-[#FFFDF9] text-xs font-medium backdrop-blur-xs">
              <Expand className="w-3.5 h-3.5" />
              <span>Phóng to ảnh</span>
            </span>
          </button>
        </div>

        {/* Right Details Column */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5246]">
              <span className="font-semibold text-[#2E6B1E]">{product.code}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              {product.tag && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#B91C1C] font-medium">{product.tag}</span>
                </>
              )}
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C1810] mt-2 leading-snug text-balance">
              {product.name}
            </h2>

            <p className="text-2xl font-bold text-[#B91C1C] tabular-nums mt-3">
              {formatVND(product.price)}
            </p>

            <div className="mt-4 pt-4 border-t border-[#2C1810]/10 space-y-2.5 text-sm text-[#6E5246]">
              {product.pieces && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#6E5246]">Quy cách:</span>
                  <span className="font-medium text-[#2C1810] text-right">{product.pieces}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-[#6E5246]">Phù hợp dịp:</span>
                <span className="font-medium text-[#2C1810] text-right">{product.occasion}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#6E5246]">Xếp chữ riêng:</span>
                <span className="font-medium text-[#2E6B1E] text-right">
                  {product.supportsCustomText ? 'Nhận xếp chữ theo yêu cầu' : 'Mẫu thiết kế cố định'}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#2C1810]/85">
              {product.description}
            </p>

            <div className="mt-5 p-3.5 rounded-xl bg-[#F9F4EC] border border-[#D4AF37]/30 space-y-1.5 text-xs text-[#2C1810]">
              <div className="flex items-center gap-2 font-medium">
                <Gift className="w-3.5 h-3.5 text-[#2E6B1E] shrink-0" />
                <span>Tặng kèm túi giấy Trangsweet & Thiệp thiết kế</span>
              </div>
              <div className="flex items-center gap-2 text-[#6E5246]">
                <Check className="w-3.5 h-3.5 text-[#2E6B1E] shrink-0" />
                <span>Socola làm mới mỗi ngày, giao nhanh tận nơi</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onQuickOrder(product);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Đặt mẫu này</span>
            </button>
            <button
              type="button"
              onClick={() => onZoomImage(product)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#2C1810]/20 hover:bg-[#F9F4EC] text-[#2C1810] text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Expand className="w-4 h-4" />
              <span>Soi ảnh lớn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

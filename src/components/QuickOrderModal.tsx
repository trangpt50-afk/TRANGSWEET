import React, { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle, Phone, X } from 'lucide-react';
import {
  Product,
  TEL_LINK,
  ZALO_DISPLAY,
  ZALO_LINK,
  formatVND,
} from '../data/products';

interface QuickOrderModalProps {
  product: Product | null;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

const SUGGESTED_TEXTS = [
  'ANH YÊU EM',
  'I LOVE YOU',
  'HAPPY BIRTHDAY',
  'CHÚC MỪNG 8/3',
  'MÃI BÊN NHAU',
];

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  product,
  onClose,
  onShowToast,
}) => {
  const [customText, setCustomText] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setCustomText(product.defaultCustomText || '');
      setNote('');
      setCopied(false);
    }
  }, [product]);

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

  const buildOrderMessage = () => {
    const lines = [
      `[Trangsweet Chocolate] Đặt mẫu: ${product.code} - ${product.name}`,
      `Giá niêm yết: ${formatVND(product.price)}`,
    ];
    if (customText.trim()) {
      lines.push(
        product.supportsCustomText
          ? `Chữ muốn xếp lên Socola: "${customText.trim()}"`
          : `Lời chúc ghi thiệp: "${customText.trim()}"`
      );
    }
    if (note.trim()) {
      lines.push(`Ghi chú thêm: ${note.trim()}`);
    }
    return lines.join('\n');
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fall through to textarea fallback
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  const handleCopyOnly = async () => {
    const msg = buildOrderMessage();
    const ok = await copyToClipboard(msg);
    setCopied(true);
    onShowToast(
      ok
        ? 'Đã sao chép thông tin mẫu & chữ xếp socola!'
        : 'Vui lòng copy nội dung đơn hàng để gửi qua Zalo.'
    );
    setTimeout(() => setCopied(false), 2500);
  };

  const handleZaloCheckout = async () => {
    const msg = buildOrderMessage();
    await copyToClipboard(msg);
    setCopied(true);
    onShowToast(
      `Đã tự động sao chép thông tin mẫu ${product.code}! Hãy dán (Paste) vào Zalo ${ZALO_DISPLAY}.`
    );
    window.open(ZALO_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C1810]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Đặt hàng nhanh Trangsweet"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF9] border border-[#2C1810]/15 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C1810]/10 bg-[#F9F4EC]">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#2C1810]">
              Đặt hàng nhanh Trangsweet
            </h2>
            <p className="text-xs text-[#6E5246] mt-0.5">
              Tặng kèm túi giấy thương hiệu & thiệp thiết kế miễn phí
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#2C1810]/10 text-[#2C1810] transition-colors"
            aria-label="Đóng bảng đặt hàng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Selected Product Summary */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#F9F4EC] border border-[#2C1810]/10">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-16 h-20 object-cover rounded-lg shrink-0 bg-white"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#2E6B1E]">{product.code}</div>
              <div className="text-sm font-semibold text-[#2C1810] line-clamp-2 mt-0.5">
                {product.name}
              </div>
              <div className="text-base font-bold text-[#B91C1C] tabular-nums mt-1">
                {formatVND(product.price)}
              </div>
            </div>
          </div>

          {/* Custom Chocolate Lettering Input */}
          <div>
            <label
              htmlFor="custom-chocolate-text"
              className="block text-sm font-semibold text-[#2C1810] mb-1.5"
            >
              {product.supportsCustomText
                ? 'Nội dung chữ muốn xếp lên Socola'
                : 'Nội dung ghi thiệp thiết kế (mẫu này tạo hình cố định)'}
            </label>
            <input
              id="custom-chocolate-text"
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={
                product.supportsCustomText
                  ? 'VD: ANH YÊU EM, HAPPY BIRTHDAY, TÊN NGƯỜI NHẬN...'
                  : 'VD: Chúc mừng ngày 8/3, Mãi bên nhau...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1810]/20 text-sm text-[#2C1810] placeholder:text-[#6E5246]/60 focus:outline-none focus:border-[#2E6B1E] focus:ring-2 focus:ring-[#2E6B1E]/15"
            />
            {product.supportsCustomText && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_TEXTS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setCustomText(suggestion)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F9F4EC] hover:bg-[#2E6B1E]/10 text-[#2C1810] border border-[#2C1810]/10 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label htmlFor="order-note" className="block text-sm font-semibold text-[#2C1810] mb-1.5">
              Thời gian nhận hàng / Ghi chú thêm (không bắt buộc)
            </label>
            <input
              id="order-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Giao chiều 14/02, ghi thiệp tên người nhận..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1810]/20 text-sm text-[#2C1810] placeholder:text-[#6E5246]/60 focus:outline-none focus:border-[#2E6B1E] focus:ring-2 focus:ring-[#2E6B1E]/15"
            />
          </div>

          {/* Preview of Auto-copied Info */}
          <div className="p-3.5 rounded-xl bg-[#F9F4EC]/70 border border-[#D4AF37]/35">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-[#6E5246]">
                Nội dung tự động sao chép gửi Zalo:
              </span>
              <button
                type="button"
                onClick={handleCopyOnly}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E6B1E] hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã copy' : 'Copy nhanh'}</span>
              </button>
            </div>
            <pre className="text-xs text-[#2C1810] whitespace-pre-wrap font-sans leading-relaxed">
              {buildOrderMessage()}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleZaloCheckout}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chốt đơn qua Zalo ({ZALO_DISPLAY})</span>
            </button>

            <a
              href={TEL_LINK}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#2C1810]/20 hover:bg-[#F9F4EC] text-[#2C1810] text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-[#2E6B1E]" />
              <span>Gọi trực tiếp Hotline: {ZALO_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

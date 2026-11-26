import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  MessageCircle,
  PenTool,
  Phone,
  Search,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import { TrangsweetLogo } from './components/Logo';
import { LightboxModal } from './components/LightboxModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { QuickOrderModal } from './components/QuickOrderModal';
import {
  CATEGORIES,
  PRICE_RANGES,
  PriceFilterValue,
  Product,
  ProductCategory,
  TEL_LINK,
  ZALO_DISPLAY,
  ZALO_LINK,
  formatVND,
  products,
} from './data/products';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceFilterValue>('all');
  const [pageSize, setPageSize] = useState<12 | 16>(16);
  const [currentPage, setCurrentPage] = useState(1);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fabExpanded, setFabExpanded] = useState(false);

  const catalogRef = useRef<HTMLElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Category counts for filter tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered product list
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      let matchesPrice = true;
      if (selectedPrice === 'under-300') matchesPrice = item.price < 300000;
      else if (selectedPrice === '300-500')
        matchesPrice = item.price >= 300000 && item.price <= 500000;
      else if (selectedPrice === 'over-500') matchesPrice = item.price > 500000;

      const matchesQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.occasion.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchesCategory && matchesPrice && matchesQuery;
    });
  }, [searchQuery, selectedCategory, selectedPrice]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPrice, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openLightboxForProduct = (product: Product) => {
    const idx = filteredProducts.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      setLightboxIndex(idx);
    } else {
      const fallbackIdx = products.findIndex((p) => p.id === product.id);
      if (fallbackIdx >= 0) {
        setSelectedCategory('all');
        setSelectedPrice('all');
        setSearchQuery('');
        setLightboxIndex(fallbackIdx);
      }
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPrice('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedPrice !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2C1810]">
      {/* Sticky Header — Single-row, 3-zone boutique navigation */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#2C1810]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: TS Logo + Brand Wordmark */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-[#2E6B1E] rounded-lg"
          >
            <TrangsweetLogo size="sm" />
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2C1810] group-hover:text-[#2E6B1E] transition-colors">
              Trangsweet
            </span>
          </a>

          {/* Zone 2: Concise Single-Line Nav Links */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#6E5246]"
          >
            <a
              href="#catalog"
              className="hover:text-[#2C1810] transition-colors whitespace-nowrap shrink-0"
            >
              Bộ sưu tập
            </a>
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Hộp Trái Tim Xếp Chữ')}
              className="hover:text-[#2C1810] transition-colors whitespace-nowrap shrink-0"
            >
              Hộp Trái Tim
            </a>
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Bó Hoa Socola')}
              className="hover:text-[#2C1810] transition-colors whitespace-nowrap shrink-0"
            >
              Bó Hoa Socola
            </a>
            <a
              href="#cam-ket"
              className="hover:text-[#2C1810] transition-colors whitespace-nowrap shrink-0"
            >
              Cam kết
            </a>
          </nav>

          {/* Zone 3: Direct Zalo & Call Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#2E6B1E] hover:bg-[#245417] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Zalo: {ZALO_DISPLAY}</span>
            </a>
            <a
              href={TEL_LINK}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#B91C1C]/30 bg-[#B91C1C]/5 hover:bg-[#B91C1C] hover:text-white text-[#B91C1C] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi ngay</span>
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Banner — Editorial Luxury Boutique Showcase */}
        <section className="border-b border-[#2C1810]/10 bg-gradient-to-b from-[#FFFDF9] to-[#F9F4EC]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Brand Story Column */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-5">
                  <TrangsweetLogo size="lg" />
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-[#2E6B1E]">
                      Trangsweet Chocolate
                    </p>
                    <p className="text-sm text-[#6E5246] mt-0.5">
                      Quà tặng Socola nghệ thuật & Hoa socola thiết kế
                    </p>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1810] leading-[1.15] tracking-tight text-balance">
                  Gói trọn ngọt ngào, chạm khẽ trái tim người thương
                </h1>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#6E5246] max-w-xl">
                  Tuyển chọn 50+ mẫu quà tặng Socola thủ công và hoa thiết kế tinh xảo cho các dịp{' '}
                  <span className="text-[#2C1810] font-medium">
                    Valentine · 8/3 · Sinh nhật · Kỷ niệm · Quà tặng Sếp &amp; Đối tác
                  </span>
                  . Mỗi hộp quà đều được xếp chữ theo yêu cầu, kèm túi giấy Trangsweet và thiệp thiết kế riêng.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#catalog"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
                  >
                    <span>Xem 50 mẫu quà tặng</span>
                  </a>
                  <a
                    href={ZALO_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#2C1810]/20 bg-white hover:bg-[#F9F4EC] text-[#2C1810] text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#2E6B1E]" />
                    <span>Tư vấn xếp chữ riêng</span>
                  </a>
                </div>

                {/* Unboxed occasion & service metadata */}
                <div className="mt-8 pt-6 border-t border-[#2C1810]/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#6E5246]">
                  <span>50 mẫu thiết kế sẵn</span>
                  <span aria-hidden="true">·</span>
                  <span>Tặng túi giấy &amp; thiệp</span>
                  <span aria-hidden="true">·</span>
                  <span>Bấm vào ảnh để phóng to chi tiết</span>
                </div>
              </div>

              {/* Right Featured Showcase Photography */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4 items-stretch">
                <button
                  type="button"
                  onClick={() => openLightboxForProduct(products[0])}
                  className="group relative aspect-[4/5] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden bg-[#F9F4EC] border border-[#2C1810]/10 text-left focus-visible:outline-2 focus-visible:outline-[#2E6B1E]"
                >
                  <img
                    src={products[0].image}
                    alt={products[0].name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A0E09]/85 via-[#1A0E09]/35 to-transparent p-4">
                    <span className="text-[11px] font-medium text-[#D4AF37]">
                      {products[0].code} · Hộp Trái Tim
                    </span>
                    <p className="text-sm font-semibold text-white line-clamp-1 mt-0.5">
                      {products[0].name}
                    </p>
                    <p className="text-sm font-bold text-[#FCA5A5] tabular-nums mt-0.5">
                      {formatVND(products[0].price)}
                    </p>
                  </div>
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1A0E09]/55 text-white backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </button>

                <div className="grid grid-rows-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => openLightboxForProduct(products[15])}
                    className="group relative rounded-2xl overflow-hidden bg-[#F9F4EC] border border-[#2C1810]/10 text-left focus-visible:outline-2 focus-visible:outline-[#2E6B1E]"
                  >
                    <img
                      src={products[15].image}
                      alt={products[15].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A0E09]/85 via-[#1A0E09]/35 to-transparent p-3.5">
                      <span className="text-[11px] font-medium text-[#D4AF37]">
                        {products[15].code} · Combo Cao Cấp
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                        Combo Bó Hoa &amp; Hộp Tim Hồng
                      </p>
                    </div>
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1A0E09]/55 text-white backdrop-blur-xs">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openLightboxForProduct(products[29])}
                    className="group relative rounded-2xl overflow-hidden bg-[#F9F4EC] border border-[#2C1810]/10 text-left focus-visible:outline-2 focus-visible:outline-[#2E6B1E]"
                  >
                    <img
                      src={products[29].image}
                      alt={products[29].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A0E09]/85 via-[#1A0E09]/35 to-transparent p-3.5">
                      <span className="text-[11px] font-medium text-[#D4AF37]">
                        {products[29].code} · Hộp 2 Cánh LED
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                        Hộp 2 Cánh Đen &amp; Hoa Hồng LED
                      </p>
                    </div>
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1A0E09]/55 text-white backdrop-blur-xs">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section: Smart Search, Filters, Grid & Pagination */}
        <section id="catalog" ref={catalogRef} className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title + Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#2C1810]/10">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  Bộ Sưu Tập Quà Tặng Trangsweet
                </h2>
                <p className="text-sm text-[#6E5246] mt-1">
                  Đang hiển thị{' '}
                  <span className="font-semibold text-[#2C1810] tabular-nums">
                    {filteredProducts.length}
                  </span>{' '}
                  mẫu sản phẩm · Bấm trực tiếp vào ảnh để phóng to soi chi tiết
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-80 lg:w-96 shrink-0">
                <Search className="w-4 h-4 text-[#6E5246] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm mã SP hoặc từ khóa (TS01, trái tim, gấu, 8/3...)"
                  aria-label="Tìm kiếm sản phẩm theo tên hoặc mã sản phẩm"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#2C1810]/15 text-sm text-[#2C1810] placeholder:text-[#6E5246]/65 focus:outline-none focus:border-[#2E6B1E] focus:ring-2 focus:ring-[#2E6B1E]/15"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#6E5246] hover:text-[#2C1810]"
                    aria-label="Xóa từ khóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="py-5 space-y-4">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lọc theo danh mục">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.value;
                  const count = categoryCounts[cat.value] ?? 0;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                        isActive
                          ? 'bg-[#2C1810] text-[#FFFDF9] shadow-xs'
                          : 'bg-[#F9F4EC] text-[#2C1810] hover:bg-[#EFE6D8] border border-[#2C1810]/10'
                      }`}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Price Filter & Page Size Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lọc theo mức giá">
                  <span className="text-xs font-medium text-[#6E5246] mr-1">Mức giá:</span>
                  {PRICE_RANGES.map((range) => {
                    const isActive = selectedPrice === range.value;
                    return (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => setSelectedPrice(range.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-[#B91C1C] text-white'
                            : 'bg-white text-[#6E5246] hover:text-[#2C1810] border border-[#2C1810]/12'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-semibold text-[#2E6B1E] hover:underline ml-1 whitespace-nowrap"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                {/* Items per page selector */}
                <div className="flex items-center gap-2 text-xs text-[#6E5246]">
                  <span>Hiển thị:</span>
                  <button
                    type="button"
                    onClick={() => setPageSize(12)}
                    className={`px-2.5 py-1 rounded-md font-medium tabular-nums transition-colors ${
                      pageSize === 12
                        ? 'bg-[#2C1810] text-white'
                        : 'bg-[#F9F4EC] text-[#2C1810] hover:bg-[#EFE6D8]'
                    }`}
                  >
                    12 / trang
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageSize(16)}
                    className={`px-2.5 py-1 rounded-md font-medium tabular-nums transition-colors ${
                      pageSize === 16
                        ? 'bg-[#2C1810] text-white'
                        : 'bg-[#F9F4EC] text-[#2C1810] hover:bg-[#EFE6D8]'
                    }`}
                  >
                    16 / trang
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid (2 cols mobile, 3 cols tablet, 4 cols PC) */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group flex flex-col bg-white border border-[#2C1810]/10 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[#D4AF37]/50"
                  >
                    {/* 4:5 Image Container — Click directly opens Interactive Lightbox Zoom */}
                    <div className="relative aspect-[4/5] bg-[#F9F4EC] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => openLightboxForProduct(product)}
                        className="w-full h-full block text-left focus-visible:outline-2 focus-visible:outline-[#2E6B1E]"
                        aria-label={`Phóng to ảnh ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        {/* Magnifier affordance icon */}
                        <span
                          className="absolute bottom-2.5 right-2.5 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2C1810]/70 text-[#FFFDF9] backdrop-blur-xs shadow-sm transition-transform duration-200 group-hover:scale-105"
                          title="Bấm để phóng to"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </span>
                      </button>
                    </div>

                    {/* Card Body — Identical vertical alignment */}
                    <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 gap-3">
                      <div>
                        {/* Unboxed metadata line */}
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6E5246] truncate">
                          <span className="font-semibold text-[#2E6B1E] shrink-0">
                            {product.code}
                          </span>
                          {product.tag && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#B91C1C] font-medium truncate">
                                {product.tag}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Product Name — Click opens Product Detail Modal */}
                        <button
                          type="button"
                          onClick={() => setDetailProduct(product)}
                          className="mt-1.5 text-left w-full group/title focus-visible:outline-2 focus-visible:outline-[#2E6B1E] rounded"
                        >
                          <h3 className="font-serif text-sm sm:text-[15px] font-semibold text-[#2C1810] leading-snug line-clamp-2 group-hover/title:text-[#B91C1C] transition-colors">
                            {product.name}
                          </h3>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-[#2C1810]/8 flex flex-col gap-2.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-base sm:text-lg font-bold text-[#B91C1C] tabular-nums">
                            {formatVND(product.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setDetailProduct(product)}
                            className="text-[11px] sm:text-xs font-medium text-[#6E5246] hover:text-[#2C1810] underline underline-offset-2 whitespace-nowrap"
                          >
                            Chi tiết
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOrderProduct(product)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#B91C1C] text-[#FFFDF9] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                        >
                          <span>Đặt mẫu này</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="py-16 px-4 text-center rounded-2xl bg-[#F9F4EC] border border-[#2C1810]/10">
                <p className="font-serif text-xl font-semibold text-[#2C1810]">
                  Không tìm thấy mẫu phù hợp
                </p>
                <p className="text-sm text-[#6E5246] mt-1.5 max-w-md mx-auto">
                  Thử tìm lại với từ khóa ngắn hơn (như TS01, trái tim, gấu, bó hoa) hoặc đặt làm mẫu chữ riêng qua Zalo {ZALO_DISPLAY}.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#2C1810] text-white text-sm font-semibold hover:bg-[#422519] transition-colors"
                  >
                    Xem tất cả 50 mẫu
                  </button>
                  <a
                    href={ZALO_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl border border-[#2E6B1E] text-[#2E6B1E] text-sm font-semibold hover:bg-[#2E6B1E]/5 transition-colors"
                  >
                    Nhắn Zalo tư vấn mẫu riêng
                  </a>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Phân trang sản phẩm"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(safePage - 1)}
                  disabled={safePage === 1}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#2C1810]/15 bg-white text-[#2C1810] hover:bg-[#F9F4EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[2.5rem] h-10 px-3 rounded-xl text-sm font-semibold tabular-nums transition-colors ${
                      page === safePage
                        ? 'bg-[#B91C1C] text-white shadow-xs'
                        : 'border border-[#2C1810]/15 bg-white text-[#2C1810] hover:bg-[#F9F4EC]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#2C1810]/15 bg-white text-[#2C1810] hover:bg-[#F9F4EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Trang tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        </section>

        {/* Trangsweet Craftsmanship & Guarantee Section */}
        <section
          id="cam-ket"
          className="py-12 sm:py-16 border-t border-[#2C1810]/10 bg-[#F9F4EC]/75"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                Đặc quyền khi đặt quà tại Trangsweet
              </h2>
              <p className="text-sm sm:text-base text-[#6E5246] mt-2">
                Mỗi hộp quà rời xưởng đều được kiểm tra tỉ mỉ từ nét chữ socola đến bao bì đóng gói sang trọng.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#2C1810]/10">
                <div className="w-10 h-10 rounded-xl bg-[#2E6B1E]/10 text-[#2E6B1E] flex items-center justify-center mb-4">
                  <PenTool className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#2C1810]">
                  Nhận xếp chữ theo yêu cầu
                </h3>
                <p className="text-sm text-[#6E5246] mt-2 leading-relaxed">
                  Tùy chỉnh thông điệp tình yêu, tên người nhận, ngày kỷ niệm hoặc lời chúc Sếp &amp; Đối tác ngay trên từng viên socola.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#2C1810]/10">
                <div className="w-10 h-10 rounded-xl bg-[#B91C1C]/10 text-[#B91C1C] flex items-center justify-center mb-4">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#2C1810]">
                  Tặng túi giấy &amp; thiệp thiết kế
                </h3>
                <p className="text-sm text-[#6E5246] mt-2 leading-relaxed">
                  Mọi đơn hàng đều đi kèm túi giấy Trangsweet quai lụa cứng cáp và thiệp thiết kế đồng bộ, sẵn sàng trao tặng ngay.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#2C1810]/10">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#8A6D14] flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#2C1810]">
                  Làm mới mỗi ngày · Giao nhanh
                </h3>
                <p className="text-sm text-[#6E5246] mt-2 leading-relaxed">
                  Socola nguyên chất ít ngọt, tạo hình thủ công tinh xảo và hỗ trợ giao hỏa tốc đúng giờ hẹn của bạn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C1810] text-[#FFFDF9] border-t border-[#D4AF37]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <TrangsweetLogo size="md" />
                <div>
                  <div className="font-serif text-xl font-bold text-[#FFFDF9]">
                    Trangsweet Chocolate
                  </div>
                  <div className="text-xs text-[#D4AF37]">
                    Quà tặng Socola nghệ thuật &amp; Hoa socola thiết kế
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#FFFDF9]/75 leading-relaxed max-w-md pt-1">
                Tặng kèm túi giấy Trangsweet + Thiệp thiết kế + Nhận xếp chữ Socola theo yêu cầu cho mọi dịp Valentine, 8/3, Sinh nhật, Kỷ niệm và Quà tặng doanh nghiệp.
              </p>
            </div>

            <div className="md:col-span-4 space-y-2.5 text-sm">
              <div className="font-semibold text-[#D4AF37]">Liên hệ đặt hàng &amp; tư vấn</div>
              <div className="flex items-center gap-2 text-[#FFFDF9]/90">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={TEL_LINK} className="hover:underline tabular-nums">
                  Hotline: {ZALO_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#FFFDF9]/90">
                <MessageCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={ZALO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline tabular-nums"
                >
                  Zalo chốt đơn: {ZALO_DISPLAY}
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-sm">
              <div className="font-semibold text-[#D4AF37]">Cam kết dịch vụ</div>
              <ul className="space-y-1.5 text-[#FFFDF9]/80 text-xs sm:text-sm">
                <li>Tặng kèm túi giấy Trangsweet</li>
                <li>Tặng thiệp thiết kế theo dịp</li>
                <li>Nhận xếp chữ theo yêu cầu</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFFDF9]/60">
            <p>© {new Date().getFullYear()} Trangsweet Chocolate. Bảo lưu mọi quyền.</p>
            <p>Hotline &amp; Zalo: {ZALO_DISPLAY}</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Bottom-Right): Zalo & Hotline 0969.304.324 */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-2">
        {fabExpanded && (
          <div className="w-64 p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#2C1810]/15 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#2C1810]">
                Tư vấn &amp; Chốt đơn nhanh
              </span>
              <button
                type="button"
                onClick={() => setFabExpanded(false)}
                className="p-1 rounded-md text-[#6E5246] hover:text-[#2C1810]"
                aria-label="Thu gọn hộp liên hệ"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <a
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#2E6B1E] hover:bg-[#245417] text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Zalo: {ZALO_DISPLAY}</span>
            </a>
            <a
              href={TEL_LINK}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Hotline: {ZALO_DISPLAY}</span>
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFabExpanded((prev) => !prev)}
            className="group relative inline-flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-lg border border-white/20 transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-[#2E6B1E]"
            aria-label={`Tư vấn Zalo và Hotline ${ZALO_DISPLAY}`}
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#2E6B1E] shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
              <MessageCircle className="relative w-4 h-4" />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[10px] uppercase tracking-wider text-white/85">
                Zalo / Hotline
              </span>
              <span className="block text-xs sm:text-sm font-bold tabular-nums">
                {ZALO_DISPLAY}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] px-4 py-3 rounded-xl bg-[#2C1810] text-[#FFFDF9] border border-[#D4AF37]/40 shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2E6B1E] text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <span className="flex-1">{toastMessage}</span>
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
        </div>
      )}

      {/* Interactive Image Lightbox & Zoom Modal */}
      <LightboxModal
        products={filteredProducts}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
        onQuickOrder={(prod) => setOrderProduct(prod)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onZoomImage={(prod) => {
          setDetailProduct(null);
          openLightboxForProduct(prod);
        }}
        onQuickOrder={(prod) => setOrderProduct(prod)}
      />

      {/* Quick Order Modal */}
      <QuickOrderModal
        product={orderProduct}
        onClose={() => setOrderProduct(null)}
        onShowToast={showToast}
      />
    </div>
  );
}

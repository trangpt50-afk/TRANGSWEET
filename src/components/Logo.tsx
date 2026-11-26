import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/* ============================================================================
 * HƯỚNG DẪN CHỦ SHOP THAY LOGO RIÊNG:
 * Mặc định website sử dụng Logo chữ lồng "TS" vẽ bằng SVG sắc nét (#2E6B1E).
 * Nếu bạn muốn dùng file ảnh logo có sẵn (ví dụ: LOGO_TRANGSWEET.png), hãy:
 * 1. Đặt file ảnh vào thư mục /public/LOGO_TRANGSWEET.png
 * 2. Bỏ comment thẻ <img> bên dưới và ẩn thẻ <svg> đi.
 * ============================================================================ */
export const TrangsweetLogo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-20 h-20',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-[#FFFDF9] border border-[#2E6B1E]/25 shadow-sm overflow-hidden shrink-0 ${dimensions} ${className}`}
      aria-label="Logo Trangsweet Chocolate"
    >
      {/* NẾU MUỐN THAY BẰNG ẢNH PNG LOGO CỦA BẠN, BỎ COMMENT DÒNG DƯỚI ĐÂY:
      <img
        src="/LOGO_TRANGSWEET.png"
        alt="Trangsweet Chocolate Logo"
        className="w-full h-full object-contain p-1"
      />
      */}

      {/* Logo SVG chữ lồng TS màu xanh lá #2E6B1E trên nền trắng/kem */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="TS Monogram"
      >
        <circle cx="50" cy="50" r="46" stroke="#2E6B1E" strokeWidth="1.5" strokeOpacity="0.3" />
        <circle cx="50" cy="50" r="42" stroke="#D4AF37" strokeWidth="0.9" strokeOpacity="0.6" />
        {/* Lá cacao / điểm nhấn thủ công tinh tế phía trên */}
        <path
          d="M50 13C53 16.5 54 20.5 50 23.5C46 20.5 47 16.5 50 13Z"
          fill="#2E6B1E"
          fillOpacity="0.85"
        />
        {/* Chữ T cách điệu */}
        <path
          d="M25 32H61M43 32V71C43 74.5 40.5 76.5 37.5 76.5"
          stroke="#2E6B1E"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Chữ S lồng ghép uyển chuyển */}
        <path
          d="M72 41.5C72 35.8 66.5 32 59.5 32C52.5 32 47.5 36.2 47.5 41.5C47.5 47.2 53 49.5 60 51.8C67.5 54.2 73 57 73 63.5C73 69.8 67 74.5 59 74.5C51.5 74.5 46 70.5 45 65"
          stroke="#2E6B1E"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

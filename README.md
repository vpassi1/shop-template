# Shop Template - Next.js

Template Next.js cho website gian hàng premium trên nền tảng Chợ MMO.

## Tính năng

- ✅ **Responsive Design** - Tối ưu cho mọi thiết bị
- ✅ **SEO Optimized** - Metadata động, sitemap
- ✅ **Fast Loading** - Next.js App Router, Image Optimization
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Styling hiện đại
- ✅ **API Integration** - Kết nối với backend PHP

## Environment Variables

Tạo file `.env.local` với các biến sau:

```dotenv
NEXT_PUBLIC_SHOP_ID=123
NEXT_PUBLIC_SHOP_NAME="Tên Gian Hàng"
NEXT_PUBLIC_API_URL=https://chommo.store/api
NEXT_PUBLIC_MAIN_SITE=https://chommo.store
SHOP_SECRET=your_shop_secret_key
```

## Cài đặt

```shell
# Clone template
git clone https://github.com/YOUR_USERNAME/shop-template.git
cd shop-template

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## Deployment trên Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Cấu hình Environment Variables
4. Deploy

## Cấu trúc thư mục

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Layout chính
│   ├── page.tsx        # Trang chủ
│   └── products/       # Trang sản phẩm
├── components/         # React Components
│   ├── Header.tsx      # Header
│   ├── Footer.tsx      # Footer
│   └── ProductCard.tsx # Card sản phẩm
├── lib/               # Utilities
│   └── api.ts         # API functions
└── types/             # TypeScript types
    └── shop.ts        # Shop interfaces
```

## API Endpoints

Template sử dụng các API endpoints sau:

- `GET /api/shop/info.php?shop_id={id}` - Thông tin gian hàng
- `GET /api/shop/products.php?shop_id={id}` - Danh sách sản phẩm

## Customization

### Thay đổi màu sắc

Chỉnh sửa file `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Thêm tính năng

1. Tạo component mới trong `src/components/`
2. Thêm route mới trong `src/app/`
3. Cập nhật API functions trong `src/lib/api.ts`

## Performance

- **Lighthouse Score**: 95+
- **Core Web Vitals**: Passed
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic với App Router

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.
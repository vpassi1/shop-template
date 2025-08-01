import { getShopInfo, getShopProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ReloadButton from '@/components/ReloadButton';
import type { Shop, Product } from '@/types/shop';

export default async function HomePage() {
  try {
    const [shop, products] = await Promise.all([
      getShopInfo(),
      getShopProducts(1, 12)
    ]);

    return (
      <div className="container py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {shop.banner && (
              <div className="absolute inset-0">
                <img 
                  src={shop.banner} 
                  alt={shop.name}
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
            )}
            <div className="relative px-8 py-16 text-center">
              <h1 className="text-4xl font-bold mb-4">{shop.name}</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                {shop.description}
              </p>
              <div className="mt-6 flex justify-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  ⭐ {shop.rating}/5 ({shop.total_reviews} đánh giá)
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📦 {shop.total_products} sản phẩm
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  ✅ {shop.total_orders} đơn hàng
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <a 
              href="/products" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả →
            </a>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Chưa có sản phẩm
              </h3>
              <p className="text-gray-600">
                Gian hàng đang cập nhật sản phẩm mới
              </p>
            </div>
          )}
        </section>

        {/* Shop Info */}
        <section className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Về gian hàng</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Chủ gian hàng:</strong> {shop.owner.full_name}</p>
                <p><strong>Email:</strong> {shop.owner.email}</p>
                {shop.owner.phone && (
                  <p><strong>Điện thoại:</strong> {shop.owner.phone}</p>
                )}
                <p><strong>Tham gia:</strong> {new Date(shop.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Danh mục sản phẩm</h3>
              <div className="flex flex-wrap gap-2">
                {shop.categories.map((category) => (
                  <span 
                    key={category.id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="container py-16 text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Không thể tải thông tin gian hàng
        </h1>
        <p className="text-gray-600 mb-6">
          Vui lòng thử lại sau hoặc liên hệ quản trị viên
        </p>
        <ReloadButton className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Thử lại
        </ReloadButton>
      </div>
    );
  }
}
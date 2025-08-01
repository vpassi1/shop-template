import { getShopProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ReloadButton from '@/components/ReloadButton';
import type { Product } from '@/types/shop';

export default async function ProductsPage() {
  try {
    const products = await getShopProducts(1, 24);

    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tất cả sản phẩm</h1>
          <p className="text-gray-600">
            Khám phá toàn bộ sản phẩm và dịch vụ chất lượng cao
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có sản phẩm
            </h2>
            <p className="text-gray-600">
              Gian hàng đang cập nhật sản phẩm mới
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container py-16 text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Không thể tải danh sách sản phẩm
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
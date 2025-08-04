import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getShopInfo } from '@/lib/api';
import type { Shop } from '@/types/shop';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const shop = await getShopInfo();
    
    return {
      title: shop.name,
      description: shop.description,
      keywords: `${shop.name}, mmo, game, dịch vụ, ${shop.categories.map(c => c.name).join(', ')}`,
      authors: [{ name: shop.owner.full_name }],
      openGraph: {
        title: shop.name,
        description: shop.description,
        images: shop.banner ? [shop.banner] : undefined,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: shop.name,
        description: shop.description,
        images: shop.banner ? [shop.banner] : undefined,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Gian Hàng Premium',
      description: 'Gian hàng chuyên nghiệp trên nền tảng Chợ MMO',
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
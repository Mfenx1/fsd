import type { ProductSSR } from './fetchProducts';
import { fetchProductsForSSR } from './fetchProducts';
import { ProductsPageContent } from './ProductsPageContent';
import { createPageMetadata } from '../../_config';
import { WebPageJsonLd } from '$widgets';
import { getAppBaseUrl, SITE_NAME } from '$shared';

const PRODUCTS_TITLE = 'Товары';
const PRODUCTS_DESCRIPTION = 'Каталог товаров с сортировкой, поиском и редактированием. Company.';

export const metadata = createPageMetadata({
  title: PRODUCTS_TITLE,
  description: PRODUCTS_DESCRIPTION,
  path: '/products',
});

const BreadcrumbListJsonLd = () => {
  const base = getAppBaseUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: base },
      { '@type': 'ListItem', position: 2, name: PRODUCTS_TITLE, item: `${base}/products` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      suppressHydrationWarning
    />
  );
};

const ProductsItemListJsonLd = ({ products }: { products: ProductSSR[] }) => {
  const base = getAppBaseUrl();
  const itemListElement = products.slice(0, 30).map((p, i) => {
    const productUrl = `${base}/products#${p.id}`;
    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: productUrl,
    };
    if (p.stock != null && p.stock <= 0) {
      offer.availability = 'https://schema.org/OutOfStock';
    }
    const product: Record<string, unknown> = {
      '@type': 'Product',
      '@id': productUrl,
      name: p.title,
      brand: { '@type': 'Brand', name: p.brand },
      offers: offer,
    };
    if (p.thumbnail) {
      product.image = p.thumbnail;
    }
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: product,
    };
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${PRODUCTS_TITLE} — ${SITE_NAME}`,
    description: PRODUCTS_DESCRIPTION,
    numberOfItems: products.length,
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      suppressHydrationWarning
    />
  );
};

const DEFAULT_LIMIT = 50;

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; order?: 'asc' | 'desc'; skip?: string }>;
}) => {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const sortBy = params.sort || 'title';
  const order = (params.order === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';
  const skip = Math.max(0, parseInt(params.skip ?? '0', 10) || 0);

  const initialData = await fetchProductsForSSR({ q, sortBy, order, skip, limit: DEFAULT_LIMIT });

  if (!initialData) {
    return (
      <div className="flex flex-col h-full min-h-0 py-6 px-6">
        <p className="text-zinc-500 dark:text-zinc-400">Не удалось загрузить товары</p>
      </div>
    );
  }

  return (
    <>
      <WebPageJsonLd
        name={PRODUCTS_TITLE}
        description={PRODUCTS_DESCRIPTION}
        path="/products"
      />
      <BreadcrumbListJsonLd />
      <ProductsItemListJsonLd products={initialData.products} />
      <ProductsPageContent
        initialData={initialData}
        searchParams={{ q, sortBy, order, skip, limit: DEFAULT_LIMIT }}
      />
    </>
  );
};

export default ProductsPage;
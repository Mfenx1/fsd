import { ProductsHeader, ProductsMainContent, ProductsToast } from './components';

export const Products = () => (
  <div className="flex flex-col h-full min-h-0 py-6 bg-gray-100">
    <ProductsHeader />
    <main className="
      flex-1 min-h-0 mt-4 flex flex-col p-4 px-5 bg-white rounded-xl
      overflow-hidden
    ">
      <ProductsMainContent />
    </main>
    <ProductsToast />
  </div>
);

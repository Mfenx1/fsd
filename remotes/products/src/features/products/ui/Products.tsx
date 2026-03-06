import { ProductsHeader } from './ProductsHeader';
import { ProductsMainContent } from './ProductsMainContent';
import { ProductsToast } from './ProductsToast';


export const REMOTE_PRODUCTS_ROOT_CLASS = 'remote-products';

export const Products = ({ embedded }: { embedded?: boolean }) => (
  <div
    className={`${REMOTE_PRODUCTS_ROOT_CLASS} flex flex-col h-full min-h-0 ${embedded ? '' : 'py-6 px-6'}`}
  >
    <ProductsHeader />
    <main className="
      flex-1 min-h-0 mt-5 flex flex-col p-5 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700
      overflow-hidden shadow-sm
    ">
      <ProductsMainContent />
    </main>
    <ProductsToast />
  </div>
);
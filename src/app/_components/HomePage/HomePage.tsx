import { HomeClient } from '../HomeClient';
import { WebPageJsonLd } from '$widgets';

export const PAGE_TITLE = 'Товары';
const PAGE_DESCRIPTION =
  'Список товаров с сортировкой, поиском и редактированием. Company.';

export const HomePage = () => (
  <>
    <WebPageJsonLd name={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/" />
    <HomeClient />
  </>
);

export { PAGE_DESCRIPTION };
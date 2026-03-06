import { redirect } from 'next/navigation';
import { ROUTES } from '$shared';

const ShellHomePage = () => {
  redirect(ROUTES.PRODUCTS);
};

export default ShellHomePage;
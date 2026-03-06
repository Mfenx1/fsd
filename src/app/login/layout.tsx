import type { Metadata } from 'next';
import { createPageMetadata } from '../_config';
import { WebPageJsonLd } from '$widgets';


export const dynamic = 'force-static';

const LOGIN_DESCRIPTION = 'Вход в систему управления товарами Company.';
const LOGIN_DESCRIPTION_SHORT = 'Вход в систему управления товарами.';

export const metadata: Metadata = createPageMetadata({
  title: 'Вход',
  description: LOGIN_DESCRIPTION,
  path: '/login',
  robots: { index: false, follow: true },
});

const LoginLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <WebPageJsonLd
      name="Вход"
      description={LOGIN_DESCRIPTION_SHORT}
      path="/login"
    />
    {children}
  </>
);

export default LoginLayout;
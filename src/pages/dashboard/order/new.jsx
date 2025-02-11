import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OrderCreateView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderCreateView />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductOptionsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Bulk Meal Addition | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductOptionsView />
    </>
  );
}

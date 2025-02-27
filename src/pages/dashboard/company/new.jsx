import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompanyCreateView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CompanyCreateView />
    </>
  );
}

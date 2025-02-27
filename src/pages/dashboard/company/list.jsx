import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompanyListView } from 'src/sections/company/view';

// ----------------------------------------------------------------------

const metadata = { title: `Company list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CompanyListView />
    </>
  );
}

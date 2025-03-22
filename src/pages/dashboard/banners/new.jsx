import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AppCreateView } from 'src/sections/banners/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new app banner | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AppCreateView />
    </>
  );
}
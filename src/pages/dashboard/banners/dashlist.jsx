import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DashBannerListView } from 'src/sections/banners/view';

// ----------------------------------------------------------------------

const metadata = { title: `App Banner list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashBannerListView />
    </>
  );
}
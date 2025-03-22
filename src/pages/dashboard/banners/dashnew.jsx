import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DashCreateView } from 'src/sections/banners/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new dashboard banner | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashCreateView />
    </>
  );
}
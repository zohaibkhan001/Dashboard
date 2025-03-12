import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { QuickEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create New Upgraded Meal | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <QuickEditView />
    </>
  );
}

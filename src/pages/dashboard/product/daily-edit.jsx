import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DailyEditView, ProductDailyCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Edit Daily Meal | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DailyEditView />
    </>
  );
}

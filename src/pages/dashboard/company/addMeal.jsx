import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CompanyAddMealView } from 'src/sections/company/view';
// ----------------------------------------------------------------------

const metadata = { title: `Company Add Meal | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CompanyAddMealView />
    </>
  );
}

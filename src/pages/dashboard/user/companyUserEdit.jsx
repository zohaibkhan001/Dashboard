import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserCompannyEditView } from 'src/sections/user/view';
// ----------------------------------------------------------------------

const metadata = { title: `Edit user | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserCompannyEditView />
    </>
  );
}

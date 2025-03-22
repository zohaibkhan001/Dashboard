import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashEditForm } from '../dash-edit-form';

// ----------------------------------------------------------------------

export function DashEditView({ user: currentUser }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Dashboard Banner Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Dashboard Banners', href: paths.dashboard.banners.dashlist },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DashEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}


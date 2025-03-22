import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AppEditForm } from '../app-edit-form';

// ----------------------------------------------------------------------

export function AppEditView({ user: currentUser }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="App Banner Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'App Banners', href: paths.dashboard.banners.list },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AppEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}


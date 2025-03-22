import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AppNewBannerForm } from '../app-new-banner-form';

// ----------------------------------------------------------------------

export function AppCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New App Banner"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'App Banners', href: paths.dashboard.banners.list },
          { name: 'New App Banner' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AppNewBannerForm />
    </DashboardContent>
  );
}
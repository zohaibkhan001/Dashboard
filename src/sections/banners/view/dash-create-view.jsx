import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashNewBannerForm } from '../dash-new-banner-form';

// ----------------------------------------------------------------------

export function DashCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Dashboard Banner"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Dashboard Banners', href: paths.dashboard.banners.dashlist },
          { name: 'New Dashboard Banner' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DashNewBannerForm />
    </DashboardContent>
  );
}


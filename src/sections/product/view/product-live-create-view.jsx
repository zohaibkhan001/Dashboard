import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductLiveEditForm } from '../product-live-edit-form';

// ----------------------------------------------------------------------

export function ProductLiveCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Live Counter"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: 'New Live Counter' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductLiveEditForm />
    </DashboardContent>
  );
}

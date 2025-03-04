import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductDailyEditForm } from '../product-daily-edit-form';

// ----------------------------------------------------------------------

export function ProductDailyCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Daily Meal"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: 'New Daily Meal' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductDailyEditForm />
    </DashboardContent>
  );
}

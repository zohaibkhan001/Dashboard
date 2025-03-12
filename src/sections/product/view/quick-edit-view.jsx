import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuickEditForm } from '../quick-edit-only-form';

// ----------------------------------------------------------------------

export function QuickEditView({ product }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Upgraded Meal"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QuickEditForm currentProduct={product} />
    </DashboardContent>
  );
}

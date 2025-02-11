import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GuestNewEditForm } from '../product-guest-edit-form';

// ----------------------------------------------------------------------

export function GuestCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new Guest Meal"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: 'New Guest Meal' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <GuestNewEditForm />
    </DashboardContent>
  );
}

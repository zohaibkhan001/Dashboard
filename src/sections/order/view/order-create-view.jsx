import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OrderNewEditForm } from '../order-new-edit-form';

// ----------------------------------------------------------------------

export function OrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new company"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Company', href: paths.dashboard.order.root },
          { name: 'New Company' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OrderNewEditForm />
    </DashboardContent>
  );
}

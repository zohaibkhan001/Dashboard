import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserDetails } from '../user-details-view';

// ----------------------------------------------------------------------

export function UserDetailsVew({ user: currentUser, transactions, orders }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: 'Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UserDetails transactions={transactions} orders={orders} />
    </DashboardContent>
  );
}

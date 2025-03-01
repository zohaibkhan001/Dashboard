import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { UserNewEditForm } from '../user-new-edit-form';

import { UserCompanyNewEditForm } from '../company-user-new-edit-form';

// ----------------------------------------------------------------------

export function UserCompannyCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new user"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: 'New user' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UserCompanyNewEditForm />
    </DashboardContent>
  );
}

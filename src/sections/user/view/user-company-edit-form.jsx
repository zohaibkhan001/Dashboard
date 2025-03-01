import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { UserNewEditForm } from '../user-new-edit-form';

import { UserCompanyEditForm } from '../company-user-edit-form';
// ----------------------------------------------------------------------

export function UserCompannyEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Userr"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: 'Edit user' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UserCompanyEditForm />
    </DashboardContent>
  );
}

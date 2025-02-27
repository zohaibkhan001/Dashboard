import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CompanyNewEditForm } from '../company-new-edit-form';

// ----------------------------------------------------------------------

export function CompanyCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new company"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Company', href: paths.dashboard.company.root },
          { name: 'New Company' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CompanyNewEditForm />
    </DashboardContent>
  );
}

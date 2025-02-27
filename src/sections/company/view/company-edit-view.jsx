import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CompanyNewEditForm } from '../company-new-edit-form'

// ----------------------------------------------------------------------

export function CompanyEditView({ product }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Company', href: paths.dashboard.company.root },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CompanyNewEditForm currentProduct={product} />
    </DashboardContent>
  );
}

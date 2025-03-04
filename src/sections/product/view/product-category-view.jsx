import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductCategoryEditForm } from '../product-category-edit-form';

// ----------------------------------------------------------------------

export function ProductCategoryView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Categories"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: 'Categories' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductCategoryEditForm />
    </DashboardContent>
  );
}

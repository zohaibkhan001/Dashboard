import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { Button, Stack } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';

// ----------------------------------------------------------------------

export function ProductCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Upgraded Meal"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: 'New Upgraded Meal' },
        ]}
        // action={
        //   <Stack direction="row" spacing={2}>
        //     <Button
        //       variant="contained"
        //       startIcon={<Iconify icon="mingcute:add-line" />}
        //       component={RouterLink}
        //       to={`${paths.dashboard.product.options}/1/quick`} // Correct syntax
        //       sx={{ marginRight: '10em' }}
        //     >
        //       Options
        //     </Button>
        //   </Stack>
        // }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm />
    </DashboardContent>
  );
}

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Button, Stack } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';

import { ProductDailyEditForm } from '../product-daily-edit-form';
import { DailyEditForm } from '../daily-edit-only-form';

// ----------------------------------------------------------------------

export function DailyEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Daily Meal"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: 'New Daily Meal' },
        ]}
        // action={
        //   <Stack direction="row" spacing={2}>
        //     <Button
        //       variant="contained"
        //       startIcon={<Iconify icon="mingcute:add-line" />}
        //       component={RouterLink}
        //       to={`${paths.dashboard.product.options}/1/repeating`} // Correct syntax
        //       sx={{ marginRight: '10em' }}
        //     >
        //       Options
        //     </Button>
        //   </Stack>
        // }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DailyEditForm />
    </DashboardContent>
  );
}

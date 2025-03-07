import { useState } from 'react';
import { LocalizationProvider, DatePicker, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';
import { _companiesData, _locationData, _mealTimeData } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { ProductOptions } from '../product-options';

// ----------------------------------------------------------------------

export function ProductOptionsView() {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Additional Options"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.product.root },
          { name: 'Options' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={5} direction="column">
        <Grid container spacing={3}>
          <Grid xs={12} md={5} lg={5}>
            <ProductOptions title="Company" list={_companiesData} />
          </Grid>
          <Grid xs={12} md={7} lg={7}>
            <ProductOptions title="Locations" list={_locationData} />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid xs={12} md={5} lg={5}>
            <ProductOptions title="Meal Time" list={_mealTimeData} />
          </Grid>
          <Grid xs={12} md={7} lg={7}>
          <Card sx={{ p: 1.75, bgcolor: '#FFFFFF', borderRadius: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={(newValue) => newValue && setSelectedDate(newValue)}
                />
              </LocalizationProvider>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="typcn:tick" />}
            sx={{ width: '8em', marginRight: '2em' }}
          >
            Save
          </Button>
        </Box>

      </Grid>

    </DashboardContent>
  );
}

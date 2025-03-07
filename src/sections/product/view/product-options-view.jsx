import { useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';

import { ProductOptions } from '../product-options';

export function ProductOptionsView() {
  // Fetch companies and locations from Redux
  const { companies } = useSelector((state) => state.allCompanies);
  const { locations } = useSelector((state) => state.allLocations);

  // console.log(companies);
  // console.log(locations);

  // Track selected companies and locations
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);

  // Handle company selection
  const handleCompanySelection = (updatedCompanies) => {
    setSelectedCompanies(updatedCompanies);

    // Remove selected locations that are no longer associated with selected companies
    const updatedLocations = selectedLocations.filter((locationId) =>
      locations.some(
        (location) =>
          location.location_id === locationId && updatedCompanies.includes(location.company_id)
      )
    );

    setSelectedLocations(updatedLocations);
  };

  // Filter locations based on selected companies
  const filteredLocations = locations.filter((location) =>
    selectedCompanies.includes(location.company_id)
  );

  // Handle location selection
  const handleLocationSelection = (updatedLocations) => {
    setSelectedLocations(updatedLocations);
  };

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
        {/* Company Selection */}
        <Grid container spacing={3}>
          <Grid xs={12} md={5} lg={5}>
            <ProductOptions
              title="Company"
              list={companies.map((company) => ({
                id: company.company_id,
                name: company.companyName,
              }))}
              selected={selectedCompanies}
              onSelectionChange={handleCompanySelection}
            />
          </Grid>

          {/* Location Selection (Filtered) */}
          <Grid xs={12} md={7} lg={7}>
            <ProductOptions
              title="Locations"
              list={filteredLocations.map((location) => ({
                id: location.location_id,
                name: `${location.company?.companyName || 'Unknown'} - ${location.locationName}`,
              }))}
              selected={selectedLocations}
              onSelectionChange={handleLocationSelection}
            />
          </Grid>
        </Grid>

        {/* Meal Time Section */}
        <Grid container spacing={3}>
          <Grid xs={12} md={5} lg={5}>
            <ProductOptions
              title="Meal Time"
              list={[
                { id: 'breakfast', name: 'Breakfast' },
                { id: 'lunch', name: 'Lunch' },
                { id: 'snacks', name: 'Snacks' },
                { id: 'dinner', name: 'Dinner' },
                { id: 'midnight_snacks', name: 'Midnight Snacks' },
              ]}
              selected={selectedMealTimes}
              onSelectionChange={setSelectedMealTimes}
            />
          </Grid>
          <Grid xs={12} md={7} lg={7}>
            <Card sx={{ p: 0, bgcolor: '#FFFFFF', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ marginBottom: '-0.9em', ml: 4, mt: 2 }}>
                Date
              </Typography>
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

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="typcn:tick" />}
            sx={{ width: '8em', marginRight: '2em' }}
            onClick={() => {
              console.log('Selected Companies:', selectedCompanies);
              console.log('Selected Locations:', selectedLocations);
              console.log('Selected Meal Times:', selectedMealTimes);
              console.log('Selected Date:', selectedDate.format('YYYY-MM-DD'));
            }}
          >
            Save
          </Button>
        </Box>
      </Grid>
    </DashboardContent>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useParams } from 'react-router';

import { fetchCompanies } from 'src/utils/Redux/slices/companiesListSlice';
import { fetchAllLocations } from 'src/utils/Redux/slices/locationsSlice';
import { toast } from 'sonner';
import api from 'src/utils/api';
import { useRouter } from 'src/routes/hooks';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';

import { ProductOptions } from '../product-options';

export function ProductOptionsView() {
  const dispatch = useDispatch();
  const router = useRouter();
  // Fetch companies and locations from Redux
  const { companies } = useSelector((state) => state.allCompanies);
  const { locations } = useSelector((state) => state.allLocations);
  const { token } = useSelector((state) => state.superAdminAuth);

  const [allCompaniesSelected, setAllCompaniesSelected] = useState(false);
  const [allLocationsSelected, setAllLocationsSelected] = useState(false);

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(dayjs().week());
  const [loading, setLoading] = useState(false);

  // console.log(token);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchAllLocations());
  }, [dispatch]);

  const { meal_id, meal_type } = useParams();

  // console.log(meal_id); // Output: 1
  // console.log(meal_type); // Output: 'liveCounter'

  // console.log(companies);
  // console.log(locations);

  const toggleSelectAllCompanies = () => {
    if (allCompaniesSelected) {
      setSelectedCompanies([]);
      setSelectedLocations([]); // Also clear selected locations
      setAllLocationsSelected(false); // Reset "Select All" for locations
    } else {
      setSelectedCompanies(companies.map((company) => company.company_id));
      setAllLocationsSelected(false); // Do NOT select all locations automatically
    }
    setAllCompaniesSelected(!allCompaniesSelected);
  };

  const toggleSelectAllLocations = () => {
    const filteredLocations = locations.filter((location) =>
      selectedCompanies.includes(location.company_id)
    );

    if (allLocationsSelected) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations(filteredLocations.map((location) => location.location_id));
    }

    setAllLocationsSelected(!allLocationsSelected && filteredLocations.length > 0);
  };

  const handleCompanySelection = (updatedCompanies) => {
    setSelectedCompanies(updatedCompanies);

    const isAllCompaniesSelected = updatedCompanies.length === companies.length;
    setAllCompaniesSelected(isAllCompaniesSelected);

    const updatedLocations = selectedLocations.filter((locationId) =>
      locations.some(
        (location) =>
          location.location_id === locationId && updatedCompanies.includes(location.company_id)
      )
    );

    setSelectedLocations(updatedLocations);

    const filteredLocations = locations.filter((location) =>
      updatedCompanies.includes(location.company_id)
    );

    setAllLocationsSelected(
      updatedLocations.length === filteredLocations.length && filteredLocations.length > 0
    );
  };

  const handleWeekSelection = (weekNumber) => {
    setSelectedWeekNumber(weekNumber);
  };

  // Filter locations based on selected companies
  const filteredLocations = locations.filter((location) =>
    selectedCompanies.includes(location.company_id)
  );

  // Handle location selection
  const handleLocationSelection = (updatedLocations) => {
    setSelectedLocations(updatedLocations);
    setAllLocationsSelected(updatedLocations.length === filteredLocations.length);
  };

  const handleSaveClick = async () => {
    const payload = {
      location_id: selectedLocations, // Array of selected location IDs
      meal_id: Number(meal_id), // Convert meal_id to a number
      meal_type, // Directly use the meal type from params
      meal_time: selectedMealTimes,
      ...(meal_type === 'repeating'
        ? { week_number: selectedWeekNumber } // Use week_number for repeating meals
        : { specific_date: selectedDate.format('YYYY-MM-DD') }), // Use specific_date otherwise
    };

    console.log(payload);
    setLoading(true);

    try {
      const response = await api.post('/superAdmin/add_to_location_menu', payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });

      if (response.status === 200) {
        toast.success('Meal added to selected company locations!');
        // console.log('API Response:', response.data);

        setTimeout(() => {
          router.push(paths.dashboard.product.root);
        }, 2000);
      } else {
        toast.error('Failed to add meal');
        console.error('Error:', response.data);
      }
    } catch (error) {
      toast.error(error.msg);
      console.error(error.msg, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    router.push(paths.dashboard.product.root);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Add meal to companies in bulk"
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
            <Button variant="outlined" onClick={toggleSelectAllCompanies} sx={{ mb: 2 }}>
              {allCompaniesSelected ? 'Deselect All' : 'Select All'}
            </Button>
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
            <Button variant="outlined" onClick={toggleSelectAllLocations} sx={{ mb: 2 }}>
              {allLocationsSelected ? 'Deselect All' : 'Select All'}
            </Button>
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
              <Typography variant="h5" sx={{ marginBottom: '0.5em', ml: 4, mt: 2 }}>
                {meal_type === 'repeating' ? 'Select Week Number' : 'Date'}
              </Typography>

              {meal_type === 'repeating' ? (
                <Scrollbar sx={{ maxHeight: 310, overflowY: 'auto', p: 2 }}>
                  <Stack direction="column">
                    {[...Array(52)].map((_, index) => {
                      const weekNumber = index + 1;
                      const currentWeek = dayjs().week(); // Get the current week number

                      if (weekNumber < currentWeek) return null;

                      const weekStart = dayjs()
                        .week(weekNumber)
                        .startOf('week')
                        .add(1, 'day')
                        .format('MMM D');
                      const weekEnd = dayjs()
                        .week(weekNumber)
                        .endOf('week')
                        .add(1, 'day')
                        .format('MMM D');

                      return (
                        <Button
                          key={weekNumber}
                          variant={selectedWeekNumber === weekNumber ? 'contained' : 'outlined'}
                          onClick={() => handleWeekSelection(weekNumber)}
                          sx={{ mb: 1 }}
                        >
                          Week {weekNumber} ({weekStart} - {weekEnd})
                        </Button>
                      );
                    })}
                  </Stack>
                </Scrollbar>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={selectedDate}
                    onChange={(newValue) => newValue && setSelectedDate(newValue)}
                  />
                </LocalizationProvider>
              )}

              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={(newValue) => newValue && setSelectedDate(newValue)}
                />
              </LocalizationProvider> */}
            </Card>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1em' }}>
          <LoadingButton
            type="button"
            variant="contained"
            startIcon={<Iconify icon="typcn:tick" />}
            size="large"
            onClick={handleSaveClick}
            loading={loading}
          >
            Add Meal
          </LoadingButton>

          <Button
            variant="contained"
            // startIcon={<Iconify icon="typcn:cross" />}
            sx={{ width: '8em', marginRight: '2em', ml: '2em' }}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
        </Box>
      </Grid>
    </DashboardContent>
  );
}

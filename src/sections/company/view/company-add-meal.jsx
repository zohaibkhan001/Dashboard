import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchLiveCounterMeals } from 'src/utils/Redux/slices/liveCounterMeals';
import { fetchRepeatingMeals } from 'src/utils/Redux/slices/dailyMealsSlice';
import { fetchQuickMeals } from 'src/utils/Redux/slices/quickMealSlice';
import { useParams } from 'src/routes/hooks';
import { Box, Button, List, ListItem, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import dayjs from 'dayjs';
import { LocalizationProvider } from 'src/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers';
import api from 'src/utils/api';
import { LoadingButton } from '@mui/lab';
import { toast } from 'sonner';
// ----------------------------------------------------------------------

export function CompanyAddMealView() {
  const { company_id } = useParams();
  //   console.log(company_id);

  const dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState('quick');
  const { token } = useSelector((state) => state.superAdminAuth);
  const [selectedLocation, setSelectedLocation] = useState('');

  const [masterMenuAnchorEl, setMasterMenuAnchorEl] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);

  const [showDateSelector, setShowDateSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [masterMenuMeals, setMasterMenuMeals] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [fetchedMenu, setFetchedMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [addMealLoading, setAddMealLoading] = useState(false);

  const masterMenuOpen = Boolean(masterMenuAnchorEl);

  const { liveCounterMeals, loading: liveCounterLoading } = useSelector(
    (state) => state.liveCounterMeals
  );
  const { repeatingMeals, loading: repeatingMealsLoading } = useSelector(
    (state) => state.repeatingMeals
  );
  const { quickMeals, loading: quickMealsLoading } = useSelector((state) => state.quickMeals);

  const nndate = dayjs(selectedDate).format('YYYY-MM-DD');
  useEffect(() => {
    console.log(
      'Selected Menu:',
      selectedMenu,
      'Location:',
      selectedLocation,
      'date:',
      nndate,
      'weeknumber:',
      selectedWeekNumber,
      'selected Meal id:',
      selectedMeal,
      'selected meal name:',
      selectedMeals,
      'selected Meal times',
      selectedMealTimes
    );
  }, [
    selectedMealTimes,
    selectedMeal,
    selectedMeals,
    selectedMenu,
    selectedLocation,
    selectedDate,
    nndate,
    selectedWeekNumber,
  ]);

  useEffect(() => {
    if (selectedMenu === 'quick') {
      setMasterMenuMeals(quickMeals);
    } else if (selectedMenu === 'repeating') {
      setMasterMenuMeals(repeatingMeals);
    } else if (selectedMenu === 'liveCounter') {
      setMasterMenuMeals(liveCounterMeals);
    } else {
      setMasterMenuMeals([]); // Empty if no valid selection
    }

    setSelectedMeal(null);
    setSelectedMeals([]);
    setSelectedMealTimes([]);
    setSelectedLocation(null);
    setFetchedMenu([]); // ✅ Clears previous menu data when meal type changes
  }, [selectedMenu, quickMeals, repeatingMeals, liveCounterMeals]);

  useEffect(() => {
    if (selectedLocation) {
      api
        .get(`/superAdmin/get_locations/${selectedLocation}`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Adds token to request headers
          },
        })
        .then((response) => {
          if (response.data?.success === 1 && response.data?.data?.length > 0) {
            const locationInfo = response.data.data[0];

            let parsedMealTimes = [];
            try {
              parsedMealTimes = locationInfo.locationMealTime
                ? JSON.parse(locationInfo.locationMealTime)
                : [];
            } catch (error) {
              console.error('Error parsing locationMealTime:', error);
              parsedMealTimes = [];
            }

            setLocationData({ ...locationInfo, locationMealTime: parsedMealTimes });
          } else {
            setLocationData(null); // ✅ Fallback if no valid data
          }
        })
        .catch((error) => {
          console.error('Error fetching location data:', error);
          setLocationData(null); // ✅ Fallback in case of API error
        });
    } else {
      setLocationData(null); // ✅ Reset when no location is selected
    }
  }, [selectedLocation, token]);

  const handleMasterMenuClick = (event) => {
    setMasterMenuAnchorEl(event.currentTarget); // Opens dropdown
  };

  const handleMasterMenuClose = () => {
    setMasterMenuAnchorEl(null); // Closes dropdown
  };

  const handleMenuItemClick = (menuType) => {
    setSelectedMenu(menuType); // Stores clicked menu type
    setMasterMenuAnchorEl(null); // Closes dropdown after selection
  };

  const handleLocationMenuClick = (event) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const handleLocationMenuClose = () => {
    setLocationAnchorEl(null);
  };

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
    handleLocationMenuClose();
  };

  const { locations } = useSelector((state) => state.companyLocations);

  const MENU_LABELS = {
    quick: 'Upgraded Meal',
    repeating: 'Daily Meal',
    liveCounter: 'Live Counter',
  };

  useEffect(() => {
    dispatch(fetchLiveCounterMeals());
    dispatch(fetchRepeatingMeals());
    dispatch(fetchQuickMeals());
  }, [dispatch]);

  const addMealToLocationMenu = async () => {
    if (!selectedMeal) {
      toast.error('Error: No meal selected.');
      return;
    }

    if (!selectedLocation) {
      toast.error('Error: No location selected.');
      return;
    }

    if (!selectedMealTimes.length) {
      toast.error('Error: No meal times selected.');
      return;
    }

    const mealType = selectedMenu; // quick, repeating, or liveCounter

    const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
    if ((mealType === 'quick' || mealType === 'liveCounter') && !formattedDate) {
      toast.error('Error: No date selected.');
      return;
    }

    if (mealType === 'repeating' && !selectedWeekNumber) {
      toast.error('Error: No week number selected for repeating meal.');
      return;
    }

    // Prepare request body
    const requestBody = {
      location_id: [selectedLocation], // Wrap in an array as required
      meal_id: selectedMeal,
      meal_type: mealType,
      meal_time: selectedMealTimes, // Already stored in lowercase
    };

    // Add `specific_date` for quick & liveCounter meals
    if (mealType === 'quick' || mealType === 'liveCounter') {
      requestBody.specific_date = formattedDate;
    }

    // Add `week_number` for repeating meals
    if (mealType === 'repeating') {
      requestBody.week_number = selectedWeekNumber;
    }

    console.log(requestBody);

    // try {
    //   const response = await api.post('/superAdmin/add_to_location_menu', requestBody, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });

    //   console.log('Meal added successfully:', response.data);
    // } catch (error) {
    //   console.error('Error adding meal:', error.response?.data || error.message);
    // }
  };

  const fetchMenuForMealType = async () => {
    if (!selectedLocation) {
      toast.error('Error: No location selected.');
      return;
    }

    const mealType = selectedMenu;

    let apiUrl = `/superAdmin/get_menu_for_day?location_id=${selectedLocation}&meal_type=${mealType}`;

    if (mealType === 'quick' || mealType === 'liveCounter') {
      const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;
      if (!formattedDate) {
        toast.error('Error: No date selected.');
        return;
      }
      apiUrl += `&date=${formattedDate}`;
    }

    if (mealType === 'repeating') {
      if (!selectedWeekNumber) {
        toast.error('Error: No week number selected for repeating meal.');
        return;
      }
      apiUrl += `&week_number=${selectedWeekNumber}`;
    }

    console.log('Fetching menu from:', apiUrl);

    setMenuLoading(true);

    try {
      const response = await api.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.data?.success === 1) {
        const fetchedData = response.data.data || [];

        // 🟢 Group Meals by meal_time to organize them in columns
        const groupedMenu = fetchedData.reduce((acc, mealItem) => {
          const mealTimeKey = mealItem.meal_time?.toLowerCase();
          if (!mealTimeKey) return acc; // ✅ Skip meals without a valid meal_time

          // ✅ Determine the correct meal object (quickMeal, liveCounter, repeatingMeal)
          const mealDetails =
            mealItem.quickMeal || mealItem.liveCounter || mealItem.repeatingMeal || null;

          if (!mealDetails) return acc; // ✅ Skip if no valid meal details exist

          // ✅ Ensure array exists for the meal time
          if (!acc[mealTimeKey]) acc[mealTimeKey] = [];

          // ✅ Store the meal details
          acc[mealTimeKey].push({
            meal_id: mealDetails.meal_id,
            mealName: mealDetails.mealName || 'Unnamed Meal',
            description: mealDetails.description || 'No description available',
            price: mealDetails.price || mealDetails.repeatingMealDetails?.[0]?.price || 0, // ✅ Ensure price is available
          });

          return acc;
        }, {});

        setFetchedMenu(groupedMenu); // ✅ Stores meals grouped by meal_time

        toast.success('Menu fetched successfully.');
        console.log(fetchedMenu);
      } else if (response.data?.success === 0) {
        toast.error(response.data.msg);
      } else {
        setFetchedMenu([]); // Clear menu if response is not valid
        toast.error('Error fetching menu.');
      }
    } catch (error) {
      console.error('Error fetching menu:', error);

      if (error.response) {
        // ✅ Check if status is 404 (No meals found)
        if (error.response.status === 404) {
          toast.error('No meals found for the selected criteria.');
        } else {
          toast.error(error.response.data?.msg || 'An error occurred while fetching the menu.');
        }
      } else {
        toast.error(error.msg);
      }

      setFetchedMenu([]); // ✅ Reset menu on error
    } finally {
      setMenuLoading(false);
    }
  };

  const renderSelectors = (
    <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={2}>
      <Button
        variant="contained"
        startIcon={<Iconify icon="lets-icons:arrow-drop-down-big" />}
        onClick={handleMasterMenuClick} // Opens dropdown menu
      >
        Master Menu Meal Type - {MENU_LABELS[selectedMenu] || 'Select'}
      </Button>

      <Menu anchorEl={masterMenuAnchorEl} open={masterMenuOpen} onClose={handleMasterMenuClose}>
        <Box sx={{ width: '20vh' }}>
          <MenuItem onClick={() => handleMenuItemClick('quick')}>Upgraded Meal</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('repeating')}>Daily Meal</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('liveCounter')}>Live Counter</MenuItem>
        </Box>
      </Menu>

      {/* Location Selection Dropdown */}
      <Button
        variant="contained"
        startIcon={<Iconify icon="lets-icons:arrow-drop-down-big" />}
        onClick={handleLocationMenuClick}
        disabled={!locations || locations.length === 0} // ✅ Disable if empty
      >
        {locations && locations.length > 0
          ? `Select Location - ${
              selectedLocation
                ? locations.find((loc) => loc.location_id === selectedLocation)?.locationName
                : 'Choose'
            }`
          : 'No Locations Available'}{' '}
        {/* ✅ Show message if empty */}
      </Button>

      <Menu
        anchorEl={locationAnchorEl}
        open={Boolean(locationAnchorEl)}
        onClose={handleLocationMenuClose}
      >
        <Box sx={{ width: '20vh' }}>
          {locations.map((location) => (
            <MenuItem
              key={location.location_id}
              onClick={() => handleLocationSelect(location.location_id)}
            >
              {location.locationName}
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* Date or Week Selector */}
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Button variant="contained" onClick={() => setShowDateSelector(!showDateSelector)}>
          {selectedMenu === 'repeating' ? 'Select Week Number' : 'Select Date'}
        </Button>

        {showDateSelector && (
          <Box
            sx={{
              position: 'absolute',
              zIndex: 10,
              mt: 1,
              bgcolor: 'background.paper',
              boxShadow: 3,
              borderRadius: 1,
              p: 2,
              left: -130,
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: '0.5em', ml: 4, mt: 2 }}>
              {selectedMenu === 'repeating' ? 'Select Week Number' : 'Date'}
            </Typography>
            {selectedMenu === 'repeating' ? (
              <Scrollbar sx={{ maxHeight: 310, overflowY: 'auto', p: 2, width: '20vw' }}>
                <Stack direction="column">
                  {[...Array(52)].map((_, index) => {
                    const weekNumber = index + 1;
                    const currentWeek = dayjs().week();
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
                        onClick={() => {
                          setSelectedWeekNumber(weekNumber);
                          setShowDateSelector(false); // Close dropdown after selection
                        }}
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
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate(newValue); // Ensure it's a Dayjs object
                      setShowDateSelector(false);
                    }
                  }}
                  shouldDisableDate={(date) => dayjs(date).isBefore(dayjs(), 'day')} // Disable past dates
                />
              </LocalizationProvider>
            )}
          </Box>
        )}
      </Box>

      <LoadingButton
        type="button"
        variant="contained"
        onClick={fetchMenuForMealType}
        loading={menuLoading}
      >
        Fetch Menu
      </LoadingButton>
    </Stack>
  );

  const renderActions = (
    <Stack spacing={5} direction="row" justifyContent="flex-end" flexWrap="wrap">
      <LoadingButton
        type="button"
        variant="contained"
        size="large"
        onClick={addMealToLocationMenu}
        // loading={isSubmitting}
      >
        Add Meal
      </LoadingButton>
    </Stack>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add Meal"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Company', href: paths.dashboard.company.root },
          { name: 'meal' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {renderSelectors}
      <Box
        sx={{
          display: 'flex',
          height: '600px',
          //   border: '1px solid #ccc',
          borderRadius: 2,
          overflowX: 'auto', // ✅ Enables horizontal scrolling
          overflowY: 'hidden',
          mt: 4,
          whiteSpace: 'nowrap', // ✅ Prevents wrapping of columns
        }}
      >
        {/* Fixed Master Menu Column */}
        <Box
          sx={{
            width: '25vw',

            flexShrink: 0,
            // borderRight: '1px solid #ddd',
            backgroundColor: '#FFF5DF',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Master Menu
          </Typography>
          <Scrollbar sx={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
            {masterMenuMeals.length > 0 ? (
              masterMenuMeals.map((meal) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: selectedMeal === meal.meal_id ? '#F0F0F0' : '#FFFFFF', // ✅ Default white, clicked = light grey
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease-in-out',
                    '&:hover': { backgroundColor: '#F4F6F8' }, // ✅ Slightly darker grey when hovered
                    '&:active': { backgroundColor: '#F4F6F8' }, // ✅ Even darker grey when clicked
                  }}
                  onClick={() => {
                    setSelectedMeal(meal.meal_id); // ✅ Updates selectedMeal ID for API

                    setSelectedMeals([meal]); // ✅ Replaces the previously selected meal (only one meal is selected at a time)
                  }}
                >
                  {/* Meal Name & Price */}
                  {/* Meal Container */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    {/* First Line: Meal Name & Price */}
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                          flexGrow: 1,
                          whiteSpace: 'normal', // ✅ Allows text to wrap properly
                          wordBreak: 'break-word', // ✅ Ensures words wrap if they are too long
                          overflowWrap: 'break-word', // ✅ Alternative method for ensuring wrapping
                        }}
                      >
                        {meal.mealName || 'Unnamed Meal'}
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                          color: '#FF9800',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ₹ {meal.price || 0}
                      </Typography>
                    </Box>

                    {/* Second Line: Meal ID */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flexGrow: 1, // ✅ Ensures Meal ID stays on the second line
                        }}
                      >
                        Meal ID - {meal.meal_id}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="gray" textAlign="center">
                No data available
              </Typography>
            )}
          </Scrollbar>
        </Box>

        {/* Placeholder for other columns */}
        <Box sx={{ display: 'flex', flexGrow: 1, p: 2, gap: 2 }}>
          {locationData?.locationMealTime?.length > 0 ? (
            locationData.locationMealTime.map((mealTime) => (
              <Box
                key={mealTime}
                sx={{
                  width: '25vw',
                  flexShrink: 0,
                  height: '80vh',
                  //   borderLeft: '1px solid #ddd',
                  backgroundColor: '#F4F6F8',
                  borderRadius: '12px',
                  padding: '12px',
                  transition: 'background-color 0.3s ease-in-out',
                  //   '&:hover': { backgroundColor: '#EAEAEA' },
                  //   '&:active': { backgroundColor: '#EAEAEA' },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    textAlign: 'center',
                    paddingBottom: '8px',
                  }}
                >
                  {mealTime}
                </Typography>

                <Box sx={{ borderBottom: '1px solid #ddd', marginBottom: '12px' }} />

                <Box sx={{ paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                  <Typography
                    variant="h6"
                    fontWeight="medium"
                    sx={{ marginBottom: '8px', textAlign: 'center' }}
                  >
                    Selected Meal
                  </Typography>

                  {selectedMeal ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#Ffffff',
                        borderRadius: '8px',
                        padding: '8px',
                        marginBottom: '6px',
                        transition: 'all 0.3s',
                      }}
                    >
                      {/* Checkbox to select the meal for this meal time */}
                      <input
                        type="checkbox"
                        checked={selectedMealTimes.includes(mealTime.toLowerCase())} // ✅ Check using lowercase
                        onChange={(e) => {
                          setSelectedMealTimes((prev) => {
                            const lowerCaseMealTime = mealTime.toLowerCase(); // ✅ Convert to lowercase
                            if (e.target.checked) {
                              return [...prev, lowerCaseMealTime]; // ✅ Store in lowercase
                            }
                            return prev.filter((time) => time !== lowerCaseMealTime); // ✅ Remove in lowercase
                          });
                        }}
                        style={{
                          width: '20px', // ✅ Fixed checkbox width
                          height: '20px', // ✅ Fixed checkbox height
                          minWidth: '20px', // ✅ Prevents shrinking
                          minHeight: '20px', // ✅ Prevents shrinking
                          flexShrink: 0, // ✅ Ensures it doesn't resize
                          cursor: 'pointer',
                          accentColor: '#00A76F', // ✅ Keeps the selected background color
                        }}
                      />

                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                          m: 1,
                          flexGrow: 1,
                          whiteSpace: 'normal', // ✅ Allows text to wrap properly
                          wordBreak: 'break-word', // ✅ Ensures words wrap if they are too long
                          overflowWrap: 'break-word', // ✅ Alternative method for ensuring wrapping
                        }}
                      >
                        {' '}
                        {selectedMeals.find((meal) => meal.meal_id === selectedMeal)?.mealName ||
                          'Unnamed Meal'}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography color="gray" sx={{ textAlign: 'center' }}>
                      No items selected from master menu
                    </Typography>
                  )}
                </Box>

                {/* Lower Section: Menu Items */}
                <Box sx={{ marginTop: '12px' }}>
                  <Typography
                    variant="h6"
                    fontWeight="medium"
                    sx={{ marginBottom: '8px', textAlign: 'center' }}
                  >
                    Current Menu
                  </Typography>

                  {fetchedMenu[mealTime.toLowerCase()]?.length > 0 ? (
                    <List>
                      {fetchedMenu[mealTime.toLowerCase()].map((meal) => (
                        <Box
                          key={meal.meal_id}
                          sx={{
                            backgroundColor: '#FFFFFF', // ✅ White background like Master Menu
                            borderRadius: '12px',
                            padding: '12px',
                            marginBottom: '12px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // ✅ Subtle shadow for separation
                          }}
                        >
                          {/* Meal Name with Wrapping */}
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{
                              whiteSpace: 'normal', // ✅ Allows wrapping
                              wordBreak: 'break-word', // ✅ Ensures words wrap properly
                              overflowWrap: 'break-word', // ✅ Alternative for wrapping
                            }}
                          >
                            {meal.mealName}
                          </Typography>

                          {/* Meal ID in Next Line */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ marginTop: '4px' }}
                          >
                            Meal ID: {meal.meal_id}
                          </Typography>
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Typography color="gray" sx={{ textAlign: 'center' }}>
                      No items available
                    </Typography>
                  )}
                </Box>
              </Box>
            ))
          ) : (
            <Typography color="gray" sx={{ textAlign: 'center', width: '100%', mt: 2 }}>
              No meal times available for this location.
            </Typography>
          )}
        </Box>
      </Box>
      {renderActions}
    </DashboardContent>
  );
}

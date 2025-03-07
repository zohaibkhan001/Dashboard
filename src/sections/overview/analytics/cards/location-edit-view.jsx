import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'; // ✅ Import useSelector for Redux
import api from 'src/utils/api';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { toast } from 'sonner';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'src/routes/hooks';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import { form } from 'src/theme/core/components/form';

// ----------------------------------------------------------------------

export function LocationEditDialog({
  open,
  onClose,
  title = 'Edit Location',
  location_id,
  company_id,
}) {
  // ✅ Fetch token from Redux (superAdminAuth)
  const authToken = useSelector((state) => state.superAdminAuth.token);

  const router = useRouter();
  // console.log(company_id);

  // console.log('check current:', location_id);

  const [formData, setFormData] = useState({
    locationName: '',
    locationMealTime: [], // New state (Array)
    email: '',
    locationCutoffTime: '',
    locationOpeningTime: '',
  });

  const [loading, setLoading] = useState(false);

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle time selection
  const handleTimeChange = (field, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue ? dayjs(newValue).format('HH:mm') : '',
    }));
  };

  // Handle form submission
  const handleEditLocation = async () => {
    if (!location_id) {
      toast.error('Location ID is missing. Please select a valid location.');
      return;
    }

    if (!formData.locationName) {
      toast.error('Location Name is required!');
      return;
    }

    if (!authToken) {
      toast.error('Authorization token is missing. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.put(
        `/superAdmin/update_location/${location_id}`, // ✅ Update API endpoint
        {
          locationName: formData.locationName,
          company_id, // ✅ Ensure correct company association
          locationEmail: formData.email,
          locationMealTime: formData.locationMealTime,
          locationCutoffTime: formData.locationCutoffTime,
          locationOpeningTime: formData.locationOpeningTime,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('API Response:', response.data); // ✅ Log the response

      toast.success('Location updated successfully!', {
        description: `Location: ${formData.locationName}, Company ID: ${company_id}`,
      });

      // ✅ Close the dialog after successful edit
      onClose();
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);

      toast.error('Failed to update location!', {
        description: error.msg || 'Something went wrong. Try again!',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = useCallback(async () => {
    if (!authToken) {
      toast.error('Authorization token is missing. Please log in again.');
      return;
    }

    try {
      const response = await api.get(`/superAdmin/get_locations/${location_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success && response.data.data.length > 0) {
        const locationData = response.data.data[0];

        setFormData({
          locationName: locationData.locationName || '',
          locationMealTime: locationData.locationMealTime
            ? JSON.parse(locationData.locationMealTime)
            : [],
          email: locationData.locationEmail || '',
          locationCutoffTime: locationData.locationCutoffTime || '',
          locationOpeningTime: locationData.locationOpeningTime || '',
        });
      } else {
        toast.error('Failed to fetch location data.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      toast.error(error.msg);
    }
  }, [authToken, location_id]); // ✅ Now fetchLocationData is memoized

  useEffect(() => {
    if (open && location_id) {
      fetchLocationData(); // ✅ Calls the memoized function
    }
  }, [open, location_id, fetchLocationData]); // ✅ fetchLocationData is now a dependency

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            sx={{ width: '100%' }}
            label="Location Name"
            name="locationName"
            value={formData.locationName}
            onChange={handleChange}
            required
          />
          {/* ✅ Still taking input for Meal Time but NOT sending */}
          <FormControl fullWidth>
            <InputLabel>Meal Time</InputLabel>
            <Select
              multiple
              value={formData.locationMealTime || []}
              onChange={(e) => setFormData({ ...formData, locationMealTime: e.target.value })}
            >
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Midnight Snacks'].map((meal) => (
                <MenuItem key={meal} value={meal}>
                  {meal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            sx={{ width: '100%' }}
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Opening Time"
              value={
                formData.locationOpeningTime ? dayjs(formData.locationOpeningTime, 'HH:mm') : null
              }
              onChange={(newValue) => handleTimeChange('locationOpeningTime', newValue)}
              ampm={false} // ✅ Forces 24-hour format
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Cutoff Time"
              value={
                formData.locationCutoffTime ? dayjs(formData.locationCutoffTime, 'HH:mm') : null
              }
              onChange={(newValue) => handleTimeChange('locationCutoffTime', newValue)}
              ampm={false} // ✅ Forces 24-hour format
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          sx={{ width: '100%' }}
          onClick={handleEditLocation}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Location'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

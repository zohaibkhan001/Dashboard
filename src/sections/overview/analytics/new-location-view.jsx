import { useState } from 'react';
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
import { form } from 'src/theme/core/components/form';
import { Router } from 'react-router';
import { useRouter } from 'src/routes/hooks';
import { Box, Chip, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function NewLocationDialog({ open, onClose, title = 'Add New Location', id }) {
  // ✅ Fetch token from Redux (superAdminAuth)
  const authToken = useSelector((state) => state.superAdminAuth.token);

  const mealOptions = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Midnight Snacks']; // ✅ Define meal options

  const router = useRouter();

  const [formData, setFormData] = useState({
    locationName: '',
    selectedMeals: [], // ✅ Keep as an array
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

  const handleMealChange = (event) => {
    const selectedValues = event.target.value;
    setFormData((prev) => ({
      ...prev,
      selectedMeals:
        typeof selectedValues === 'string' ? selectedValues.split(',') : selectedValues,
    }));
  };

  const handleTimeChange = (field, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue ? dayjs(newValue).format('HH:mm') : '',
    }));
  };

  // Handle time selection
  // const handleTimeChange = (newValue) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     mealTime: newValue ? dayjs(newValue).format('HH:mm') : '',
  //   }));
  // };

  // Handle form submission
  const handleAddLocation = async () => {
    if (!id) {
      toast.error('Company ID is missing. Please select a company.');
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
      const response = await api.post(
        `/superAdmin/create_location`, // ✅ Sending only required fields
        {
          locationName: formData.locationName,
          company_id: id,
          locationEmail: formData.email,
          locationMealTime: formData.selectedMeals,
          locationCutoffTime: formData.locationCutoffTime,
          locationOpeningTime: formData.locationOpeningTime,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // ✅ Use token from Redux
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data); // ✅ Log the response
      if (response.data?.msg === 'Location created successfully') {
        // ✅ Check the message string
        // ✅ Check success field from API response
        toast.success('Location added successfully!', {
          description: `Location: ${formData.locationName}, Company ID: ${id}`,
        });

        // Reset form after success
        setFormData({
          locationName: '',
          selectedMeals: [], // ✅ Now an array to store multiple selections
          email: '',
          locationCutoffTime: '',
          locationOpeningTime: '',
        });

        // Close the dialog
        onClose();
      }
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);

      toast.error('Failed to add location!', {
        description: error.response?.data?.message || 'Something went wrong. Try again!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMeal = (event, mealToRemove) => {
    event.stopPropagation(); // ✅ Prevent dropdown toggle
    setFormData((prev) => ({
      ...prev,
      selectedMeals: prev.selectedMeals.filter((meal) => meal !== mealToRemove),
    }));
  };

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
          {/* ✅ Display selected items ABOVE the dropdown */}
          {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {(formData.selectedMeals || []).map((meal) => (
              <Box
                key={meal}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#e0e0e0',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                {meal}
                <IconButton
                  size="small"
                  onClick={(event) => handleRemoveMeal(event, meal)}
                  sx={{ ml: 1, padding: '2px' }}
                >
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </Box>
            ))}
          </Box> */}

          <FormControl fullWidth>
            <InputLabel>Meal Time</InputLabel>
            <Select multiple value={formData.selectedMeals || []} onChange={handleMealChange}>
              {mealOptions.map((meal) => (
                <MenuItem key={meal} value={meal}>
                  {meal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ✅ Still taking input for Email but NOT sending */}
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
          onClick={handleAddLocation}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Location'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

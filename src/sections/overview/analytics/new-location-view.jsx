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

// ----------------------------------------------------------------------

export function NewLocationDialog({ open, onClose, title = 'Add New Location', id }) {
  // ✅ Fetch token from Redux (superAdminAuth)
  const authToken = useSelector((state) => state.superAdminAuth.token);

  const [formData, setFormData] = useState({
    locationName: '',
    mealTime: null, // ✅ Still taking input but won't send
    email: '',
  });

  const [loading, setLoading] = useState(false);

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle time selection
  const handleTimeChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      mealTime: newValue ? dayjs(newValue).format('HH:mm') : '',
    }));
  };

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
          company_id: id, // ✅ Required field
          locationEmail: formData.email,
          locationCutoffTime: formData.mealTime,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // ✅ Use token from Redux
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data); // ✅ Log the response

      toast.success('Location added successfully!', {
        description: `Location: ${formData.locationName}, Company ID: ${id}`,
      });

      // Reset form after success
      setFormData({
        locationName: '',
        mealTime: null,
        email: '',
      });

      // Close the dialog
      onClose();
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);

      toast.error('Failed to add location!', {
        description: error.response?.data?.message || 'Something went wrong. Try again!',
      });
    } finally {
      setLoading(false);
    }
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Meal Time"
              value={formData.mealTime ? dayjs(formData.mealTime, 'HH:mm') : null}
              onChange={handleTimeChange}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>

          {/* ✅ Still taking input for Email but NOT sending */}
          <TextField
            sx={{ width: '100%' }}
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
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

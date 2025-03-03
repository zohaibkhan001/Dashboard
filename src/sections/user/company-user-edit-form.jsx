import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import { useRouter } from 'src/routes/hooks';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import api from 'src/utils/api';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export const UserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Enter a valid email address!' }),
  phone: zod
    .string()
    // .regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits!' })
    .optional(),
  customer_id: zod.number({ required_error: 'Customer ID is required!' }),
  designation: zod.string().min(1, { message: 'Designation is required!' }),
});

// ----------------------------------------------------------------------

export function UserCompanyEditForm() {
  const { customer_id } = useParams();
  const router = useRouter();
  const { token } = useSelector((state) => state.superAdminAuth);

  const [loadingData, setLoadingData] = useState(true); // ✅ Separate loading state for fetching
  const [loadingSubmit, setLoadingSubmit] = useState(false); // ✅ Separate loading state for submitting

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      customer_id: Number(customer_id) || '',
      designation: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    async function fetchCustomer() {
      try {
        if (!token) {
          toast.error('Authentication token missing. Please log in again.');
          return;
        }

        const response = await api.get(`/superAdmin/fetch_particular_customer/${customer_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const customerDetails = response.data.data[0]; // ✅ Extract first object from array
          console.log(customerDetails);
          reset(customerDetails); // ✅ Dynamically update form fields
        } else {
          toast.error('Failed to load customer details.');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching customer data.');
      } finally {
        setLoadingData(false); // ✅ Stop loading state after fetching
      }
    }

    if (customer_id) {
      fetchCustomer();
    }
  }, [customer_id, token, reset]); // ✅ Add reset to dependencies

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!token) {
        toast.error('Authentication token missing. Please log in again.');
        return;
      }

      setLoadingSubmit(true); // ✅ Show loading state for submit button

      const payload = {
        customer_id: Number(customer_id),
        name: data.name,
        phone: data.phone,
        designation: data.designation,
        email: data.email,
      };

      const response = await api.put(`/superAdmin/update_customer_profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success('User updated successfully!');
        router.back();
      } else {
        throw new Error('Failed to update user.');
      }
    } catch (error) {
      toast.error(error.msg || 'Error updating user.');
    } finally {
      setLoadingSubmit(false); // ✅ Stop loading state for submit button
    }
  });

  if (loadingData) {
    return <p>Loading user data...</p>; // ✅ Show loading only when fetching
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Field.Text name="name" label="Full Name" />
                <Field.Text name="email" label="Email Address" />
                <Field.Text name="phone" label="Phone Number" />

                {/* Pre-filled and disabled Customer ID field */}
                <TextField label="Customer ID" value={customer_id} disabled fullWidth />

                <Field.Text name="designation" label="Designation" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={loadingSubmit}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </Box>
  );
}

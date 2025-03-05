import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
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

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Enter a valid email address!' }),
  phone: zod.string().regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits!' }), // Ensures exactly 10 digits  company_id: zod.number({ required_error: 'Company ID is required!' }),
  designation: zod.string().min(1, { message: 'Designation is required!' }),
});

// ----------------------------------------------------------------------

export function UserCompanyNewEditForm() {
  const { company_id } = useParams(); // Extract company_id from the URL
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); // Manage loading state
  const { token } = useSelector((state) => state.superAdminAuth);

  const defaultValues = useMemo(
    () => ({
      name: '',
      email: '',
      phone: '',
      company_id: company_id ? Number(company_id) : '', // Pre-fill from URL
      designation: '',
    }),
    [company_id]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true); // Start loading

    try {
      const response = await api.post(
        '/superAdmin/create_customer',
        {
          name: data.name,
          email: data.email,
          phone: data.phone ? (data.phone.startsWith('+91') ? data.phone : `+91${data.phone}`) : '',
          company_id: Number(company_id), // Ensure correct format
          designation: data.designation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      if (response.status !== 200) throw new Error(response.msg);

      reset();
      toast.success('User created successfully!');
      setTimeout(() => {
        router.back(); // Navigate back after toast
      }, 2000); // Delay to allow toast to show
      //   router.push('/dashboard/user/list'); // Redirect to user list
    } catch (error) {
      toast.error(error.msg || 'Error creating user');
      console.error(error);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  });

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

                {/* Pre-filled and disabled Company ID field */}
                <TextField label="Company ID" value={company_id} disabled fullWidth />

                <Field.Text name="designation" label="Designation" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Create User
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </Box>
  );
}

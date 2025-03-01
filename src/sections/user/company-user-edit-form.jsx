import { z as zod } from 'zod';
import { useMemo } from 'react';
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

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Enter a valid email address!' }),
  phone: zod.string().optional(), // Phone can be empty
  customer_id: zod.number({ required_error: 'Company ID is required!' }),
  designation: zod.string().min(1, { message: 'Designation is required!' }),
});

// ----------------------------------------------------------------------

export function UserCompanyEditForm() {
  const { customer_id } = useParams(); // Extract company_id from the URL
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: 'Ankit',
      email: 'email',
      phone: '',
      customer_id: customer_id ? Number(customer_id) : '', // Pre-fill from URL
      designation: '',
    }),
    [customer_id]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          customer_id: Number(customer_id), // Ensure correct format
          designation: data.designation,
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');

      reset();
      toast.success('User created successfully!');
      router.push('/dashboard/user/list'); // Redirect to user list
    } catch (error) {
      toast.error('Error creating user');
      console.error(error);
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
                <TextField label="Customer ID" value={customer_id} disabled fullWidth />

                <Field.Text name="designation" label="Designation" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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

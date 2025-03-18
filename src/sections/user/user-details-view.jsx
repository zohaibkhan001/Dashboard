import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { OrderListView } from 'src/sections/user/orders/order-list-view';
import { InvoiceListView } from 'src/sections/user/view/invoice-list-view';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Enter a valid email address!' }),
  phone: zod.string().optional(), // Phone can be empty
  company_id: zod.number({ required_error: 'Company ID is required!' }),
  designation: zod.string().min(1, { message: 'Designation is required!' }),
});

// ----------------------------------------------------------------------

export function UserDetails({ currentUser, transactions, orders }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: '',
      email: '',
      phone: '',
      company_id: '',
      designation: '',
    }),
    []
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {/* Tabs Header */}
      <Tabs value={activeTab} onChange={handleChange} centered>
        {/* <Tab label="General" /> */}
        <Tab label="Wallet Transactions" />
        <Tab label="Orders" />
      </Tabs>

      {/* Tabs Content */}
      <Box sx={{ p: 3 }}>
        {/* {activeTab === 0 && (
          <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Card sx={{ py: 2.5, px: 3 }}>
                  {currentUser && (
                    <Label
                      color={
                        (values.status === 'active' && 'success') ||
                        (values.status === 'banned' && 'error') ||
                        'warning'
                      }
                      sx={{ position: 'absolute', top: 24, right: 24 }}
                    >
                      {values.status}
                    </Label>
                  )}

                  <Box sx={{ mb: 5 }}>
                    <Field.UploadAvatar
                      name="avatarUrl"
                      maxSize={3145728}
                      helperText={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 3,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: 'text.disabled',
                          }}
                        >
                          Allowed *.jpeg, *.jpg, *.png, *.gif
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                  </Box>

                  {currentUser && (
                    <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                      <Button variant="soft" color="error">
                        Delete user
                      </Button>
                    </Stack>
                  )}
                </Card>
              </Grid>

              <Grid xs={12} md={8}>
                <Card sx={{ p: 3 }}>
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
                    <Field.Text name="company_id" label="Company ID" type="number" />
                    <Field.Text name="designation" label="Designation" />
                  </Box>

                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!currentUser ? 'Create user' : 'Save changes'}
                    </LoadingButton>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        )} */}
        {activeTab === 0 && (
          <Box sx={{ width: '110%', maxWidth: '1200px', marginLeft: '-2.5rem', p: 0 }}>
            <InvoiceListView transactions={transactions} />
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ width: '110%', maxWidth: '1200px', marginLeft: '-2.5rem', p: 0 }}>
            <OrderListView orders={orders} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

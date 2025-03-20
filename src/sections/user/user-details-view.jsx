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

export function UserDetails({ currentUser, transactions, orders, user }) {
  const router = useRouter();

  const { id } = useParams();

  const defaultValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      companyName: user?.company?.companyName || '',
      designation: user?.designation || '',
      wallet_balance: user?.wallet_balance || 0,
    }),
    [user]
  );

  const deviceInfo = useMemo(() => {
    try {
      return user?.device_info ? JSON.parse(user.device_info) : null;
    } catch (error) {
      console.error('Error parsing device_info:', error);
      return null;
    }
  }, [user]);

  console.log(deviceInfo);

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

  const hanldeEditClick = () => {
    router.push(paths.dashboard.user.userEdit(Number(id)));
  };

  const toTitleCase = (str) => {
    if (!str) return 'N/A';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {/* Tabs Header */}
      <Tabs value={activeTab} onChange={handleChange} centered>
        <Tab label="General" />
        <Tab label="Wallet Transactions" />
        <Tab label="Orders" />
      </Tabs>

      {/* Tabs Content */}
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && (
          <Form methods={methods}>
            <Grid container spacing={3} sx={{ width: '100%' }}>
              {/* <Grid xs={12} md={4}>
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
              </Grid> */}

              <Grid xs={12}>
                <Card sx={{ p: 3, width: '100%' }}>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(3,1f)',
                    }}
                  >
                    <Field.Text
                      name="name"
                      label="Full Name"
                      InputProps={{ readOnly: true }}
                      value={user?.name || ''}
                    />
                    <Field.Text
                      name="email"
                      label="Email Address"
                      InputProps={{ readOnly: true }}
                      value={user?.email || ''}
                    />
                    <Field.Text
                      name="phone"
                      label="Phone Number"
                      InputProps={{ readOnly: true }}
                      value={user?.phone || ''}
                    />
                    <Field.Text
                      name="companyName"
                      label="Company Name"
                      InputProps={{ readOnly: true }}
                      value={user?.company?.companyName || ''}
                    />
                    <Field.Text
                      name="designation"
                      label="Designation"
                      InputProps={{ readOnly: true }}
                      value={user?.designation || ''}
                    />
                    <Field.Text
                      name="wallet_balance"
                      label="Wallet Balance"
                      InputProps={{ readOnly: true }}
                      value={user?.wallet_balance || 0}
                    />
                  </Box>

                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="button" variant="contained" onClick={hanldeEditClick}>
                      Edit user info
                    </LoadingButton>
                  </Stack>
                </Card>

                <Card sx={{ p: 3, width: '100%', mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Device Info
                  </Typography>

                  {deviceInfo ? (
                    <Box
                      rowGap={2}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(3, 1fr)',
                      }}
                      sx={{ width: '100%' }}
                    >
                      <Field.Text
                        name="brand"
                        label="Brand"
                        value={toTitleCase(deviceInfo?.brand) || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                      <Field.Text
                        name="model"
                        label="Model"
                        value={deviceInfo.model || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                      <Field.Text
                        name="systemName"
                        label="OS Name"
                        value={deviceInfo.systemName || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                      <Field.Text
                        name="systemVersion"
                        label="OS Version"
                        value={deviceInfo.systemVersion || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                      <Field.Text
                        name="deviceId"
                        label="Device ID"
                        value={deviceInfo.deviceId || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                      <Field.Text
                        name="ipAddress"
                        label="IP Address"
                        value={deviceInfo.ipAddress || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                      <Field.Text
                        name="AppVersion"
                        label="App Version"
                        value={toTitleCase(deviceInfo.AppVersion) || 'N/A'}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No device information available.
                    </Typography>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Form>
        )}
        {activeTab === 1 && (
          <Box sx={{ width: '110%', maxWidth: '1200px', marginLeft: '-2.5rem', p: 0 }}>
            <InvoiceListView transactions={transactions} />
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ width: '110%', maxWidth: '1200px', marginLeft: '-2.5rem', p: 0 }}>
            <OrderListView orders={orders} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

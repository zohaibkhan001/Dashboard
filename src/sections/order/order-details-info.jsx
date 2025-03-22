import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import dayjs from 'dayjs';
import { Field } from 'src/components/hook-form';
import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import api from 'src/utils/api';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function OrderDetailsInfo({
  order_id,
  customer,
  delivery,
  payment,
  orderStatus,
  shippingAddress,
  status,
  location,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const { token } = useSelector((state) => state.superAdminAuth);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelClick = () => {
    setSelectedAction('Cancel Order');
    setDialogTitle('Cancel Order');
    setDialogContent('Are you sure you want to cancel this order? This action cannot be undone.');
    setOpenDialog(true);
  };

  const handleConfirmClick = () => {
    setSelectedAction('Confirm Order');
    setDialogTitle('Confirm Order');
    setDialogContent('Are you sure you want to confirm this order? This action cannot be undone.');
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    if (selectedAction === 'Cancel Order') {
      handleClose();
      setOpenDialog(false);
      setCancelLoading(true);
      try {
        const response = await api.post(
          'superAdmin/cancel_order',
          { order_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          toast.success(
            `Order ${order_id} has been cancelled successfully.Refund will be initiated`
          );
          setTimeout(() => {
            router.push(0);
          }, 2000);
        } else {
          toast.error(`Failed to cancel order ${order_id}.`);
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error(error.msg);
      } finally {
        setCancelLoading(false);
      }
    } else if (selectedAction === 'Confirm Order') {
      handleClose();

      alert(`Order ID: ${order_id}\nAction: Order has been confirmed.`);
    }
    setOpenDialog(false);
  };

  const renderCustomer = (
    <>
      {/* <CardHeader
        title="Customer info"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      /> */}
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.name}
          src={customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>
            {customer?.email} | {customer?.phone}
          </Box>

          {/* <div>
            IP address:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.ipAddress}
            </Box>
          </div> */}

          {/* <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to Blacklist
          </Button> */}
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      {/* <CardHeader
        title="Delivery"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      /> */}
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Payment Id:
          </Box>
          {payment.payment_id}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Payment Method:
          </Box>
          {payment.payment_method.toUpperCase()}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Payment Amount:
          </Box>
          {`₹${payment.amount}`}{' '}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Transaction Id:
          </Box>
          {payment.transaction_id}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Status
          </Box>
          {payment.status.toUpperCase()}{' '}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Paid on:
          </Box>
          {payment?.createdAt ? dayjs(payment.createdAt).format('DD MMM YYYY, hh:mm A') : 'N/A'}
        </Stack>
        {/* <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Tracking No.
          </Box>
          <Link underline="always" color="inherit">
            {delivery?.trackingNumber}
          </Link>
        </Stack> */}
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      {/* <CardHeader
        title="Shipping"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      /> */}
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Company
          </Box>
          {delivery}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Location
          </Box>
          {location}
        </Stack>
      </Stack>
    </>
  );

  const renderActionButtons = (
    <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
      <Stack direction="row">
        <LoadingButton
          variant="contained"
          onClick={handleClick}
          startIcon={<Iconify icon="lets-icons:arrow-drop-down-big" />}
          fullWidth
          loading={cancelLoading || confirmLoading}
          disabled={status === 'cancelled'}
        >
          Change order status
        </LoadingButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <Box
            sx={{
              width: '20vh',
              justifyContent: 'center',
            }}
          >
            <MenuItem
              onClick={handleCancelClick}
              sx={{ border: '1px solid black', borderRadius: '8px' }}
            >
              Cancel Order
            </MenuItem>
            <MenuItem
              onClick={handleConfirmClick}
              sx={{ border: '1px solid black', borderRadius: '8px' }}
            >
              Confirm Order
            </MenuItem>
          </Box>
        </Menu>
      </Stack>

      {/* <Stack direction="row">
        <Button variant="contained" fullWidth disabled={orderStatus !== 'cancelled'}>
          Initiate Refund
        </Button>
      </Stack> */}
    </Stack>
  );

  const renderPayment = (
    <>
      {/* <CardHeader
        title="Payment"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      /> */}
      {/* <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ p: 3, gap: 0.5, typography: 'body2' }}
      >
        {payment?.cardNumber}
        <Iconify icon="logos:mastercard" width={24} />
      </Box> */}
    </>
  );

  return (
    <Card>
      {renderCustomer}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderDelivery}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderShipping}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderActionButtons}
      <ConfirmDialog
        title={dialogTitle}
        content={dialogContent}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmAction}>
            Confirm
          </Button>
        }
      />{' '}
    </Card>
  );
}

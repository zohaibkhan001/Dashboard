import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function OrderDetailsItems({
  taxes,
  shipping,
  discount,
  subtotal,
  items = [],
  totalAmount,
}) {
  const renderTotal = (
    <Stack spacing={2} alignItems="flex-end" sx={{ p: 3, textAlign: 'right', typography: 'body2' }}>
      {/* <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subtotal) || '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Shipping</Box>
        <Box sx={{ width: 160, ...(shipping && { color: 'error.main' }) }}>
          {shipping ? `- ${fCurrency(shipping)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box sx={{ width: 160, ...(discount && { color: 'error.main' }) }}>
          {discount ? `- ${fCurrency(discount)}` : '-'}
        </Box>
      </Stack> */}

      {/* <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{taxes ? fCurrency(taxes) : '-'}</Box>
      </Stack> */}

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div>Total</div>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      {/* <CardHeader
        title="Details"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      /> */}

      <Scrollbar>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            alignItems="center"
            sx={{
              p: 3,
              minWidth: 640,
              borderBottom: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
            }}
          >
            <Avatar
              src={JSON.parse(item.image)?.url || ''}
              variant="rounded"
              sx={{ width: 60, height: 60, mr: 2 }}
            />

            <ListItemText
              primary={item.meal_name}
              secondary={item.type === 'non-veg' ? 'Non-Veg' : 'Veg'}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                mt: 0.5,
              }}
            />

            <Box sx={{ typography: 'body2' }}>x{item.qty}</Box>

            <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
              {`₹${item.price || 0}`} {/* Default price if missing */}
            </Box>
          </Stack>
        ))}
      </Scrollbar>

      {renderTotal}
    </Card>
  );
}

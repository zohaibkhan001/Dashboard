import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return params.row.price ? `₹${params.row.price}` : '-';
}

// ----------------------------------------------------------------------

export function RenderCellPublish({ params }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Iconify
        icon="mdi:circle"
        sx={{ color: params.row.type === 'veg' ? 'green' : 'red', fontSize: 14 }}
      />
      <Label variant="soft" color={(params.row.type === 'non-veg' && 'error') || 'success'}>
        {params.row.type}
      </Label>
    </Stack>
  );
}

// ----------------------------------------------------------------------

// export function RenderCellCreatedAt({ params }) {
//   return (
//     <Stack spacing={0.5}>
//       <Box component="span">{fDate(params.row.createdAt)}</Box>
//       <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
//         {fTime(params.row.createdAt)}
//       </Box>
//     </Stack>
//   );
// }

// ----------------------------------------------------------------------

// export function RenderCellStock({ params }) {
//   return (
//     <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
//       <LinearProgress
//         value={(params.row.available * 100) / params.row.quantity}
//         variant="determinate"
//         color={
//           (params.row.inventoryType === 'out of stock' && 'error') ||
//           (params.row.inventoryType === 'low stock' && 'warning') ||
//           'success'
//         }
//         sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
//       />
//       {!!params.row.available && params.row.available} {params.row.inventoryType}
//     </Stack>
//   );
// }

// ----------------------------------------------------------------------

export function RenderCellProduct({ params, onViewRow }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.mealName}
        src={params.row.image}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.mealName}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.categoryName} {/* Show category name */}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

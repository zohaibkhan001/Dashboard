import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { LocationEditDialog } from './location-edit-view';

// import { ReviewQuickEditForm } from './review-quick-edit-form';

// ----------------------------------------------------------------------

export function LocationTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  company_id,
}) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  const [open, setOpen] = useState(false);

  // console.log(company_id);

  // console.log('check location', row.location_id);
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.location_id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            {/* <Avatar alt={row.name} src={row.avatarUrl} /> */}

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row.locationName}
              </Link>
              {/* <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box> */}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.locationMealTime
            ? (() => {
                try {
                  const parsed = JSON.parse(row.locationMealTime);
                  return Array.isArray(parsed) ? parsed.join(', ') : parsed; // Handle single value properly
                } catch (error) {
                  console.error('JSON parsing error:', error);
                  return 'Invalid Data'; // Fallback in case of an error
                }
              })()
            : 'N/A'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.locationEmail || 'N/A '}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {new Date(row.createdAt).toLocaleString(undefined, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {new Date(row.updatedAt).toLocaleString(undefined, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            {/* <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip> */}

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* <ReviewQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem onClick={() => setOpen(true)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>

        <LocationEditDialog
          open={open}
          onClose={() => setOpen(false)}
          location_id={row.location_id}
          company_id={company_id}
        />
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete this location?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await onDeleteRow(row.location_id);
              confirm.onFalse(); // ✅ Ensure the dialog closes after async deletion
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

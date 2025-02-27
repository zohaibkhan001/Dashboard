import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function CompanyTableRow({ row, selected, onSelectRow, onViewRow, onDeleteRow }) {
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.company_id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Box component="span">{row.companyName}</Box>
            {/* <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.customer.email}
            </Box> */}
          </Stack>
        </Stack>
      </TableCell>

      <TableCell> {row.contactPerson} </TableCell>

      <TableCell align="center">
        {/* <TableCell> */}
        {(() => {
          console.log(row.domainName); // Debugging log

          try {
            let domains;

            // Check if domainName is a valid JSON array
            if (row.domainName.startsWith('[') && row.domainName.endsWith(']')) {
              domains = JSON.parse(row.domainName);
            } else {
              // If not JSON, assume it's a comma-separated string
              domains = row.domainName.split(',').map((d) => d.trim());
            }

            if (Array.isArray(domains) && domains.length > 0) {
              return domains.length > 1 ? `${domains[0]} +${domains.length - 1}` : domains[0];
            }
            return 'N/A'; // Handle empty or invalid domain lists
          } catch (error) {
            console.error('Domain parsing error:', error);
            return 'N/A'; // Return fallback value if parsing fails
          }
        })()}
      </TableCell>

      <TableCell> {row.companyAddress} </TableCell>

      <TableCell>{row.email}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={collapse.value ? 'inherit' : 'default'}>
          <Iconify icon="material-symbols:edit-rounded" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

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

          <MenuItem
            onClick={() => {
              onViewRow(row.company_id);
              popover.onClose();
              // console.log(row.company_id);
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

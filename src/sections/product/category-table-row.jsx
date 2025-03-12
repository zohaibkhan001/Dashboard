import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { CategoryEditForm } from './category-edit-form';

// ----------------------------------------------------------------------

export function CategoryTableRow({ row, selected, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleEditCategory = (category) => {
    setSelectedCategory(category.category_id); // ✅ Store only category_id
    setOpenEdit(true);
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell sx={{ width: '50%', textAlign: 'center' }}>
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
          <Avatar
            alt={row.name}
            src={row.image || 'https://via.placeholder.com/100'}
            sx={{ width: 100, height: 100, borderRadius: 2 }}
          />
        </Stack>
      </TableCell>

      <TableCell sx={{ width: '50%', textAlign: 'center' }}>{row.name}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  // const renderSecondary = (
  //   <TableRow>
  //     <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
  //       <Collapse
  //         in={collapse.value}
  //         timeout="auto"
  //         unmountOnExit
  //         sx={{ bgcolor: 'background.neutral' }}
  //       >
  //         <Paper sx={{ m: 1.5 }}>
  //           {row.items.map((item) => (
  //             <Stack
  //               key={item.id}
  //               direction="row"
  //               alignItems="center"
  //               sx={{
  //                 p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
  //                 '&:not(:last-of-type)': {
  //                   borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
  //                 },
  //               }}
  //             >
  //               <Avatar
  //                 src={item.coverUrl}
  //                 variant="rounded"
  //                 sx={{ width: 48, height: 48, mr: 2 }}
  //               />

  //               <ListItemText
  //                 primary={item.name}
  //                 secondary={item.sku}
  //                 primaryTypographyProps={{ typography: 'body2' }}
  //                 secondaryTypographyProps={{
  //                   component: 'span',
  //                   color: 'text.disabled',
  //                   mt: 0.5,
  //                 }}
  //               />

  //               <div>x{item.quantity} </div>

  //               <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.price)}</Box>
  //             </Stack>
  //           ))}
  //         </Paper>
  //       </Collapse>
  //     </TableCell>
  //   </TableRow>
  // );

  return (
    <>
      {renderPrimary}

      {/* {renderSecondary} */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {/* ✅ Fix: Ensure delete action applies to category */}
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

          {/* ✅ Fix: Ensure edit action works with categories */}
          <MenuItem
            onClick={() => {
              handleEditCategory(row);
              popover.onClose();
            }}
          >
            <Iconify icon="material-symbols:edit-rounded" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure you want to delete the category "${row.name}"? The meals associated with "${row.name}" will also be deleted!`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(); // Ensure this function correctly removes the category
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      <CategoryEditForm
        categoryId={selectedCategory} // ✅ Pass category_id as a prop
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      />
    </>
  );
}

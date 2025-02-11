// import { useCallback } from 'react';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
// import Checkbox from '@mui/material/Checkbox';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import OutlinedInput from '@mui/material/OutlinedInput';

import { useSetState } from 'src/hooks/use-set-state';

// import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ProductTableToolbar({ filters, options }) {
  const popover = usePopover();

  const local = useSetState({
    stock: filters.state.stock,
    publish: filters.state.publish,
  });

  // const handleChangeStock = useCallback(
  //   (event) => {
  //     const {
  //       target: { value },
  //     } = event;

  //     local.setState({ stock: typeof value === 'string' ? value.split(',') : value });
  //   },
  //   [local]
  // );

  // const handleChangePublish = useCallback(
  //   (event) => {
  //     const {
  //       target: { value },
  //     } = event;

  //     local.setState({ publish: typeof value === 'string' ? value.split(',') : value });
  //   },
  //   [local]
  // );

  // const handleFilterStock = useCallback(() => {
  //   filters.setState({ stock: local.state.stock });
  // }, [filters, local.state.stock]);

  // const handleFilterPublish = useCallback(() => {
  //   filters.setState({ publish: local.state.publish });
  // }, [filters, local.state.publish]);

  return (
    <>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

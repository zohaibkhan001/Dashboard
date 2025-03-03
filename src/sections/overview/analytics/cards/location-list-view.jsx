import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import api from 'src/utils/api';
import { useSelector } from 'react-redux';

import { _roles, _userList } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { LocationTableRow } from './location-table-row';
import { LocationTableToolbar } from './location-table-toolbar';
import { LocationTableFiltersResult } from './location-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'locationName', label: 'Location Name', width: 200 },
  { id: 'cutOffTime', label: 'CutOff Time', width: 200 },
  { id: 'locationEmail', label: 'Location Email', width: 200 },
  { id: 'createdAt', label: 'Created At', width: 200 },
  { id: 'updatedAt', label: 'Updated At', width: 200 },
  { id: '', width: 100 },
];

// ----------------------------------------------------------------------

export function LocationListView({ locations }) {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(locations || []);

  const { token } = useSelector((state) => state.superAdminAuth);

  useEffect(() => {
    if (locations) {
      // ✅ Transform API response to match table structure
      const formattedLocations = locations.map((loc) => ({
        id: loc.location_id, // ✅ Convert location_id -> id
        locationName: loc.locationName,
        cutOffTime: loc.locationCutoffTime || 'N/A', // ✅ Handle empty values
        locationEmail: loc.locationEmail || 'N/A',
        createdAt: new Date(loc.createdAt).toLocaleString(), // ✅ Format date
        updatedAt: new Date(loc.updatedAt).toLocaleString(), // ✅ Format date
      }));

      setTableData(formattedLocations);
    }
  }, [locations]);

  const filters = useSetState({ name: '', role: [], status: 'all' });

  const dataFiltered = applyFilter({
    inputData: locations || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const response = await api.delete(`/superAdmin/delete_location/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success(response.data.msg);

          // ✅ Remove deleted row from table
          const updatedTableData = tableData.filter((row) => row.location_id !== id);
          setTableData(updatedTableData);
          setTimeout(() => {
            router.refresh();
          }, 2000);
          table.onUpdatePageDeleteRow(dataInPage.length);
        } else {
          toast.error('Failed to delete location.');
        }
      } catch (error) {
        console.error('Error deleting location:', error);
        toast.error(error.msg);
      }
    },
    [dataInPage.length, table, tableData, token, router]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  return (
    <>
      <DashboardContent
        sx={{
          padding: 0,
          marginTop: '1rem',
          marginBottom: '1rem',
          overflowX: 'hidden',
        }}
      >
        <Card
          sx={{
            width: { xs: '100%', sm: '100%', md: '100%', lg: '105%' },
            padding: 0,
            marginLeft: '-1.5rem',
            marginRight: 0,
            marginBottom: 0,
            overflowX: 'hidden',
          }}
        >
          <LocationTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
          />

          {canReset && (
            <LocationTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <LocationTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.location_id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (location) => location.locationName.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

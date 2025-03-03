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

import { _roles, _userList } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import api from 'src/utils/api';

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
import { useSelector } from 'react-redux';
import { LoadingScreen } from 'src/components/loading-screen';

import { UserTableRow } from './user-table-row';
import { UserTableToolbar } from './user-table-toolbar';
import { UserTableFiltersResult } from './user-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 200 },
  { id: 'phoneNumber', label: 'Phone number', width: 200 },
  { id: 'role', label: 'Role', width: 200 },
  { id: 'wallet', label: 'Wallet Bal.', width: 200 },
  { id: '', width: 100 },
];

// ----------------------------------------------------------------------

export function UserListView({ company_id }) {
  const table = useTable();

  // console.log('Check', company_id);

  const { customers, loading } = useSelector((state) => state.companyCustomer);
  // console.log(customers);
  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (customers.length > 0) {
      setTableData(customers);
    }
  }, [customers]);

  const filters = useSetState({ name: '', role: [], status: 'all' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const { token } = useSelector((state) => state.superAdminAuth);

  const handleDeleteRow = useCallback(
    async (customer_id) => {
      try {
        if (!token) {
          toast.error('Authentication token missing. Please log in again.');
          return;
        }

        // Call API to delete the customer profile
        await api.delete(`/superAdmin/delete_customer_profile/${customer_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove deleted user from table
        const deleteRow = tableData.filter((row) => row.customer_id !== customer_id);
        setTableData(deleteRow);

        toast.success('User deleted successfully!');
        table.onUpdatePageDeleteRow(dataInPage.length);
        confirm.onFalse();
      } catch (error) {
        confirm.onFalse();
        toast.error(error.msg || 'Error deleting user');
        console.error(error);
      }
    },
    [dataInPage.length, table, tableData, token, confirm]
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
    (customer_id) => {
      router.push(paths.dashboard.user.userEdit(customer_id));
    },
    [router]
  );
  if (loading) {
    return <LoadingScreen />;
  }

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
          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
            company_id={company_id}
          />

          {canReset && (
            <UserTableFiltersResult
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.customer_id)}
                        onEditRow={() => handleEditRow(row.customer_id)}
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
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}

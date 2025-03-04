// import { useState, useCallback, useEffect } from 'react';

// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

// import { useBoolean } from 'src/hooks/use-boolean';
// import { useSetState } from 'src/hooks/use-set-state';

// import { fIsAfter, fIsBetween } from 'src/utils/format-time';

// import { varAlpha } from 'src/theme/styles';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { _company, COMPANY_STATUS_OPTIONS } from 'src/_mock';

// import { useDispatch, useSelector } from 'react-redux';
// import { deleteCompany } from 'src/utils/Redux/slices/deleteCompanySlice';

// import { fetchCompanies } from 'src/utils/Redux/slices/companiesListSlice';

// import { Label } from 'src/components/label';
// import { toast } from 'src/components/snackbar';
// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';
// import { ConfirmDialog } from 'src/components/custom-dialog';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import {
//   useTable,
//   emptyRows,
//   rowInPage,
//   TableNoData,
//   getComparator,
//   TableEmptyRows,
//   TableHeadCustom,
//   TablePaginationCustom,
// } from 'src/components/table';

// import { CategoryTableRow } from '../category-table-row';
// import { CategoryTableToolbar } from '../category-table-toolbar';
// import { CategoryTableFiltersResult } from '../category-table-filters-result';

// // ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'Active' }, ...COMPANY_STATUS_OPTIONS];

// const TABLE_HEAD = [
//   { id: 'companyName', label: 'Company Name', width: 250 },
//   { id: 'contactPerson', label: 'POC Contact', width: 250 },
//   {
//     id: 'domainName',
//     label: 'Domains',
//     width: 250,
//     align: 'center',
//   },
//   { id: 'companyAddress', label: 'Address', width: 250 },
//   { id: 'email', label: 'POC Contact Email', width: 250 },
//   { id: '', width: 88 },
// ];

// // ----------------------------------------------------------------------

// export function ProductCategoryListView() {
//   // const { token } = useSelector((state) => state.superAdminAuth);

//   // console.log(token);

//   const { companies, loading } = useSelector((state) => state.allCompanies);
//   // console.log(companies);

//   const table = useTable({ defaultOrderBy: 'orderNumber' });

//   const dispatch = useDispatch();

//   const router = useRouter();

//   const confirm = useBoolean();

//   const [tableData, setTableData] = useState([]);

//   useEffect(() => {
//     if (companies?.length) {
//       setTableData(companies);
//     }
//   }, [companies]);

//   useEffect(() => {
//     dispatch(fetchCompanies()); // ✅ Fetch companies when component mounts
//   }, [dispatch]);

//   const filters = useSetState({
//     name: '',
//     status: 'all',
//     startDate: null,
//     endDate: null,
//   });

//   const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

//   const dataFiltered = applyFilter({
//     inputData: tableData,
//     comparator: getComparator(table.order, table.orderBy),
//     filters: filters.state,
//     dateError,
//   });

//   const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

//   const canReset =
//     !!filters.state.name ||
//     filters.state.status !== 'all' ||
//     (!!filters.state.startDate && !!filters.state.endDate);

//   const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

//   const handleDeleteRow = useCallback(
//     async (id) => {
//       try {
//         await dispatch(deleteCompany(id)).unwrap(); // ✅ Dispatch delete action
//         toast.success('Delete success!');

//         // ✅ Remove deleted row from UI
//         const deleteRow = tableData.filter((row) => row.id !== id);
//         setTableData(deleteRow);

//         table.onUpdatePageDeleteRow(dataInPage.length);

//         // ✅ Close the confirm dialog after successful delete
//         confirm.onFalse();

//         // ✅ Refresh the page after 3 seconds
//         setTimeout(() => {
//           window.location.reload();
//         }, 3000);
//       } catch (error) {
//         toast.error(error.message || 'Failed to delete company');
//       }
//     },
//     [dataInPage.length, table, tableData, dispatch, confirm]
//   );

//   const handleDeleteRows = useCallback(() => {
//     const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

//     toast.success('Delete success!');

//     setTableData(deleteRows);

//     table.onUpdatePageDeleteRows({
//       totalRowsInPage: dataInPage.length,
//       totalRowsFiltered: dataFiltered.length,
//     });
//   }, [dataFiltered.length, dataInPage.length, table, tableData]);

//   const handleViewRow = useCallback(
//     (id) => {
//       router.push(paths.dashboard.company.details(id));
//     },
//     [router]
//   );

//   const handleFilterStatus = useCallback(
//     (event, newValue) => {
//       table.onResetPage();
//       filters.setState({ status: newValue });
//     },
//     [filters, table]
//   );

//   return (
//     <>
//       <DashboardContent>
//         <CustomBreadcrumbs
//           heading="Company Master List"
//           links={[
//             { name: 'Dashboard', href: paths.dashboard.root },
//             { name: 'Company', href: paths.dashboard.company.root },
//             { name: 'List' },
//           ]}
//           action={
//             <Button
//               component={RouterLink}
//               href={paths.dashboard.company.new}
//               variant="contained"
//               startIcon={<Iconify icon="mingcute:add-line" />}
//             >
//               New Company
//             </Button>
//           }
//           sx={{ mb: { xs: 3, md: 5 } }}
//         />

//         <Card>
//           <Tabs
//             value={filters.state.status}
//             onChange={handleFilterStatus}
//             sx={{
//               px: 2.5,
//               boxShadow: (theme) =>
//                 `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
//             }}
//           >
//             {STATUS_OPTIONS.map((tab) => (
//               <Tab
//                 key={tab.value}
//                 iconPosition="end"
//                 value={tab.value}
//                 label={tab.label}
//                 icon={
//                   <Label
//                     variant={
//                       ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
//                       'soft'
//                     }
//                     color={
//                       // (tab.value === 'completed' && 'success') ||
//                       (tab.value === 'pending' && 'warning') ||
//                       // (tab.value === 'cancelled' && 'error') ||
//                       'default'
//                     }
//                   >
//                     {['pending'].includes(tab.value)
//                       ? tableData.filter((user) => user.status === tab.value).length
//                       : tableData.length}
//                   </Label>
//                 }
//               />
//             ))}
//           </Tabs>

//           <CategoryTableToolbar
//             filters={filters}
//             onResetPage={table.onResetPage}
//             dateError={dateError}
//           />

//           {canReset && (
//             <CategoryTableFiltersResult
//               filters={filters}
//               totalResults={dataFiltered.length}
//               onResetPage={table.onResetPage}
//               sx={{ p: 2.5, pt: 0 }}
//             />
//           )}

//           <Box sx={{ position: 'relative' }}>
//             <Scrollbar sx={{ minHeight: 444 }}>
//               <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
//                 <TableHeadCustom
//                   order={table.order}
//                   orderBy={table.orderBy}
//                   headLabel={TABLE_HEAD}
//                   rowCount={dataFiltered.length}
//                   numSelected={table.selected.length}
//                   onSort={table.onSort}
//                   onSelectAllRows={(checked) =>
//                     table.onSelectAllRows(
//                       checked,
//                       dataFiltered.map((row) => row.id)
//                     )
//                   }
//                 />

//                 <TableBody>
//                   {dataFiltered
//                     .slice(
//                       table.page * table.rowsPerPage,
//                       table.page * table.rowsPerPage + table.rowsPerPage
//                     )
//                     .map((row) => {
//                       const formattedRow = {
//                         ...row,
//                         domainName: row.domainName ? JSON.parse(row.domainName).join(', ') : 'N/A',
//                       };

//                       return (
//                         <CategoryTableRow
//                           key={formattedRow.company_id}
//                           row={formattedRow}
//                           selected={table.selected.includes(formattedRow.company_id)}
//                           onSelectRow={() => table.onSelectRow(formattedRow.company_id)}
//                           onDeleteRow={() => handleDeleteRow(formattedRow.company_id)}
//                           onViewRow={() => handleViewRow(formattedRow.company_id)}
//                         />
//                       );
//                     })}

//                   <TableEmptyRows
//                     height={table.dense ? 56 : 56 + 20}
//                     emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
//                   />

//                   <TableNoData notFound={notFound} />
//                 </TableBody>
//               </Table>
//             </Scrollbar>
//           </Box>

//           <TablePaginationCustom
//             page={table.page}
//             dense={table.dense}
//             count={dataFiltered.length}
//             rowsPerPage={table.rowsPerPage}
//             onPageChange={table.onChangePage}
//             onChangeDense={table.onChangeDense}
//             onRowsPerPageChange={table.onChangeRowsPerPage}
//           />
//         </Card>
//       </DashboardContent>

//       <ConfirmDialog
//         open={confirm.value}
//         onClose={confirm.onFalse}
//         title="Delete"
//         content={
//           <>
//             Are you sure want to delete <strong> {table.selected.length} </strong> items?
//           </>
//         }
//         action={
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => {
//               handleDeleteRows();
//               confirm.onFalse();
//             }}
//           >
//             Delete
//           </Button>
//         }
//       />
//     </>
//   );
// }

// function applyFilter({ inputData, comparator, filters, dateError }) {
//   const { status, name, startDate, endDate } = filters;

//   const stabilizedThis = inputData.map((el, index) => [el, index]);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (name) {
//     inputData = inputData.filter(
//       (company) =>
//         company.companyName.toLowerCase().includes(name.toLowerCase()) ||
//         company.contactPerson.toLowerCase().includes(name.toLowerCase()) ||
//         company.email.toLowerCase().includes(name.toLowerCase()) ||
//         (company.domainName ? JSON.parse(company.domainName).join(', ') : 'N/A')
//           .toLowerCase()
//           .includes(name.toLowerCase())
//     );
//   }

//   if (status !== 'all') {
//     inputData = inputData.filter((order) => order.status === status);
//   }

//   if (!dateError) {
//     if (startDate && endDate) {
//       inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
//     }
//   }

//   return inputData;
// }


import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const CategoryEditSchema = zod.object({
  categoryName: zod.string().min(1, { message: 'Category name is required!' }),
  categoryImage: zod.any(),
});

// ----------------------------------------------------------------------

export function CategoryEditForm({ currentCategory, open, onClose, onUpdateCategory }) {
  const [previewImage, setPreviewImage] = useState(currentCategory?.categoryImage || '');

  const defaultValues = useMemo(
    () => ({
      categoryName: currentCategory?.categoryName || '',
      categoryImage: '',
    }),
    [currentCategory]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(CategoryEditSchema),
    defaultValues,
  });

  const {
    setValue,
  } = methods;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue('categoryImage', file);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={{}}>
        <DialogTitle>Edit Category</DialogTitle>

        <DialogContent>
          <Box display="flex" gap={2} mt={2} alignItems="center">
            <Stack direction="column" spacing={2} alignItems="center">
              <Avatar
                src={previewImage}
                sx={{ width: 70, height: 70, borderRadius: '50%' }}
              />
              <Button component="label" variant="contained">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>

              {previewImage && (
                <IconButton color="error" onClick={() => setPreviewImage('')}>
                  <Iconify icon="ic:baseline-delete" />
                </IconButton>
              )}
            </Stack>
            <Field.Text name="categoryName" label="Category Name" sx={{ flex: 1 }} />
          </Box>

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}


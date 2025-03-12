import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Menu, MenuItem, Box } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { useGetProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';
import api from 'src/utils/api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLiveCounterMeals } from 'src/utils/Redux/slices/liveCounterMeals';
import { fetchRepeatingMeals } from 'src/utils/Redux/slices/dailyMealsSlice';
import { fetchQuickMeals } from 'src/utils/Redux/slices/quickMealSlice';
import { LoadingScreen } from 'src/components/loading-screen';

import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableFiltersResult } from '../product-table-filters-result';
import { FileManagerNewFolderDialog } from '../product-new-category-dialog';
import { RenderCellPrice, RenderCellPublish, RenderCellProduct } from '../product-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'nonVeg', label: 'Non Veg' },
  { value: 'veg', label: 'Veg' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ProductListView() {
  const dispatch = useDispatch();

  const confirmRows = useBoolean();

  const router = useRouter();

  const upload = useBoolean();

  const filters = useSetState({ publish: [], stock: [] });

  const [tableData, setTableData] = useState([]);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [selectedMenu, setSelectedMenu] = useState('quick');

  const { liveCounterMeals, loading: liveCounterLoading } = useSelector(
    (state) => state.liveCounterMeals
  );
  const { repeatingMeals, loading: repeatingMealsLoading } = useSelector(
    (state) => state.repeatingMeals
  );
  const { quickMeals, loading: quickMealsLoading } = useSelector((state) => state.quickMeals);

  const MENU_LABELS = {
    quick: 'Upgraded Meal',
    repeating: 'Daily Meal',
    liveCounter: 'Live Counter',
  };

  const { token } = useSelector((state) => state.superAdminAuth);

  const superAdminRoutes = {
    deleteQuickMeal: (id) => `/superAdmin/delete_quick_meal/${id}`,
    deleteRepeatingMeal: (id) => `/superAdmin/delete_repeating_meal/${id}`,
    deleteLiveCounterMeal: (id) => `/superAdmin/delete_live_counter_meal/${id}`,
  };

  const handleDeleteRow = useCallback((id) => {
    setConfirmDelete({ open: true, id });
    // console.log(selectedMenu, id);
    // console.log(confirmDelete);
  }, []);

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      let editRoute;

      if (selectedMenu === 'repeating') {
        editRoute = `${paths.dashboard.product.dailyedit}/${id}`;
      } else if (selectedMenu === 'liveCounter') {
        editRoute = `${paths.dashboard.product.liveedit}/${id}`;
      } else if (selectedMenu === 'quick') {
        editRoute = `${paths.dashboard.product.quickedit}/${id}`;
      }

      if (editRoute) {
        router.push(editRoute);
      } else {
        console.error('Invalid selectedMenu:', selectedMenu);
      }
    },
    [router, selectedMenu]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const columns = [
    {
      field: 'meal_id',
      headerName: 'Meal ID',
      width: 100,
      hideable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },

    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'type',
      headerName: 'Meal Type',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: PUBLISH_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      field: 'is_subsidised',
      headerName: 'Subsidised',
      width: 130,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.id)} // Trigger confirmation
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [masterMenuAnchorEl, setMasterMenuAnchorEl] = useState(null);
  const masterMenuOpen = Boolean(masterMenuAnchorEl);

  const handleMasterMenuClick = (event) => {
    setMasterMenuAnchorEl(event.currentTarget); // Opens dropdown
  };

  const handleMasterMenuClose = () => {
    setMasterMenuAnchorEl(null); // Closes dropdown
  };

  const handleMenuItemClick = (menuType) => {
    setSelectedMenu(menuType); // Stores clicked menu type
    setMasterMenuAnchorEl(null); // Closes dropdown after selection
  };

  // useEffect(() => {
  //   console.log(selectedMenu);
  // }, [selectedMenu]);

  useEffect(() => {
    dispatch(fetchLiveCounterMeals());
    dispatch(fetchRepeatingMeals());
    dispatch(fetchQuickMeals());
  }, [dispatch]);

  useEffect(() => {
    const formatAndSortMeals = (meals) =>
      meals?.length
        ? meals
            .map((meal) => ({
              ...meal,
              id: meal.meal_id, // Assign meal_id as id
              image: JSON.parse(meal.image)?.url || '', // Extract image URL
              categoryName: meal.category?.name || 'Uncategorized', // Handle category name
              createdAt: meal.createdAt ? new Date(meal.createdAt) : null, // Convert to Date object for sorting
            }))
            .sort((a, b) => (b.createdAt && a.createdAt ? b.createdAt - a.createdAt : 0)) // Sort by latest
            .map(({ createdAt, ...meal }) => meal) // Remove createdAt from display
        : [];

    if (selectedMenu === 'quick') {
      setTableData(formatAndSortMeals(quickMeals));
    } else if (selectedMenu === 'repeating') {
      setTableData(formatAndSortMeals(repeatingMeals));
    } else if (selectedMenu === 'liveCounter') {
      setTableData(formatAndSortMeals(liveCounterMeals));
    }
  }, [selectedMenu, quickMeals, repeatingMeals, liveCounterMeals]);

  // const confirmDeleteRow = async () => {
  //   if (confirmDelete.id !== null) {
  //     setTableData((prevData) => prevData.filter((row) => row.id !== confirmDelete.id));
  //     toast.success('Delete success!');
  //   }
  //   setConfirmDelete({ open: false, id: null });
  // };
  const confirmDeleteRow = async () => {
    if (confirmDelete.id !== null) {
      let deleteRoute;

      // Determine the appropriate delete route based on selectedMenu
      if (selectedMenu === 'quick') {
        deleteRoute = superAdminRoutes.deleteQuickMeal(confirmDelete.id);
      } else if (selectedMenu === 'repeating') {
        deleteRoute = superAdminRoutes.deleteRepeatingMeal(confirmDelete.id);
      } else if (selectedMenu === 'liveCounter') {
        deleteRoute = superAdminRoutes.deleteLiveCounterMeal(confirmDelete.id);
      }

      if (deleteRoute) {
        try {
          // Make the API call using Axios instance with token in headers
          const response = await api.delete(deleteRoute, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Remove the deleted row from table data
          setTableData((prevData) => prevData.filter((row) => row.id !== confirmDelete.id));
          toast.success('Delete success!');
          // console.log(response);
        } catch (error) {
          console.error('Error deleting meal:', error);
          toast.error(error.msg);
        }
      }

      // Close confirmation dialog
      setConfirmDelete({ open: false, id: null });
    }
  };

  if (quickMealsLoading || liveCounterLoading || repeatingMealsLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Master Menu"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Menu', href: paths.dashboard.product.root },
            { name: 'List' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Iconify icon="lets-icons:arrow-drop-down-big" />}
                onClick={handleMasterMenuClick} // Opens dropdown menu
              >
                Master Menu Meal Type - {MENU_LABELS[selectedMenu] || 'Select'}
              </Button>

              <Menu
                anchorEl={masterMenuAnchorEl}
                open={masterMenuOpen}
                onClose={handleMasterMenuClose}
              >
                <Box sx={{ width: '20vh' }}>
                  <MenuItem onClick={() => handleMenuItemClick('quick')}>Upgraded Meal</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('repeating')}>Daily Meal</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('liveCounter')}>
                    Live Counter
                  </MenuItem>
                </Box>
              </Menu>

              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                component={RouterLink}
                href={paths.dashboard.product.guest}
              >
                Add Guest Menu
              </Button>

              {/* <Button
                onClick={upload.onTrue}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Categories
              </Button> */}

              <Button
                // component={RouterLink}
                // href={paths.dashboard.product.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleClick}
                endIcon={<Iconify icon="lets-icons:arrow-drop-down-big" />}
              >
                New Meal
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <Box sx={{ width: '10.5vw' }}>
                  <MenuItem component={RouterLink} href={paths.dashboard.product.new}>
                    Upgraded Meal
                  </MenuItem>
                  <MenuItem component={RouterLink} href={paths.dashboard.product.daily}>
                    Daily Meal
                  </MenuItem>
                  <MenuItem component={RouterLink} href={paths.dashboard.product.live}>
                    Live Counter
                  </MenuItem>
                </Box>
              </Menu>
            </Stack>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: '85vh', md: '90vh' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            getRowId={(row) => row.meal_id} // Assign meal_id as id
            // checkboxSelection
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            // loading={productsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

      <ConfirmDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        title="Delete"
        content={<>Are you sure want to delete</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteRow} // Call function to delete row
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}) {
  return (
    <>
      <GridToolbarContainer>
        <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        />

        <GridToolbarQuickFilter />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }

  return inputData;
}

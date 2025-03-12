import { useRef, useState, useEffect, useCallback } from 'react';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  rectIntersection,
  getFirstCollision,
  MeasuringStrategy,
} from '@dnd-kit/core';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { hideScrollY } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { moveTask, moveColumn, useGetBoard } from 'src/actions/kanban';
import { useDispatch, useSelector } from 'react-redux';
import { Iconify } from 'src/components/iconify';
import { fetchLiveCounterMeals } from 'src/utils/Redux/slices/liveCounterMeals';
import { fetchRepeatingMeals } from 'src/utils/Redux/slices/dailyMealsSlice';
import { fetchQuickMeals } from 'src/utils/Redux/slices/quickMealSlice';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from 'src/locales';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';

import { kanbanClasses } from '../classes';
import { coordinateGetter } from '../utils';
import { KanbanColumn } from '../column/kanban-column';
import { KanbanTaskItem } from '../item/kanban-task-item';
import { KanbanColumnAdd } from '../column/kanban-column-add';
import { KanbanColumnSkeleton } from '../components/kanban-skeleton';
import { KanbanDragOverlay } from '../components/kanban-drag-overlay';

// ----------------------------------------------------------------------

const PLACEHOLDER_ID = 'placeholder';

const cssVars = {
  '--item-gap': '16px',
  '--item-radius': '12px',
  '--column-gap': '24px',
  '--column-width': '336px',
  '--column-radius': '16px',
  '--column-padding': '20px 16px 16px 16px',
};

// ----------------------------------------------------------------------

export function KanbanView() {
  /**
   * My codes
   */

  const dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState('quick');
  const { token } = useSelector((state) => state.superAdminAuth);
  const [selectedLocation, setSelectedLocation] = useState('');

  const [masterMenuAnchorEl, setMasterMenuAnchorEl] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);

  const [showDateSelector, setShowDateSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(null);
  const [masterMenuMeals, setMasterMenuMeals] = useState([]);

  const { liveCounterMeals, loading: liveCounterLoading } = useSelector(
    (state) => state.liveCounterMeals
  );
  const { repeatingMeals, loading: repeatingMealsLoading } = useSelector(
    (state) => state.repeatingMeals
  );
  const { quickMeals, loading: quickMealsLoading } = useSelector((state) => state.quickMeals);

  useEffect(() => {
    if (selectedMenu === 'quick') {
      setMasterMenuMeals(quickMeals);
    } else if (selectedMenu === 'repeating') {
      setMasterMenuMeals(repeatingMeals);
    } else if (selectedMenu === 'liveCounter') {
      setMasterMenuMeals(liveCounterMeals);
    } else {
      setMasterMenuMeals([]); // Empty if no valid selection
    }
  }, [selectedMenu, quickMeals, repeatingMeals, liveCounterMeals]);

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

  const handleLocationMenuClick = (event) => {
    setLocationAnchorEl(event.currentTarget);
  };

  // Close Menu Handler
  const handleLocationMenuClose = () => {
    setLocationAnchorEl(null);
  };

  // Handle Location Selection
  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
    handleLocationMenuClose();
  };
  const { locations } = useSelector((state) => state.companyLocations);

  const MENU_LABELS = {
    quick: 'Upgraded Meal',
    repeating: 'Daily Meal',
    liveCounter: 'Live Counter',
  };

  useEffect(() => {
    dispatch(fetchLiveCounterMeals());
    dispatch(fetchRepeatingMeals());
    dispatch(fetchQuickMeals());
  }, [dispatch]);

  // useEffect(() => {
  //   console.log(selectedMenu);
  //   console.log(selectedLocation);
  //   console.log(selectedDate);
  //   console.log(selectedWeekNumber);
  // }, [selectedMenu, selectedLocation, selectedDate, selectedWeekNumber]);

  /**
   * kit code
   */
  const { board, boardLoading, boardEmpty } = useGetBoard();

  const [columnFixed, setColumnFixed] = useState(true);

  const recentlyMovedToNewContainer = useRef(false);

  const lastOverId = useRef(null);

  const [activeId, setActiveId] = useState(null);

  // const columnIds = board.columns.map((column) => column.id);
  const locationColumns =
    locations.find((loc) => loc.location_id === selectedLocation)?.locationMealTime || [];
  const columnIds = ['master-menu', ...locationColumns]; // Master Menu + Meal Time Columns

  const isSortingContainer = activeId ? columnIds.includes(activeId) : false;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeId && activeId in board.tasks) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (column) => column.id in board.tasks
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);

      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in board.tasks) {
          const columnItems = board.tasks[overId].map((task) => task.id);

          // If a column is matched and it contains items (columns 'A', 'B', 'C')
          if (columnItems.length > 0) {
            // Return the closest droppable within that column
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (column) => column.id !== overId && columnItems.includes(column.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new column, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new column, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, board?.tasks]
  );

  const findColumn = (id) => {
    if (id in board.tasks) {
      return id;
    }

    return Object.keys(board.tasks).find((key) =>
      board.tasks[key].map((task) => task.id).includes(id)
    );
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, []);

  /**
   * onDragStart
   */
  const onDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  /**
   * onDragOver
   */
  const onDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (!overId || active.id in board.tasks) {
      return;
    }

    const overColumn = findColumn(overId);
    const activeColumn = findColumn(active.id);

    if (!overColumn || !activeColumn) {
      return;
    }

    const isFirstColumn = columnIds.indexOf(activeColumn) === 0; // Check if it's the first column

    if (!isFirstColumn && activeColumn === overColumn) {
      return; // No need to move within the same column
    }

    const activeItems = board.tasks[activeColumn]?.map((task) => task.id) || [];
    const overItems = board.tasks[overColumn]?.map((task) => task.id) || [];
    const overIndex = overItems.indexOf(overId);
    const activeIndex = activeItems.indexOf(active.id);

    let newIndex = overItems.length; // Default to last index

    if (overItems.includes(overId)) {
      const isBelowOverItem = active.rect.top > over.rect.top + over.rect.height / 2;
      newIndex = isBelowOverItem ? overIndex + 1 : overIndex;
    }

    // Prevent unnecessary state updates
    if (recentlyMovedToNewContainer.current) {
      return;
    }

    recentlyMovedToNewContainer.current = true;

    const updatedTasks = {
      ...board.tasks,
      [activeColumn]: isFirstColumn
        ? board.tasks[activeColumn] // Keep original column unchanged
        : board.tasks[activeColumn].filter((task) => task.id !== active.id),
      [overColumn]: [
        ...board.tasks[overColumn].slice(0, newIndex),
        {
          ...board.tasks[activeColumn][activeIndex],
          id: isFirstColumn ? `copy-${active.id}-${Date.now()}` : active.id,
        },
        ...board.tasks[overColumn].slice(newIndex),
      ],
    };

    moveTask(updatedTasks, activeColumn, overColumn, active.id, isFirstColumn);
  };

  /**
   * onDragEnd
   */
  const onDragEnd = ({ active, over }) => {
    if (!over?.id) {
      setActiveId(null);
      return;
    }

    const activeColumn = findColumn(active.id);
    const overColumn = findColumn(over.id);

    if (!activeColumn || !overColumn) {
      setActiveId(null);
      return;
    }

    const isFirstColumn = columnIds.indexOf(activeColumn) === 0; // Check if it's the first column

    // If dragging a column, move the column
    if (columnIds.includes(active.id)) {
      const activeIndex = columnIds.indexOf(active.id);
      const overIndex = columnIds.indexOf(over.id);

      if (activeIndex !== overIndex) {
        const updateColumns = arrayMove(board.columns, activeIndex, overIndex);
        moveColumn(updateColumns);
      }
    } else {
      // Task movement logic
      const activeContainerTaskIds = board.tasks[activeColumn].map((task) => task.id);
      const overContainerTaskIds = board.tasks[overColumn]?.map((task) => task.id) || [];

      const activeIndex = activeContainerTaskIds.indexOf(active.id);
      const overIndex = overContainerTaskIds.indexOf(over.id);

      // Ensure the task is actually being moved
      if (activeColumn !== overColumn || activeIndex !== overIndex) {
        moveTask(board.tasks, activeColumn, overColumn, active.id, isFirstColumn, true);
      }
    }

    setActiveId(null);
  };

  const renderLoading = (
    <Stack direction="row" alignItems="flex-start" sx={{ gap: 'var(--column-gap)' }}>
      <KanbanColumnSkeleton />
    </Stack>
  );

  const renderEmpty = <EmptyContent filled sx={{ py: 10, maxHeight: { md: 480 } }} />;

  const renderList = (
    <DndContext
      id="dnd-kanban"
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Stack sx={{ flex: '1 1 auto', overflowX: 'auto' }}>
        <Stack
          sx={{
            pb: 3,
            display: 'unset',
            ...(columnFixed && { minHeight: 0, display: 'flex', flex: '1 1 auto' }),
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 'var(--column-gap)',
              ...(columnFixed && {
                minHeight: 0,
                flex: '1 1 auto',
                [`& .${kanbanClasses.columnList}`]: { ...hideScrollY, flex: '1 1 auto' },
              }),
            }}
          >
            <SortableContext
              items={[...columnIds, PLACEHOLDER_ID]}
              strategy={horizontalListSortingStrategy}
            >
              {columnIds.map((columnId, index) => (
                <KanbanColumn
                  key={columnId}
                  column={{
                    id: columnId,
                    name: columnId === 'master-menu' ? 'Master Menu' : columnId,
                  }}
                  columnIndex={index}
                  tasks={columnId === 'master-menu' ? masterMenuMeals : board.tasks[columnId] || []}
                >
                  <SortableContext
                    items={
                      columnId === 'master-menu' ? masterMenuMeals : board.tasks[columnId] || []
                    }
                    strategy={verticalListSortingStrategy}
                  >
                    {(columnId === 'master-menu'
                      ? masterMenuMeals
                      : board.tasks[columnId] || []
                    ).map((task) => (
                      <KanbanTaskItem
                        task={task}
                        key={task.id}
                        columnId={columnId}
                        disabled={isSortingContainer}
                      />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              ))}

              {/* <KanbanColumnAdd id={PLACEHOLDER_ID} /> */}
            </SortableContext>
          </Stack>
        </Stack>
      </Stack>

      <KanbanDragOverlay
        columns={columnIds}
        tasks={board?.tasks}
        activeId={activeId}
        sx={cssVars}
      />
    </DndContext>
  );

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        ...cssVars,
        pb: 0,
        pl: { sm: 3 },
        pr: { sm: 0 },
        flex: '1 1 0',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      {/* Stack for the title (Separate Line) */}
      <Stack sx={{ pr: { sm: 3 }, mb: { xs: 3, md: 2 } }}>
        <Typography variant="h4">Company Meal</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="lets-icons:arrow-drop-down-big" />}
          onClick={handleMasterMenuClick} // Opens dropdown menu
        >
          Master Menu Meal Type - {MENU_LABELS[selectedMenu] || 'Select'}
        </Button>

        <Menu anchorEl={masterMenuAnchorEl} open={masterMenuOpen} onClose={handleMasterMenuClose}>
          <Box sx={{ width: '20vh' }}>
            <MenuItem onClick={() => handleMenuItemClick('quick')}>Upgraded Meal</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('repeating')}>Daily Meal</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('liveCounter')}>Live Counter</MenuItem>
          </Box>
        </Menu>

        {/* Location Selection Dropdown */}
        <Button
          variant="contained"
          startIcon={<Iconify icon="lets-icons:arrow-drop-down-big" />}
          onClick={handleLocationMenuClick}
        >
          Select Location -{' '}
          {selectedLocation
            ? locations.find((loc) => loc.location_id === selectedLocation)?.locationName
            : 'Choose'}
        </Button>

        <Menu
          anchorEl={locationAnchorEl}
          open={Boolean(locationAnchorEl)}
          onClose={handleLocationMenuClose}
        >
          <Box sx={{ width: '20vh' }}>
            {locations.map((location) => (
              <MenuItem
                key={location.location_id}
                onClick={() => handleLocationSelect(location.location_id)}
              >
                {location.locationName}
              </MenuItem>
            ))}
          </Box>
        </Menu>

        {/* Date or Week Selector */}
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Button variant="contained" onClick={() => setShowDateSelector(!showDateSelector)}>
            {selectedMenu === 'repeating' ? 'Select Week Number' : 'Select Date'}
          </Button>

          {showDateSelector && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 10,
                mt: 1,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 1,
                p: 2,
                right: 18,
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: '0.5em', ml: 4, mt: 2 }}>
                {selectedMenu === 'repeating' ? 'Select Week Number' : 'Date'}
              </Typography>
              {selectedMenu === 'repeating' ? (
                <Scrollbar sx={{ maxHeight: 310, overflowY: 'auto', p: 2, width: '20vw' }}>
                  <Stack direction="column">
                    {[...Array(52)].map((_, index) => {
                      const weekNumber = index + 1;
                      const currentWeek = dayjs().week();
                      if (weekNumber < currentWeek) return null;
                      const weekStart = dayjs()
                        .week(weekNumber)
                        .startOf('week')
                        .add(1, 'day')
                        .format('MMM D');
                      const weekEnd = dayjs()
                        .week(weekNumber)
                        .endOf('week')
                        .add(1, 'day')
                        .format('MMM D');

                      return (
                        <Button
                          key={weekNumber}
                          variant={selectedWeekNumber === weekNumber ? 'contained' : 'outlined'}
                          onClick={() => {
                            setSelectedWeekNumber(weekNumber);
                            setShowDateSelector(false); // Close dropdown after selection
                          }}
                          sx={{ mb: 1 }}
                        >
                          Week {weekNumber} ({weekStart} - {weekEnd})
                        </Button>
                      );
                    })}
                  </Stack>
                </Scrollbar>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={selectedDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
                        setSelectedDate(formattedDate);
                        setShowDateSelector(false); // Close dropdown after selection
                      }
                    }}
                  />
                </LocalizationProvider>
              )}
            </Box>
          )}
        </Box>
      </Stack>

      {boardLoading ? renderLoading : <>{boardEmpty ? renderEmpty : renderList}</>}
    </DashboardContent>
  );
}

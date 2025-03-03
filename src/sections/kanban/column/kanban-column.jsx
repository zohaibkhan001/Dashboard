import { useCallback } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';

import { useBoolean } from 'src/hooks/use-boolean';

import { createTask, clearColumn, deleteColumn, updateColumn } from 'src/actions/kanban';

import { toast } from 'src/components/snackbar';

import ColumnBase from './column-base';
import { KanbanColumnToolBar } from './kanban-column-toolbar';

// ----------------------------------------------------------------------

export function KanbanColumn({ children, column, columnIndex, tasks, disabled, sx }) {
  const openAddTask = useBoolean();

  const { attributes, isDragging, listeners, setNodeRef, transition, active, over, transform } =
    useSortable({
      id: column.id,
      data: { type: 'container', children: tasks },
      animateLayoutChanges,
    });

  const tasksIds = tasks.map((task) => task.id);

  const isOverContainer = over
    ? (column.id === over.id && active?.data.current?.type !== 'container') ||
      tasksIds.includes(over.id)
    : false;

  const handleUpdateColumn = useCallback(
    async (columnName) => {
      try {
        if (column.name !== columnName) {
          updateColumn(column.id, columnName);

          toast.success('Update success!', { position: 'top-center' });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [column.id, column.name]
  );

  const handleClearColumn = useCallback(async () => {
    try {
      clearColumn(column.id);
    } catch (error) {
      console.error(error);
    }
  }, [column.id]);

  const handleDeleteColumn = useCallback(async () => {
    try {
      deleteColumn(column.id);

      toast.success('Delete success!', { position: 'top-center' });
    } catch (error) {
      console.error(error);
    }
  }, [column.id]);

  const isFirstColumn = columnIndex === 0;

  return (
    <ColumnBase
      ref={isFirstColumn ? undefined : setNodeRef} // Prevent dragging for the first column
      sx={{ 
        transition, 
        transform: isFirstColumn ? 'none' : CSS.Translate.toString(transform), 
        backgroundColor: isFirstColumn ? '#FFF5E0' : '#F3F6F8',
        ...sx 
      }}
      stateProps={{
        dragging: !isFirstColumn && isDragging,
        hover: !isFirstColumn && isOverContainer, 
        handleProps: isFirstColumn ? {} : { ...attributes, ...listeners }, // Disable drag handle
      }}
      slots={{
        header: (
          <KanbanColumnToolBar
            isFirstColumn={isFirstColumn}
            handleProps={isFirstColumn ? {} : { ...attributes, ...listeners }}
            totalTasks={tasks.length}
            columnName={isFirstColumn ? 'Master Menu' : column.name}
            onUpdateColumn={isFirstColumn ? undefined : handleUpdateColumn}
            onClearColumn={isFirstColumn ? undefined : handleClearColumn}
            onDeleteColumn={isFirstColumn ? undefined : handleDeleteColumn}
            onToggleAddTask={isFirstColumn ? undefined : openAddTask.onToggle}
          />
        ),
        main: <>{children}</>,
        // action: !isFirstColumn && ( 
        //   <KanbanTaskAdd
        //     status={column.name}
        //     openAddTask={openAddTask.value}
        //     onAddTask={handleAddTask}
        //     onCloseAddTask={openAddTask.onFalse}
        //   />
        // ),
      }}
    />
  );

  
}

// ----------------------------------------------------------------------

const animateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

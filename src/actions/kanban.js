import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const KANBAN_ENDPOINT = endpoints.kanban;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR(KANBAN_ENDPOINT, fetcher, swrOptions);

  // console.log("Fetched board data:", data);

  const memoizedValue = useMemo(() => {
    const tasks = data?.board.tasks ?? {};
    // const columns = data?.board.columns ?? [];
    const columns = (data?.board?.columns ?? []).filter(
      (column) =>
        column.name !== 'In progress' && column.name !== 'Ready to test' && column.name !== 'Done' // Remove specific columns
    );

    return {
      board: { tasks, columns },
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !columns.length,
    };
  }, [data?.board.columns, data?.board.tasks, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // add new column in board.columns
      const columns = [...board.columns, columnData];

      // add new task in board.tasks
      const tasks = { ...board.tasks, [columnData.id]: [] };

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId, columnName) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, columnName };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      const columns = board.columns.map((column) =>
        column.id === columnId
          ? {
              // Update data when found
              ...column,
              name: columnName,
            }
          : column
      );

      return { ...currentData, board: { ...board, columns } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveColumn(updateColumns) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      return { ...currentData, board: { ...board, columns: updateColumns } };
    },
    false
  );

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateColumns };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-column' } });
  }
}

// ----------------------------------------------------------------------

export async function clearColumn(columnId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'clear-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // remove all tasks in column
      const tasks = { ...board.tasks, [columnId]: [] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // delete column in board.columns
      const columns = board.columns.filter((column) => column.id !== columnId);

      // delete tasks by column deleted
      const tasks = Object.keys(board.tasks)
        .filter((key) => key !== columnId)
        .reduce((obj, key) => {
          obj[key] = board.tasks[key];
          return obj;
        }, {});

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createTask(columnId, taskData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // add task in board.tasks
      const tasks = { ...board.tasks, [columnId]: [taskData, ...board.tasks[columnId]] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateTask(columnId, taskData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // tasks in column
      const tasksInColumn = board.tasks[columnId];

      // find and update task
      const updateTasks = tasksInColumn.map((task) =>
        task.id === taskData.id
          ? {
              // Update data when found
              ...task,
              ...taskData,
            }
          : task
      );

      const tasks = { ...board.tasks, [columnId]: updateTasks };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

// export async function moveTask(updateTasks) {
//   /**
//    * Work in local
//    */
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       const { board } = currentData;

//       // update board.tasks
//       const tasks = updateTasks;

//       return { ...currentData, board: { ...board, tasks } };
//     },
//     false
//   );

//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { updateTasks };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-task' } });
//   }
// }

// export async function moveTask(updateTasks, fromColumn, toColumn, taskId, isFirstColumn) {
//   /**
//    * Work in local
//    */
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       const { board } = currentData;
//       const tasks = { ...board.tasks };

//       if (isFirstColumn) {
//         // Copy task instead of moving it
//         const taskToCopy = tasks[fromColumn]?.find((task) => task.id === taskId);

//         if (taskToCopy && !tasks[toColumn]?.some((task) => task.id.startsWith(`copy-${taskId}`))) {
//           // Create a unique copy
//           const copiedTask = { ...taskToCopy, id: `copy-${taskId}-${Date.now()}` };
//           tasks[toColumn] = [...(tasks[toColumn] || []), copiedTask];
//         }
//       } else {
//         // Move task: remove from old column and add to new column
//         const taskToMove = tasks[fromColumn]?.find((task) => task.id === taskId);

//         if (taskToMove) {
//           tasks[fromColumn] = tasks[fromColumn].filter((task) => task.id !== taskId);
//           tasks[toColumn] = [...(tasks[toColumn] || []), taskToMove];
//         }
//       }

//       return { ...currentData, board: { ...board, tasks } };
//     },
//     false
//   );

//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { updateTasks, fromColumn, toColumn, taskId, isFirstColumn };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-task' } });
//   }
// }

// export async function moveTask(updateTasks, fromColumn, toColumn, taskId, isFirstColumn) {
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       if (!currentData || !currentData.board) return currentData;

//       const { board } = currentData;
//       const tasks = { ...board.tasks };

//       // Ensure columns exist
//       if (!tasks[fromColumn] || !tasks[toColumn]) return currentData;

//       // Find the task to move
//       const taskToMoveIndex = tasks[fromColumn].findIndex((task) => task.id === taskId);
//       if (taskToMoveIndex === -1) return currentData; // Task not found, avoid crashes

//       const taskToMove = tasks[fromColumn][taskToMoveIndex];

//       if (fromColumn === toColumn) return currentData; // Ignore if dragged within the same column

//       if (isFirstColumn) {
//         // Prevent multiple copies
//         const alreadyCopied = tasks[toColumn].some((task) => task.originalId === taskId);
//         if (!alreadyCopied) {
//           const copiedTask = { ...taskToMove, id: `copy-${taskId}-${Date.now()}`, originalId: taskId };
//           tasks[toColumn] = [...tasks[toColumn], copiedTask];
//         }
//       } else {
//         // Move task: remove from old column and add to new column
//         tasks[fromColumn] = tasks[fromColumn].filter((task) => task.id !== taskId);
//         tasks[toColumn] = [...tasks[toColumn], taskToMove];
//       }

//       return { ...currentData, board: { ...board, tasks } };
//     },
//     false
//   );

//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { updateTasks, fromColumn, toColumn, taskId, isFirstColumn };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-task' } });
//   }
// }

export async function moveTask(
  updateTasks,
  fromColumn,
  toColumn,
  taskId,
  isFirstColumn,
  isDropped
) {
  // Only proceed if the item was actually dropped
  if (!isDropped) return;

  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      if (!currentData || !currentData.board) return currentData;

      const { board } = currentData;
      const tasks = { ...board.tasks };

      // Ensure columns exist
      if (!tasks[fromColumn] || !tasks[toColumn]) return currentData;

      // Find the task to move
      const taskToMoveIndex = tasks[fromColumn].findIndex((task) => task.id === taskId);
      if (taskToMoveIndex === -1) return currentData; // Task not found, avoid crashes

      const taskToMove = tasks[fromColumn][taskToMoveIndex];

      if (fromColumn === toColumn) return currentData; // Ignore if dragged within the same column

      if (isFirstColumn) {
        // Prevent multiple copies
        const alreadyCopied = tasks[toColumn].some((task) => task.originalId === taskId);
        if (!alreadyCopied) {
          const copiedTask = {
            ...taskToMove,
            id: `copy-${taskId}-${Date.now()}`,
            originalId: taskId,
          };
          tasks[toColumn] = [...tasks[toColumn], copiedTask];
        }
      } else {
        // Move task: remove from old column and add to new column
        tasks[fromColumn] = tasks[fromColumn].filter((task) => task.id !== taskId);
        tasks[toColumn] = [...tasks[toColumn], taskToMove];
      }

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateTasks, fromColumn, toColumn, taskId, isFirstColumn };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-task' } });
  }
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId, taskId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // delete task in column
      const tasks = {
        ...board.tasks,
        [columnId]: board.tasks[columnId].filter((task) => task.id !== taskId),
      };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Select, MenuItem } from "@mui/material";

import { useBoolean } from 'src/hooks/use-boolean';

import { uuidv4 } from 'src/utils/uuidv4';

import { createColumn } from 'src/actions/kanban';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function KanbanColumnAdd({ sx, ...other }) {
  const [columnName, setColumnName] = useState('');


  const openAddColumn = useBoolean();

  const handleChangeName = useCallback((event) => {
    setColumnName(event.target.value);
  }, []);

  const handleCreateColumn = useCallback(async () => {
    try {
      setColumnName((prevColumnName) => {
        const columnData = {
          id: uuidv4(),
          name: prevColumnName.trim() ? prevColumnName : "Untitled"
        };

        createColumn(columnData);

        return ""; // Reset column name
      });

      openAddColumn.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [openAddColumn]);



  const handleKeyUpCreateColumn = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleCreateColumn();
      }
    },
    [handleCreateColumn]
  );

  const handleCancel = useCallback(() => {
    setColumnName('');
    openAddColumn.onFalse();
  }, [openAddColumn]);

  return (
    <>
      <Box sx={{ width: 'var(--column-width)', flex: '0 0 auto', ...sx }} {...other}>
        {openAddColumn.value ? (
          <Box>
            <Select
              fullWidth
              value={columnName}
              onChange={(event) => {
                setColumnName(event.target.value);
                handleCreateColumn();
              }}
              onClose={() => {
                if (!columnName) handleCancel();
              }}
              displayEmpty
              sx={{ typography: "h6" }}
            >
              <MenuItem value="" disabled>
                Select Meal Type
              </MenuItem>
              <MenuItem value="Breakfast">Breakfast</MenuItem>
              <MenuItem value="Lunch">Lunch</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
              <MenuItem value="Dinner">Dinner</MenuItem>
            </Select>
          </Box>
        ) : (
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" sx={{ mr: -0.5 }} />}
            onClick={openAddColumn.onTrue}
          >
            Add column
          </Button>
        )}
      </Box>

      <Box sx={{ width: '1px', flexShrink: 0 }} />
    </>
  );
}

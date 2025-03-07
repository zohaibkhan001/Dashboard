import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function ProductOptions({
  title,
  subheader,
  list = [],
  selected = [],
  onSelectionChange,
  ...other
}) {
  // Debugging: Ensure list has data
  // console.log(`Rendering ${title}:`, list);

  // Handle checkbox toggle
  const handleClickComplete = (optionId) => {
    const updatedSelection = selected.includes(optionId)
      ? selected.filter((id) => id !== optionId) // Remove if already selected
      : [...selected, optionId]; // Add if not selected

    onSelectionChange(updatedSelection); // Notify parent component
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />
      <Scrollbar sx={{ height: 304, overflowX: 'hidden' }}>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} sx={{ minWidth: 360 }}>
          {list.length > 0 ? (
            list.map((item) => (
              <Item
                key={item.id}
                item={item}
                checked={selected.includes(item.id)}
                onChange={() => handleClickComplete(item.id)}
              />
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>No data available</Box>
          )}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

function Item({ item, checked, onChange }) {
  return (
    <Box sx={{ pl: 2, pr: 1, py: 1.5, display: 'flex' }}>
      <FormControlLabel
        control={
          <Checkbox
            disableRipple
            checked={checked}
            onChange={onChange}
            inputProps={{
              name: item.name,
              'aria-label': item.name,
            }}
          />
        }
        label={item.name}
        sx={{ flexGrow: 1, m: 0 }}
      />
    </Box>
  );
}

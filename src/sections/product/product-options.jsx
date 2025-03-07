import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function ProductOptions({ title, subheader, list, ...other }) {
  const [selected, setSelected] = useState(['2']);

  const handleClickComplete = (optionId) => {
    const optionChecked = selected.includes(optionId)
      ? selected.filter((value) => value !== optionId)
      : [...selected, optionId];

    setSelected(optionChecked);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />
      <Scrollbar sx={{ height: 304, overflowX: 'hidden' }}>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} sx={{ minWidth: 360 }}>
          {list.map((item) => (
            <Item
              key={item.id}
              item={item}
              checked={selected.includes(item.id)}
              onChange={() => handleClickComplete(item.id)}
            />
          ))}
        </Stack>
      </Scrollbar>

    </Card>
  );
}

function Item({ item, checked, onChange, sx, ...other }) {
  return (
    <Box
      sx={{
        pl: 2,
        pr: 1,
        py: 1.5,
        display: 'flex',
        ...sx,
      }}
      {...other}
    >
      <FormControlLabel
        control={
          <Checkbox
            disableRipple
            checked={checked}
            onChange={onChange}
            inputProps={{
              name: item.name,
              'aria-label': 'Checkbox demo',
            }}
          />
        }
        label={item.name}
        sx={{ flexGrow: 1, m: 0 }}
      />
    </Box>
  );
}

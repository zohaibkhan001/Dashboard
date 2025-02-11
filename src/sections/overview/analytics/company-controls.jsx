import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Divider, Switch, FormControlLabel} from '@mui/material';

// ----------------------------------------------------------------------

export function CompanyControls({
  open,
  onClose,
}) {


  const [addMeal, setAddMeal] = useState(false);
const [vegOnly, setVegOnly] = useState(false);
const [exportOrders, setExportOrders] = useState(false);
const [orderGuestMeal, setOrderGuestMeal] = useState(false);

  const renderHead = (
    <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Company Controls
      </Typography>
    </Box>
    
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { invisible: true } }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          width: '25%',
        },
      }}
    >
      {renderHead}

      <Divider/>

        <Stack spacing={2} sx={{ px: 2.5, pb: 5 }}>
          <Box>

            <div style={{display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem'}}>
              <FormControlLabel
        control={
          <Switch 
            checked={addMeal} 
            onChange={() => setAddMeal(!addMeal)} 
          />
          
        }
        label="Add Meal"
      />

<FormControlLabel
        control={
          <Switch 
            checked={vegOnly} 
            onChange={() => setVegOnly(!vegOnly)} 
          />
          
        }
        label="Veg Only"
      />

<FormControlLabel
        control={
          <Switch 
            checked={exportOrders} 
            onChange={() => setExportOrders(!exportOrders)} 
          />
          
        }
        label="Export Orders"
      />

<FormControlLabel
        control={
          <Switch 
            checked={orderGuestMeal} 
            onChange={() => setOrderGuestMeal(!orderGuestMeal)} 
          />
          
        }
        label="Order Guest Meal"
      />
            </div>
          </Box>
          <Divider/>

          <Box style={{display: 'flex', flexDirection: 'column', padding: '0', marginTop: '-1rem'}}>
            <section style={{display: 'flex', flexDirection: 'column'}}>
              <h5 style={{marginBottom: '0.5rem'}}>Order Cutoff Time</h5>
              <TextField variant="outlined" fullWidth type="time" />
            </section>

            <section style={{display: 'flex', flexDirection: 'column'}}>
              <h5 style={{marginBottom: '0.5rem'}}>Subsidy</h5>
              <TextField variant="outlined" fullWidth />
            </section>
          
          </Box>

          <Divider/>

          <Box style={{display: 'flex', flexDirection: 'column', gap: '5rem'}}>

            <section style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <Button
          variant="contained"
          sx={{ width: '45%', 
            fontSize: '0.7rem' }}
        >
          Send Order Details
        </Button>

        <Button
          variant="contained"
          sx={{ width: '45%', fontSize: '0.7rem'}}
        >
          Send Test Mail
        </Button>
        </section>

        <Button
          variant="contained"
          sx={{ width: '100%', fontSize: '0.7rem'}}
        >
          Save Settings
        </Button>  
            </Box>

        </Stack>
    </Drawer>
    
  );
}

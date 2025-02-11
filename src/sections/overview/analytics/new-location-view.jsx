import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export function NewLocationDialog({
  open,
  onClose,
  title = 'Add New Location',
}){

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <TextField sx={{ width: '100%' }} label="Location"> </TextField>
        <TextField sx={{ width: '100%' }} label="Meal Time"> </TextField>
        <TextField sx={{ width: '100%' }} label="Email"> </TextField>
        </div>
      </DialogContent>

      <DialogActions>
      <Button
          variant="contained"
          sx={{ width: '100%' }}
        >
          Add Location
        </Button>
        </DialogActions>
    </Dialog>
  );
}

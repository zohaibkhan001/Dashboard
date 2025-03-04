import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import api from 'src/utils/api';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = 'Add New Categories',
  ...other
}) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { token } = useSelector((state) => state.superAdminAuth);

  const [additionalInfo, setAdditionalInfo] = useState('');

  const onChangeAdditionalInfo = (event) => {
    setAdditionalInfo(event.target.value);
  };

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleUpload = async () => {
    if (!files) {
      alert('No file selected');
      return;
    }
    if (!additionalInfo.trim()) {
      alert('Category name is required');
      return;
    }

    setLoading(true);

    try {
      // **Step 1: Upload the image**
      const formData = new FormData();
      formData.append('file', files);
      files.forEach((file) => {
        formData.append('file', file); // Append each file separately
      });

      const uploadResponse = await api.post('/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log(uploadResponse.data);
      const imageUrl = uploadResponse.data.url; // ✅ Extract image URL

      // **Step 2: Create category**
      const categoryData = {
        name: additionalInfo,
        image: imageUrl,
      };

      await api.post('/superAdmin/create_category', categoryData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Use token
          'Content-Type': 'application/json',
        },
      });

      // alert('Category created successfully!');
      toast.success('Category created successfully!');

      // Reset form
      setAdditionalInfo('');
      setFiles(null);
      onClose(); // Close dialog
    } catch (error) {
      toast.error(error.msg);
      console.error('Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TextField
          fullWidth
          label="Categories"
          value={additionalInfo}
          onChange={onChangeAdditionalInfo}
          sx={{ mb: 3 }}
        />

        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </Button>

        {/* {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )} */}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

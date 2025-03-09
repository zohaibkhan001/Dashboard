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
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Box, IconButton, Typography } from '@mui/material';
import { fetchCategories } from 'src/utils/Redux/slices/categoriesSlice';
import { useLocation } from 'react-router';

// ----------------------------------------------------------------------

export function CategoryEditForm({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = 'Update Category',
  categoryId,
  ...other
}) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const { token } = useSelector((state) => state.superAdminAuth);
  const dispatch = useDispatch();
  const [uploadLoading, setUploadLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  // console.log(categoryId);

  const { categories } = useSelector((state) => state.categories);
  // console.log(categories);

  const [additionalInfo, setAdditionalInfo] = useState('');

  const onChangeAdditionalInfo = (event) => {
    setAdditionalInfo(event.target.value);
  };

  useEffect(() => {
    if (open && categoryId && categories.length > 0) {
      const selectedCategory = categories.find((cat) => cat.category_id === categoryId);

      if (selectedCategory) {
        setAdditionalInfo(selectedCategory.name || '');

        if (selectedCategory.image) {
          setFiles({ name: 'existing-image', preview: selectedCategory.image });
        } else {
          setFiles([]);
        }
      }
    }
  }, [open, categoryId, categories]);

  const handleUpload = async () => {
    if (!additionalInfo.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!categoryId) {
      toast.error('Invalid category ID');
      return;
    }

    setLoading(true);

    try {
      // Use the existing image URL (no reuploading logic here)
      const imageUrl = files?.preview || null;

      // Update category data
      const categoryData = {
        name: additionalInfo,
        image: imageUrl, // Using already uploaded image
      };

      await api.put(`/superAdmin/categories/${categoryId}`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Category updated successfully!');

      // Reset form
      setAdditionalInfo('');
      setFiles(null);
      onClose(); // Close dialog
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Error updating category', error);
      console.error('Error:', error.msg || error.message);
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

  // const validateAndSubmit = () => {
  //   const imageUrl = values.images?.url;

  //   if (!imageUrl) {
  //     toast.error('Please upload an image before submitting!');
  //     return;
  //   }

  //   // If image is present, call handleSubmit
  //   handleSubmit(onSubmit)();
  // };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WEBP).');
      return;
    }

    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    setUploadLoading(true);
    const formDataImage = new FormData();
    formDataImage.append('file', file);

    try {
      const response = await api.post('/upload_file', formDataImage, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setFiles({ name: file.name, preview: response.data.url });
        console.log(response.data);
        toast.success('Image uploaded successfully!');
      } else {
        alert('Image upload failed!');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert(error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // ✅ Remove Image (Clears the Field)
  const handleRemoveImage = () => {
    setFiles(null);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TextField
          fullWidth
          label="Category Name"
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
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Upload Image</Typography>

          {/* Display Uploaded Image */}
          {files?.preview && (
            <Box
              sx={{
                position: 'relative',
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={files.preview}
                alt="meal"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                }}
                size="small"
                onClick={handleRemoveImage}
              >
                <Iconify icon="ic:baseline-close" width={12} sx={{ ml: -0.5 }} />
              </IconButton>
            </Box>
          )}

          <Button variant="contained" component="label">
            {uploadLoading ? 'Uploading...' : 'Upload Image'}
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
        </Stack>
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
          {loading ? 'Updating...' : 'Update Category'}
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

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Radio,
  Button,
  Collapse,
  RadioGroup,
  CardContent,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PRODUCT_CATEGORY_GROUP_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import api from 'src/utils/api';
import { Iconify } from 'src/components/iconify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { fetchCategories } from 'src/utils/Redux/slices/categoriesSlice';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  mealName: zod.string().min(1, { message: 'Meal Name is required!' }),
  category_id: zod.number().min(1, { message: 'Category ID is required!' }),
  type: zod.string().min(1, { message: 'Type isQ required!' }), // veg / non-veg

  description: zod.string().min(1, { message: 'Description is required!' }),

  images: zod.object({
    url: zod.string().min(1, { message: 'Valid image URL is required!' }),
    alt: zod.string(), // No validation needed since it will be auto-filled
  }),

  price: zod.number().min(1, { message: 'Price should not be 0' }),
  fat: zod.number().min(0, { message: 'Fat must be a positive number' }),
  calorie: zod.number().min(0, { message: 'Calorie must be a positive number' }),
  protein: zod.number().min(0, { message: 'Protein must be a positive number' }),
  is_subsidised: zod.boolean(),
});

// ----------------------------------------------------------------------

export function QuickEditForm({ currentProduct }) {
  // console.log('check current');
  const { token } = useSelector((state) => state.superAdminAuth);
  const { meal_id } = useParams();
  const numericMealId = Number(meal_id);

  //   console.log(meal_id);
  // console.log(token);
  const { quickMeals } = useSelector((state) => state.quickMeals);
  //   console.log(quickMeals);

  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const location = useLocation();

  // console.log(categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [location.key, dispatch]); // ✅ Runs only when the page changes

  const router = useRouter();
  const [uploadLoading, setUploadLoading] = useState(false);

  const currentMeal = quickMeals.find((meal) => meal.meal_id === numericMealId);

  const defaultValues = useMemo(
    () => ({
      mealName: currentMeal?.mealName || '',
      category_id: currentMeal?.category_id || 1, // Default category
      type: currentMeal?.type || 'veg', // Default to veg
      description: currentMeal?.description || '',
      images: {
        url: currentMeal?.image ? JSON.parse(currentMeal.image).url : '',
        alt: currentMeal?.mealName || 'meal',
      },
      price: currentMeal?.price || 0,
      fat: currentMeal?.fat || 0,
      calorie: currentMeal?.calorie || 0,
      protein: currentMeal?.protein || 0,
      is_subsidised: currentMeal?.is_subsidised ?? false,
    }),
    [currentMeal]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentMeal) {
      reset(defaultValues);
    }
  }, [currentMeal, defaultValues, reset]);

  const validateAndSubmit = () => {
    const imageUrl = values.images?.url;

    if (!imageUrl) {
      toast.error('Please upload an image before submitting!');
      return;
    }

    // If image is present, call handleSubmit
    handleSubmit(onSubmit)();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const mealData = {
        mealName: data.mealName,
        // category_id: data.category_id,
        type: data.type,
        description: data.description,
        image: {
          url: data.images.url, // ✅ Ensuring the correct format
          alt: data.mealName, // ✅ Automatically setting the alt to meal name
        },
        price: data.price,
        fat: data.fat,
        calorie: data.calorie,
        protein: data.protein,
        is_subsidised: data.is_subsidised, // ✅ Added is_subsidised field
      };

      const response = await api.put(`/superAdmin/update_quick_meal/${numericMealId}`, mealData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success('Meal updated successfully!');
        reset();

        setTimeout(() => {
          router.push(-1);
        }, 2000);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error(error.msg || 'Failed to update meal. Please try again.');
    }
  });

  useEffect(() => {
    setValue('image.alt', values.mealName);
  }, [values.mealName, setValue]);

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
        setValue('images.url', response.data.url, { shouldValidate: true }); // ✅ Replace existing image
        console.log(response.data);
        toast.success('Image uploaded successfully!Proceed with adding meal');
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
    setValue('images.url', '', { shouldValidate: true });
  };

  const renderDetails = (
    <Card>
      <CardHeader
        title="Meal Details"
        subheader="Title, short description, image..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="mealName" label="Meal Name" />

        <section style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <TextField
            label="Category"
            value={
              categories.find((category) => category.category_id === currentMeal?.category_id)
                ?.name || 'N/A'
            }
            disabled
            fullWidth
          />

          <Field.Select
            native
            name="type"
            label="Type"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setValue('type', e.target.value, { shouldValidate: true })} // ✅ Ensure correct value
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </Field.Select>
        </section>

        <Field.Text name="description" label="Description" multiline rows={4} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Upload Image</Typography>

          {/* Display Uploaded Image */}
          {values.images?.url && (
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
                src={values.images.url}
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

          {/* Upload Button */}
          <Button variant="contained" component="label">
            {uploadLoading ? 'Uploading...' : 'Uplaod Image'}
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <Stack spacing={3}>
        <Card>
          <CardHeader title="Details" />
          <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <Field.Text
                name="price"
                label="Price in Rupees"
                type="number"
                onWheel={(e) => e.target.blur()} // ✅ Prevent scroll changing value
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault(); // ✅ Prevent arrow keys from changing value
                  }
                }}
              />
              <Field.Text name="fat" label="Fat" type="number" />
            </section>

            <section style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <Field.Text name="protein" label="Protein" type="number" />
              <Field.Text name="calorie" label="Calorie" type="number" />
            </section>
            <Stack spacing={1}>
              <Field.Select
                native
                name="is_subsidised"
                label="Is Subsidised?"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setValue('is_subsidised', e.target.value === 'true')} // ✅ Convert to boolean
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Field.Select>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" justifyContent="flex-end" flexWrap="wrap">
      <LoadingButton
        type="button"
        variant="contained"
        size="large"
        onClick={validateAndSubmit}
        loading={isSubmitting}
      >
        {!currentProduct ? 'Update meal' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>
    </Form>
  );
}

import { z as zod } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Collapse, CardContent, Box, IconButton, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import api from 'src/utils/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from 'src/utils/Redux/slices/categoriesSlice';
import { useLocation, useParams } from 'react-router';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  mealName: zod.string().min(1, { message: 'Meal Name is required!' }),
  category_id: zod.number().min(1, { message: 'Category is required!' }),
  type: zod.enum(['veg', 'non-veg'], { message: 'Type must be "veg" or "non-veg"' }),
  description: zod.string().min(1, { message: 'Description is required!' }),

  // Validate image structure
  images: zod.object({
    url: zod.string().url({ message: 'Valid Image URL required!' }),
    alt: zod.string().min(1, { message: 'Alt text is required!' }),
  }),

  weekDetails: zod.array(
    zod.object({
      day: zod.string(),
      price: zod.number().optional(), // ✅ Make these fields optional
      fat: zod.number().optional(),
      calorie: zod.number().optional(),
      protein: zod.number().optional(),
      items: zod.array(zod.string()).optional(), // ✅ Items can be empty
    })
  ),
  is_subsidised: zod.boolean(),
});

// ----------------------------------------------------------------------

export function DailyEditForm({ currentProduct }) {
  const [openCard, setOpenCard] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const { token } = useSelector((state) => state.superAdminAuth);
  // console.log(token);

  const location = useLocation();
  const dispatch = useDispatch();
  const { meal_id } = useParams();
  const numericMealId = Number(meal_id);
  const { categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [location.key, dispatch]);

  const { repeatingMeals } = useSelector((state) => state.repeatingMeals);
  //   console.log(repeatingMeals);

  const handleCardClick = (index) => {
    setOpenCard((prev) => (prev === index ? null : index)); // ✅ Toggle using index
  };

  const router = useRouter();

  const daysOfWeek = useMemo(
    () => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    []
  );

  const currentMeal = repeatingMeals.find((meal) => meal.meal_id === numericMealId);

  const defaultValues = useMemo(
    () => ({
      mealName: currentMeal?.mealName || '',
      category_id: currentMeal?.category_id || 1, // Ensure this is an ID
      type: currentMeal?.type || 'veg', // Default to 'veg' if not provided
      description: currentMeal?.description || '',
      images: {
        url: currentMeal?.image ? JSON.parse(currentMeal.image).url : '',
        alt: currentMeal?.mealName || 'meal',
      },
      is_subsidised: currentMeal?.is_subsidised ?? false,

      // Populate weekDetails correctly
      weekDetails: daysOfWeek.map((day) => {
        const dayDetails = currentMeal?.repeatingMealDetails?.find(
          (d) => d.dayOfWeek.toLowerCase() === day
        );

        return {
          day,
          price: dayDetails?.price || 0,
          fat: dayDetails?.fat || 0,
          calorie: dayDetails?.calorie || 0,
          protein: dayDetails?.protein || 0,
          items: dayDetails?.items ? JSON.parse(dayDetails.items) : [''], // ✅ Parse JSON array properly
        };
      }),
    }),
    [currentMeal, daysOfWeek]
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
      const existingDetails = currentMeal?.repeatingMealDetails || [];

      // ✅ Process `weekDetails`, ensuring correct IDs and formatting
      const filteredDetails = data.weekDetails
        .filter((day) => {
          const hasValidItem = day.items && day.items.some((item) => item.trim() !== '');
          return day.price || day.fat || day.calorie || day.protein || hasValidItem;
        })
        .map((day) => {
          const existingDetail = existingDetails.find((d) => d.dayOfWeek.toLowerCase() === day.day);

          // ✅ Build the `detail` object dynamically, excluding `id` if not available
          const detail = {
            dayOfWeek: day.day,
            price: day.price,
            fat: day.fat,
            calorie: day.calorie,
            protein: day.protein,
            items: day.items, // ✅ API expects an array, no need to stringify
          };

          // ✅ Only include `id` if it exists
          if (existingDetail?.id) {
            detail.id = existingDetail.id;
          }

          return detail;
        });

      const formattedData = {
        mealName: data.mealName,
        type: data.type,
        description: data.description,
        image: {
          url: data.images.url,
          alt: data.images.alt,
        },
        is_subsidised: data.is_subsidised,
        details: filteredDetails, // ✅ Properly structured `details`
      };

      //   console.log('Submitting Data:', formattedData);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await api.put(
        `/superAdmin/update_repeating_meal_with_details/${numericMealId}`,
        formattedData,
        {
          headers,
        }
      );

      if (response.status === 200) {
        toast.success('Meal updated successfully!');
        reset();
        router.push(-1);
      } else {
        toast.error(response.data.message || 'Failed to update meal');
      }
    } catch (error) {
      console.error('Error updating meal:', error);
      toast.error(error.msg || 'Something went wrong');
    }
  });

  const handleRemoveImage = () => {
    setValue('images.url', '', { shouldValidate: true });
  };

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

  useEffect(() => {
    setValue('image.alt', values.mealName);
  }, [values.mealName, setValue]);

  const { control } = methods; // Extract control from react-hook-form

  // ✅ Fix: Use useMemo to store useFieldArray instances
  // ✅ Call useFieldArray at the top level
  const weekDetailsArray = useFieldArray({
    control: methods.control,
    name: 'weekDetails',
  });

  // ✅ Now map over `weekDetailsArray.fields` instead of using `daysOfWeek`
  const weekDetailsFields = weekDetailsArray.fields.map((field, index) => ({
    day: field.day, // Assuming `field.day` exists
    index, // Store index for field reference
  }));

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

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Images</Typography>

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
        <Card
          style={{
            border: 'none',
            boxShadow: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
          }}
        >
          <CardHeader title="Details" />
          <Stack spacing={3} sx={{ p: 3 }}>
            {weekDetailsFields.map(({ day, index }) => (
              <Card key={index} sx={{ cursor: 'pointer' }}>
                <CardHeader
                  title={day.charAt(0).toUpperCase() + day.slice(1)} // Capitalize first letter
                  sx={{ padding: '1rem', cursor: 'pointer' }}
                  onClick={() => handleCardClick(index)}
                />
                <Collapse in={openCard === index}>
                  <CardContent>
                    <Stack spacing={3} sx={{ p: 3 }}>
                      <section
                        style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
                      >
                        <Field.Text
                          name={`weekDetails.${index}.price`}
                          label="Price in Rupees"
                          type="number"
                        />
                        <Field.Text name={`weekDetails.${index}.fat`} label="Fat" type="number" />
                      </section>

                      <section
                        style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
                      >
                        <Field.Text
                          name={`weekDetails.${index}.protein`}
                          label="Protein"
                          type="number"
                        />
                        <Field.Text
                          name={`weekDetails.${index}.calorie`}
                          label="Calorie"
                          type="number"
                        />
                      </section>

                      {/* ✅ Meal Items List */}
                      <Stack spacing={2}>
                        {values.weekDetails?.[index]?.items?.map((item, itemIndex) => (
                          <Stack key={itemIndex} direction="row" spacing={1} alignItems="center">
                            <Field.Text
                              name={`weekDetails.${index}.items.${itemIndex}`}
                              label="Description"
                            />
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
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
        {!currentProduct ? 'Update Meal' : 'Save changes'}
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

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
import { Button, Collapse, CardContent, Box, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import api from 'src/utils/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from 'src/utils/Redux/slices/categoriesSlice';
import { useLocation } from 'react-router';
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

  price: zod.number().min(1, { message: 'Price is required!' }),

  weekDetails: zod.array(
    zod.object({
      day: zod.string(),
      // price: zod.number().optional(), // ✅ Make these fields optional
      fat: zod.number().optional(),
      calorie: zod.number().optional(),
      protein: zod.number().optional(),
      items: zod.array(zod.string()).optional(), // ✅ Items can be empty
    })
  ),
  is_subsidised: zod.boolean(),
});

// ----------------------------------------------------------------------

export function ProductDailyEditForm({ currentProduct }) {
  const [openCard, setOpenCard] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const { token } = useSelector((state) => state.superAdminAuth);
  // console.log(token);

  const location = useLocation();
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [location.key, dispatch]);

  const handleCardClick = (index) => {
    setOpenCard((prev) => (prev === index ? null : index)); // ✅ Toggle using index
  };

  const router = useRouter();

  const daysOfWeek = useMemo(
    () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    []
  );

  const defaultValues = useMemo(
    () => ({
      mealName: currentProduct?.name || '',
      category_id: currentProduct?.category_id || '', // Ensure this is an ID
      type: currentProduct?.type || 'veg', // Default to 'veg' if not provided
      description: currentProduct?.subDescription || '',

      // Adjust Image format
      images: {
        url: currentProduct?.image?.url || '',
        alt: currentProduct?.mealName || 'meal', // Automatically set alt to mealName
      },
      is_subsidised: currentProduct?.is_subsidised ?? false,
      price: currentProduct?.price || 0, // ✅ Added main price field

      weekDetails: daysOfWeek.map((day) => ({
        day: day.toLowerCase(),
        price: currentProduct?.weekDetails?.find((d) => d.day === day.toLowerCase())?.price || 0,
        fat: currentProduct?.weekDetails?.find((d) => d.day === day.toLowerCase())?.fat || 0,
        calorie:
          currentProduct?.weekDetails?.find((d) => d.day === day.toLowerCase())?.calorie || 0,
        protein:
          currentProduct?.weekDetails?.find((d) => d.day === day.toLowerCase())?.protein || 0,
        items: currentProduct?.weekDetails?.find((d) => d.day === day.toLowerCase())?.items || [''],
      })),
    }),

    [currentProduct, daysOfWeek]
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
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

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
      // ✅ Filter out empty days
      const filteredWeekDetails = data.weekDetails
        .filter((day) => {
          const hasValidItem = day.items && day.items.some((item) => item.trim() !== '');
          return day.fat || day.calorie || day.protein || hasValidItem; // ✅ Removed individual price check
        })
        .map((day) => ({
          ...day,
          price: data.price,
        }));

      // const filteredWeekDetails = data.weekDetails.filter(
      //   (day) =>
      //     day.price || day.fat || day.calorie || day.protein || (day.items && day.items.length > 0)
      // );

      const formattedData = {
        mealName: data.mealName,
        category_id: data.category_id,
        type: data.type,
        description: data.description,
        image: {
          url: data.images.url,
          alt: data.images.alt,
        },
        weekDetails: filteredWeekDetails,
        is_subsidised: data.is_subsidised,
      };

      console.log(formattedData);
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await api.post('/superAdmin/add_repeating_meal', formattedData, { headers });

      if (response.data.success) {
        toast.success(currentProduct ? 'Meal updated successfully!' : 'Meal created successfully!');
        reset();

        console.log(response.data);
        const meal_id = response.data?.data?.meal_id;

        setTimeout(() => {
          router.push(`${paths.dashboard.product.options}/${meal_id}/repeating`);
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to create meal');
      }

      console.info('API RESPONSE:', response.data);
    } catch (error) {
      console.error('Error creating meal:', error);
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

        <Field.Text
          name="price"
          label="Price (in Rupees)"
          type="number"
          onWheel={(e) => e.target.blur()} // ✅ Prevent scroll changing value
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault(); // ✅ Prevent arrow keys from changing value
            }
          }}
        />

        <section style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <Field.Select
            native
            name="category_id"
            label="Category"
            InputLabelProps={{ shrink: true }}
            value={values.category_id} // Ensure controlled component
            onChange={(e) => {
              const selectedCategoryId = e.target.value ? Number(e.target.value) : '';
              setValue('category_id', selectedCategoryId, { shouldValidate: true });
            }}
          >
            <option value="">Select Category</option>{' '}
            {/* Empty option to prevent default selection */}
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </Field.Select>

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
                {/* ✅ Move `handleCardClick` only to CardHeader */}
                <CardHeader
                  title={day}
                  sx={{ padding: '1rem', cursor: 'pointer' }}
                  onClick={() => handleCardClick(index)} // ✅ Use `index` instead of day.toLowerCase()
                />
                <Collapse in={openCard === index}>
                  <CardContent>
                    <Stack spacing={3} sx={{ p: 3 }}>
                      {/* <section
                        style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
                      >
                        <Field.Text
                          name={`weekDetails.${index}.price`}
                          label="Price in Rupees"
                          type="number"
                        />
                      </section> */}

                      <section
                        style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
                      >
                        <Field.Text name={`weekDetails.${index}.fat`} label="Fat" type="number" />

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

                      {/* Dynamic Meal Items List */}
                      <Stack spacing={2}>
                        {/* <Typography variant="subtitle2">Description</Typography> */}
                        {values.weekDetails?.[index]?.items?.map((item, itemIndex) => (
                          <Stack key={itemIndex} direction="row" spacing={1} alignItems="center">
                            <Field.Text
                              name={`weekDetails.${index}.items.0`}
                              // label={`Item ${itemIndex + 1}`}
                              label="Description"
                            />
                            {/* <Button
                              onClick={() =>
                                setValue(
                                  `weekDetails.${index}.items`,
                                  values.weekDetails[index].items.filter((_, i) => i !== itemIndex)
                                )
                              }
                            >
                              Remove
                            </Button> */}
                          </Stack>
                        ))}
                        {/* <Button
                          // sx={{ color: 'white', background: 'black' }}
                          onClick={() =>
                            setValue(`weekDetails.${index}.items`, [
                              ...values.weekDetails[index].items,
                              '',
                            ])
                          }
                        >
                          Add Description
                        </Button> */}
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
        {!currentProduct ? 'Create product' : 'Save changes'}
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

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Button, Radio, RadioGroup, CardContent, Collapse, IconButton } from '@mui/material';


import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
  _tags,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  images: schemaHelper.files({ message: { required_error: 'Images is required!' } }),
  code: zod.string().min(1, { message: 'Product code is required!' }),
  sku: zod.string().min(1, { message: 'Product sku is required!' }),
  quantity: zod.number().min(1, { message: 'Quantity is required!' }),
  colors: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  sizes: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  gender: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  price: zod.number().min(1, { message: 'Price should not be $0.00' }),
  // Not required
  category: zod.string(),
  priceSale: zod.number(),
  subDescription: zod.string(),
  taxes: zod.number(),
  saleLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
  newLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
});

// ----------------------------------------------------------------------
const MEAL_VARIANT_OPTIONS = [
  { label: 'Upgraded Meal', value: 'upgrade' },
  { label: 'Daily Meal', value: 'daily' },
  { label: 'Live Counter', value: 'live' },
];

export function ProductNewEditForm({ currentProduct }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [openCard, setOpenCard] = useState(null);
  
  const handleCardClick = (cardName) => {
    setOpenCard(openCard === cardName ? null : cardName); 
  };

  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images || [],
      //
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [],
      taxes: currentProduct?.taxes || 0,
      gender: currentProduct?.gender || [],
      category: currentProduct?.category || PRODUCT_CATEGORY_GROUP_OPTIONS[0].classify[1],
      colors: currentProduct?.colors || [],
      sizes: currentProduct?.sizes || [],
      newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
    }),
    [currentProduct]
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

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <Card>
      <CardHeader title="Meal Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Meal Name" />

          <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
          <Field.Text name="category" label="Category" />
          <Field.Select native name="type" label="Type" InputLabelProps={{ shrink: true }}>
            <option>Veg</option>
            <option>Non Veg</option>
          </Field.Select>
          </section>

        <Field.Text name="subDescription" label="Description" multiline rows={4} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Select Meal Variant</Typography>
          <RadioGroup row value={selectedOption} onChange={handleChange} sx={{ gap: 2 }}>
        {MEAL_VARIANT_OPTIONS.map((option) => (
          <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>

        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack>
          <Card>
          {selectedOption === 'upgrade' && (
        
        <Card>
          <CardHeader title="Details"/>
          <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </Card>
      
    )}

    {selectedOption === 'daily' && (
      <Card style={{border:'none', boxShadow: 'none', outline: 'none', backgroundColor: 'transparent'}}> 
        <CardHeader title="Details"/>
        <Stack spacing={3} sx={{ p: 3 }}>
        <Card onClick={() => handleCardClick('monday')} sx={{ cursor: 'pointer' }}>
      <CardHeader title="Monday" sx={{ padding: '1rem'}}  />
      <Collapse in={openCard === 'monday'}>
        <CardContent>
        <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </CardContent>
      </Collapse>
    </Card>

    <Card onClick={() => handleCardClick('tuesday')} sx={{ cursor: 'pointer' }}>
      <CardHeader title="Tuesday" sx={{ padding: '1rem'}}  />
      <Collapse in={openCard === 'tuesday'}>
        <CardContent>
        <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </CardContent>
      </Collapse>
    </Card>

    <Card onClick={() => handleCardClick('wednesday')} sx={{ cursor: 'pointer' }}>
      <CardHeader title="Wednesday" sx={{ padding: '1rem'}}  />
      <Collapse in={openCard === 'wednesday'}>
        <CardContent>
        <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </CardContent>
      </Collapse>
    </Card>

    <Card onClick={() => handleCardClick('thursday')} sx={{ cursor: 'pointer' }}>
      <CardHeader title="Thursday" sx={{ padding: '1rem'}}  />
      <Collapse in={openCard === 'thursday'}>
        <CardContent>
        <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </CardContent>
      </Collapse>
    </Card>

    <Card onClick={() => handleCardClick('friday')} sx={{ cursor: 'pointer' }}>
      <CardHeader title="Friday" sx={{ padding: '1rem'}}  />
      <Collapse in={openCard === 'friday'}>
        <CardContent>
        <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </CardContent>
      </Collapse>
    </Card>

    <Card onClick={() => handleCardClick('saturday')} sx={{ cursor: 'pointer' }}>
      <CardHeader title="Saturday" sx={{ padding: '1rem'}}  />
      <Collapse in={openCard === 'saturday'}>
        <CardContent>
        <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </CardContent>
      </Collapse>
    </Card>

    <Card onClick={() => handleCardClick('sunday')} sx={{ cursor: 'pointer' }}>
      <CardHeader title="Sunday" sx={{ padding: '1rem'}}  />
      <Collapse in={openCard === 'sunday'}>
        <CardContent>
        <Stack spacing={3} sx={{ p: 3 }}>
            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="priceRS" label="Price in Rupees" />
              <Field.Text name="fat" label="Fat" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="protein" label="Protein" />
              <Field.Text name="calorie" label="Calorie" />
            </section>

            <section style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
              <Field.Text name="itemName" label="Item Name" style={{width: '80%'}} />
              <Button variant="contained" style={{width: '20%'}}>Add Item</Button>
            </section>
            </Stack>
        </CardContent>
      </Collapse>
    </Card>
          </Stack>
      </Card>
    )}
          </Card>
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Create Meal"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create product' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>
    </Form>
  );
}

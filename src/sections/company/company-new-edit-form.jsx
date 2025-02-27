import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
});

// ----------------------------------------------------------------------

export function CompanyNewEditForm({ currentProduct }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

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

  const renderDetails = (
    <Card sx={{ flex: 1, minWidth: 700, maxWidth: 800 }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }>
          <Field.Text name="companyName" label="Company Name" />
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
  <Field.Text 
    name="gst" 
    label="GST" 
  />
  <button 
    type="button"
    style={{
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '10px 20px',
      backgroundColor: 'black',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}>
    Verify
  </button>
</div>

        </section>
        
        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }><Field.Text name="region" label="State/Region"/>
        <Field.Text name="city" label="City"/></section>
        
        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }><Field.Text name="address" label="Address"/>
        <Field.Text name="zip" label="Zip/Code"/>
        </section>
        
        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }><Field.Text name="subsidyType" label="Subsidy Type"/>
        <Field.Text name="subsidyValue" label="Subsidy Value"/></section>
        

        <Field.Text name="time" label="7:00 PM (Default)"/>

        <Divider />

        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }><Field.Text name="domain" label="Company Domain (example@domain.com" style={{ paddingRight: '2rem', width: '75%'}}/>
        <button 
    type="button"
    style={{
      position: 'absolute',
      right: '1.8rem',
      transform: 'translateY(25%)',
      padding: '10px 20px',
      backgroundColor: 'black',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}>
    Add Company Domain
  </button>
        </section>

        <Divider />

        <h3>Contact Person Details</h3>

        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }><Field.Text name="name" label="Name"/>
        <Field.Text name="number" label="Contact Number"/></section>

        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }><Field.Text name="email" label="Email" style={{ paddingRight: '2rem', width: '75%'}}/>
        <button 
    type="button"
    style={{
      position: 'absolute',
      right: '1.8rem',
      transform: 'translateY(25%)',
      padding: '10px 20px',
      backgroundColor: 'black',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}>
    Add Contact Person
  </button>
        </section>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card sx={{ flex: 2, minWidth: 300, maxWidth: 350, minHeight: 200, maxHeight: 350 }}>
      <CardHeader
        title="Company Permissions"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>

        <Stack direction="row" alignItems="center" spacing={3}>
        <section style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }
        }>
          <Field.Switch name="meal.enabled" label="Add Meal" sx={{ m: 0 }} />
          <Field.Switch name="export.enabled" label="Export Orders" sx={{ m: 0 }} />
          <Field.Switch name="guestMeal.enabled" label="Order Guest Meal" sx={{ m: 0 }} />
          <Field.Switch name="vegOnly.enabled" label="Veg Only" sx={{ m: 0 }} />
          </section>
         
        </Stack>
      </Stack>
    </Card>
  );
  

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create Company' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: '0', maxWidth: { xs: 720, xl: 880 } }}>

      <div style={{ display: 'flex',gap: '1rem', width: '100%' }}>
        {renderDetails}
        {renderProperties}
        </div>

        <div style={{marginTop: '1rem', display: 'flex', width: '140%', justifyContent: 'flex-end' }}>
        {renderActions}
        </div>
      </Stack>
    </Form>
  );
}

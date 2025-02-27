import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { TimePicker } from '@mui/x-date-pickers';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
      domains: [''],
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
        }><Field.Text name="region" label="State/Region" />
          <Field.Text name="city" label="City" /></section>

        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }><Field.Text name="address" label="Address" />
          <Field.Text name="zip" label="Zip/Code" />
        </section>

        <section style={
          {
            display: 'flex',
            gap: '1rem',
          }
        }>
          <Field.Select native name="type" label="Subsidy Type" InputLabelProps={{ shrink: true }}>
            <option>Flat</option>
            <option>Fixed</option>
          </Field.Select>
          <Field.Text name="subsidyValue" label="Subsidy Value" /></section>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Time"
            defaultValue={dayjs('19:00', 'HH:mm')}
            format="hh:mm A"
          />
        </LocalizationProvider>

        <Divider />

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {values.domains?.map((domain, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
              <Field.Text
                name={`domains.${index}`}
                label="Company Domain (example@domain.com)"
                style={{ paddingRight: '2rem', width: '75%' }}
              />

              {(values.domains.length > 1 || (index === 0 && values.domains.length > 1)) && (
                <button
                  type="button"
                  onClick={() => {
                    const newDomains = [...values.domains];
                    if (index === 0 && newDomains.length === 1) {
                      // Reset to an empty field if only the initial input remains
                      newDomains[0] = '';
                    } else {
                      // Remove the selected input field
                      newDomains.splice(index, 1);
                    }
                    methods.setValue('domains', newDomains);
                  }}
                  style={{
                    padding: '5px 5px',
                    backgroundColor: 'red',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '20%',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => methods.setValue('domains', [...values.domains, ''])}
            style={{
              padding: '10px 20px',
              backgroundColor: 'black',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Add Company Domain
          </button>
        </section>


        <Divider />

        <h3>Contact Person Details</h3>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {(values.contacts?.length ? values.contacts : [{ name: '', number: '', email: '' }]).map(
            (contact, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Name Input Field */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                  <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                    <section style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Field.Text
                        name={`contacts.${index}.name`}
                        label="Name"
                        style={{ paddingRight: '2rem', width: '50%' }}
                      />

                      <Field.Text
                        name={`contacts.${index}.number`}
                        label="Contact Number"
                        style={{ paddingRight: '2rem', width: '50%' }}
                      />
                    </section>

                    <section style={{ display: 'flex' }}>
                      <Field.Text
                        name={`contacts.${index}.email`}
                        label="Email"
                        style={{ paddingRight: '2rem', width: '75%' }}
                      />

                      {/* Remove Button */}
                      {(values.contacts?.length > 1 || index > 0) && (
                        <button
                          type="button"
                          onClick={() => {
                            const newContacts = [...values.contacts];
                            if (index === 0 && newContacts.length === 1) {
                              // Reset to an empty field if only the initial input remains
                              newContacts[0] = { name: '', number: '', email: '' };
                            } else {
                              // Remove the selected input field
                              newContacts.splice(index, 1);
                            }
                            methods.setValue('contacts', newContacts);
                          }}
                          style={{
                            padding: '5px 5px',
                            backgroundColor: 'red',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            width: '20%',
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </section>


                  </section>
                </div>
              </div>
            )
          )}

          {/* Add Contact Button */}
          <button
            type="button"
            onClick={() => {
              const newContacts = [...(values.contacts || []), { name: '', number: '', email: '' }];
              methods.setValue('contacts', newContacts);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: 'black',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Add Contact Person
          </button>
        </section>



      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card sx={{ flex: 2, minWidth: 300, maxWidth: 350, minHeight: 200, maxHeight: 380 }}>
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
              padding: '0',
            }
          }>
            <Field.Switch name="meal.enabled" label="Add Meal" sx={{ m: 0 }} />
            <Field.Switch name="export.enabled" label="Export Orders" sx={{ m: 0 }} />
            <Field.Switch name="guestMeal.enabled" label="Order Guest Meal" sx={{ m: 0 }} />
            <Field.Switch name="vegOnly.enabled" label="Veg Only" sx={{ m: 0 }} />
            <Field.Switch name="liveCounter.enabled" label="Live Counter" sx={{ m: 0 }} />
          </section>

        </Stack>
      </Stack>
    </Card>
  );


  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" marginRight={5}>
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create Company' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: '0', maxWidth: { xs: 720, xl: 880 } }}>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          {renderDetails}
          {renderProperties}
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', width: '140%', justifyContent: 'flex-end' }}>
          {renderActions}
        </div>
      </Stack>
    </Form>
  );
}

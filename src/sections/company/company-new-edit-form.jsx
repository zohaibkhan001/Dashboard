import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { createCompany } from 'src/utils/Redux/slices/createCompanySlice';
import { useDispatch, useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const NewProductSchema = zod.object({
  companyName: zod.string().min(1, { message: 'Company Name is required!' }),

  gst: zod.string().length(15, { message: 'GST must be exactly 15 characters!' }),

  region: zod.string().min(1, { message: 'State/Region is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),

  zip: zod
    .number()
    .int({ message: 'Zip code must be a 6-digit number!' })
    .positive({ message: 'Zip code must be a positive number!' })
    .refine((val) => val.toString().length === 6, {
      message: 'Zip code must be exactly 6 digits!',
    }),
  type: zod.enum(['Flat', 'Fixed'], {
    message: "Subsidy Type must be either 'Flat' or 'Fixed'!",
  }),

  subsidyValue: zod
    .number()
    .positive({ message: 'Subsidy value must be a positive number!' })
    .int({ message: 'Subsidy value must be an integer!' }),

  password: zod
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter!' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter!' })
    .regex(/\d/, { message: 'Password must contain at least one number!' })
    .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character!' }),

  time: zod.string().min(1, { message: 'Time is required!' }), // Store time as a string

  domains: zod
    .array(
      zod.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: 'Invalid domain name! Example: example.com or abc.in',
      })
    )
    .nonempty({ message: 'At least one domain is required!' }),

  contacts: zod
    .array(
      zod.object({
        name: zod.string().min(1, { message: 'Name is required!' }),
        number: zod.string().regex(/^\d{10}$/, { message: 'Contact number must be 10 digits!' }),
        email: zod.string().email({ message: 'Invalid email address!' }),
      })
    )
    .nonempty({ message: 'At least one contact is required!' }),

  meal: zod.object({ enabled: zod.boolean() }),
  export: zod.object({ enabled: zod.boolean() }),
  guestMeal: zod.object({ enabled: zod.boolean() }),
  vegOnly: zod.object({ enabled: zod.boolean() }),
  liveCounter: zod.object({ enabled: zod.boolean() }),
});

// ----------------------------------------------------------------------

export function CompanyNewEditForm({ currentProduct }) {
  const router = useRouter();

  const { loading } = useSelector((state) => state.createCompany);

  const defaultValues = useMemo(
    () => ({
      companyName: currentProduct?.name ?? '', // Avoid undefined
      gst: currentProduct?.gst ?? '',
      region: currentProduct?.region ?? '',

      city: currentProduct?.city ?? '',
      address: currentProduct?.address ?? '',
      zip: currentProduct?.zip ?? '',
      type: currentProduct?.type ?? 'Flat',
      subsidyValue: currentProduct?.subsidyValue ?? '',
      password: '',
      time: currentProduct?.time ?? dayjs().format('HH:mm'), // Initialize with current time

      domains: currentProduct?.domains ?? [''], // Ensure at least one domain
      contacts: currentProduct?.contacts ?? [{ name: '', number: '', email: '' }], // Ensure at least one contact
      meal: { enabled: currentProduct?.meal?.enabled ?? false },
      export: { enabled: currentProduct?.export?.enabled ?? false },
      guestMeal: { enabled: currentProduct?.guestMeal?.enabled ?? false },
      vegOnly: { enabled: currentProduct?.vegOnly?.enabled ?? false },
      liveCounter: { enabled: currentProduct?.liveCounter?.enabled ?? false },
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    mode: 'onChange', // ✅ Ensure real-time updates
    reValidateMode: 'onSubmit', // ✅ Re-validates when submitting
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log('🔥 React Hook Form values:', values);
  // }, [values]);

  const onSubmit = (data) => {
    console.log('🛠 onSubmit function called');

    // Transform form data into the required structure
    const formattedData = {
      companyName: data.companyName,
      companyAddress: data.address, // Mapping address field
      contactPerson: data.contacts[0]?.name || '', // First contact name
      domainName: data.domains, // Array of domain names
      email: data.contacts[0]?.email || '', // First contact email
      gst: data.gst,
      subsidiary: data.subsidyValue, // Mapping subsidiary
      password: data.password,
      orderCutoffTime: data.time, // Time field
      state: data.region, // Map region to state
      city: data.city,
      zip: data.zip.toString(), // Ensure zip is string
      subsidiaryType: data.type, // Map type to subsidiaryType
      companyType: data.vegOnly.enabled ? 'veg' : 'non-veg',
      isLiveCounter: data.liveCounter.enabled,
      contacts: data.contacts.map((contact) => ({
        name: contact.name,
        number: contact.number || '',
        email: contact.email || '',
      })),
      additionalOption: {
        export: data.export.enabled,
        meal: data.meal.enabled,
        guestMeal: data.guestMeal.enabled,
        vegOnly: data.vegOnly.enabled,
        liveCounter: data.liveCounter.enabled,
      },
    };

    // console.log('📦 Formatted Data:', formattedData);
    // console.table(formattedData); // Log structured data

    dispatch(createCompany(formattedData))
      .then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success(currentProduct ? 'Update success!' : 'Company created successfully!');
          reset();
        } else {
          // Extract error message from Redux slice response
          console.log(result.payload);
          const errorMessage = result.payload || 'Failed to create company';
          throw new Error(errorMessage);
        }
      })
      .catch((error) => {
        console.error('❌ Error creating company:', error);
        toast.error(error.message || 'Error creating company! Please try again.');
      });
  };

  const renderDetails = (
    <Card sx={{ flex: 1, minWidth: 700, maxWidth: 800 }}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <section
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <Field.Text name="companyName" label="Company Name" />
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <Field.Text name="gst" label="GST" />
            {/* <button
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
                cursor: 'pointer',
              }}
            >
              Verify
            </button> */}
          </div>
        </section>

        <section
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <Field.Text name="region" label="State/Region" />
          <Field.Text name="city" label="City" />
        </section>

        <section
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <Field.Text name="address" label="Address" />
          <Field.Text type="number" name="zip" label="Zip/Code" />
        </section>

        <section
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <Field.Select native name="type" label="Subsidy Type" InputLabelProps={{ shrink: true }}>
            <option>Flat</option>
            {/* <option>Fixed</option> */}
          </Field.Select>
          <Field.Text type="number" name="subsidyValue" label="Subsidy Value" />
        </section>

        <section
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <Field.Text name="password" label="Password" />
        </section>

        <Controller
          name="time"
          control={methods.control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Time"
                value={field.value ? dayjs(field.value, 'HH:mm') : null} // Convert string to Dayjs object
                onChange={(newValue) =>
                  field.onChange(newValue ? dayjs(newValue).format('HH:mm') : '')
                } // Convert Dayjs object to string
              />
            </LocalizationProvider>
          )}
        />

        <Divider />

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {values.domains?.map((domain, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}
            >
              <Field.Text
                name={`domains.${index}`}
                label="Company Domain"
                value={values.domains[index] ?? ''}
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
                  <section
                    style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}
                  >
                    <section style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Field.Text
                        name={`contacts.${index}.name`}
                        label="Name"
                        value={values.contacts[index]?.name ?? ''}
                      />

                      <Field.Text
                        name={`contacts.${index}.number`}
                        label="Number"
                        value={values.contacts[index]?.number ?? ''}
                      />
                    </section>

                    <section style={{ display: 'flex' }}>
                      <Field.Text
                        name={`contacts.${index}.email`}
                        label="Email"
                        value={values.contacts[index]?.email ?? ''}
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
      <CardHeader title="Company Permissions" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '0',
            }}
          >
            <Field.Switch name="meal.enabled" label="Add Meal" defaultChecked={false} />
            <Field.Switch name="export.enabled" label="Export Orders" defaultChecked={false} />
            <Field.Switch
              name="guestMeal.enabled"
              label="Order Guest Meal"
              defaultChecked={false}
            />
            <Field.Switch name="vegOnly.enabled" label="Veg Only" defaultChecked={false} />
            <Field.Switch name="liveCounter.enabled" label="Live Counter" defaultChecked={false} />
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
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: '0', maxWidth: { xs: 720, xl: 880 } }}>
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          {renderDetails}
          {renderProperties}
        </div>

        <div
          style={{ marginTop: '1rem', display: 'flex', width: '140%', justifyContent: 'flex-end' }}
        >
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: 'black',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {!currentProduct ? 'Create Company' : 'Save changes'}
          </button>
        </div>
      </Stack>
    </Form>
  );
}

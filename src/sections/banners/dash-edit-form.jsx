import { z as zod } from 'zod';
import { useMemo, useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Upload } from "src/components/upload";
import { _userList } from 'src/_mock';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  avatarUrl: schemaHelper.file({
    message: { required_error: 'Avatar is required!' },
  }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  company: zod.string().min(1, { message: 'Company is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  // Not required
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

export function DashEditForm({ currentUser }) {
  const router = useRouter();

  const [files, setFiles] = useState([]);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleRemoveAllFiles = () => setFiles([]);

  const companiesList = [...new Set(_userList.map((user) => user.company))];

  const defaultValues = useMemo(
    () => ({
      avatarUrl: currentUser?.avatarUrl || null,
      company: currentUser?.company || '',
      sections: currentUser?.sections || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ width: '100%', p: 1, bgcolor: 'background.paper' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8} lg={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  }}
                >
                  <Field.Text name="sections" label="Section" />
                  <Field.Select native name="company" label="Company" InputLabelProps={{ shrink: true }}>
                    <option value="" disabled>
                      Select a company
                    </option>
                    {companiesList.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </Field.Select>


                  <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Uploaded Image
                    </Typography>
                    <Box>
                      {values.avatarUrl && (
                        <Box mt={0}>
                          <img
                            src={values.avatarUrl}
                            alt="Uploaded Preview"
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Card>


                  {/* Image Upload */}
                  <Box
                    sx={{
                      gridColumn: "span 2",
                      width: "100%",
                      padding: 2,
                      border: "1px dashed #ccc",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />

                    <Typography variant="caption" sx={{ mt: 1, color: "text.disabled" }}>
                      Allowed: *.jpeg, *.jpg, *.png | Max: 3MB
                    </Typography>

                    <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 1 }}>
                      {/* <Button
                        variant="contained"
                        size="small"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={handleUpload}
                      >
                        Upload
                      </Button> */}
                      {!!files.length && (
                        <Button variant="outlined" size="small" color="inherit" onClick={handleRemoveAllFiles}>
                          Remove all
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!currentUser ? 'Create user' : 'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </Form>
  );
}


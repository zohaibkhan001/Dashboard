import { z as zod } from 'zod';
import { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Upload } from "src/components/upload";
import { Iconify } from "src/components/iconify";

import { _userList } from 'src/_mock';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Enter a valid email address!' }),
  phone: zod.string().optional(), // Phone can be empty
  company_id: zod.number({ required_error: 'Company ID is required!' }),
  designation: zod.string().min(1, { message: 'Designation is required!' }),
});

// ----------------------------------------------------------------------

export function DashNewBannerForm() {
  const router = useRouter();

  // console.log('current Check');
  const [files, setFiles] = useState([]);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleRemoveAllFiles = () => setFiles([]);

  // const handleUpload = () => {
  //   console.info("Files uploaded:", files);
  // };

  // const defaultValues = useMemo(
  //   () => ({
  //     name: '',
  //     email: '',
  //     phone: '',
  //     company_id: '',
  //     designation: '',
  //   }),
  //   []
  // );

  const companiesList = [...new Set(_userList.map((user) => user.company))];

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    // defaultValues,
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
      toast.success('Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ width: '100%', p: 1 }}>
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
                  <Field.Text name="section" label="Section" />
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
                    Create Banner
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </Box>
  );
}


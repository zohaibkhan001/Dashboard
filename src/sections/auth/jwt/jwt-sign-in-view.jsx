import { z as zod } from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { logout, superAdminLogin } from 'src/utils/Redux/slices/superadminAuthSlice';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(2, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { checkUserSession } = useAuthContext(); // ✅ Required to bypass AuthProvider
  const { loading, error, isLoggedIn } = useSelector((state) => state.superAdminAuth);

  const password = useBoolean();

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // ✅ Redirect when authentication state is confirmed
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     checkUserSession?.(); // ✅ Ensures session is validated before redirection
  //     toast.success('Login successful!');
  //     router.replace(paths.dashboard.root);
  //   }
  // }, [isLoggedIn, checkUserSession, router]);

  const onSubmit = handleSubmit(async (data) => {
    const action = dispatch(superAdminLogin({ email: data.email, password: data.password }));

    if (superAdminLogin.fulfilled.match(action)) {
      toast.success(action.payload.msg); // ✅ Show success message
      await checkUserSession?.(); // ✅ Validate session after login
      // dispatch(logout());
      // router.refresh();
      console.log('login done');
      // router.replace(paths.dashboard.root); // ✅ Redirect after session validation
    } else {
      throw new Error(action.payload || 'Login failed');
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Sign in to your account</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="Enter your email"
        InputLabelProps={{ shrink: true }}
      />

      <Stack spacing={1.5}>
        {/* <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link> */}

        <Field.Text
          name="password"
          label="Password"
          placeholder="Enter your password"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={loading || isSubmitting}
        loadingIndicator="Signing in..."
      >
        Sign in
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use <strong>{defaultValues.email}</strong>
        {' with password '}
        <strong>{defaultValues.password}</strong>
      </Alert> */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}

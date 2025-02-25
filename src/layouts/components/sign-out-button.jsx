import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'src/routes/hooks';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { logout } from 'src/utils/Redux/slices/superadminAuthSlice'; // ✅ Import Redux logout action

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, ...other }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      dispatch(logout()); // ✅ Clears Redux authentication state
      await checkUserSession?.(); // ✅ Notifies AuthProvider that session is invalid

      onClose?.();
      router.replace(paths.auth.jwt.signIn); // ✅ Redirect to login page
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Unable to logout!');
    }
  }, [dispatch, checkUserSession, onClose, router]);

  return (
    <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}

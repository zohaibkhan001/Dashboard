import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { logout } from 'src/utils/Redux/slices/superadminAuthSlice'; // ✅ Removed checkUserSession

import axios from 'src/utils/axios';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, isLoggedIn, loading } = useSelector((state) => state.superAdminAuth);

  // ✅ Function to check user session using Redux state (no API call)
  const checkUserSession = useCallback(() => {
    try {
      if (token && isValidToken(token)) {
        setSession(token, dispatch); // ✅ Apply token and set expiration handling
        console.log('User session is valid.');
      } else {
        console.warn('Token is invalid or expired.');
        dispatch(logout()); // ✅ If token is invalid, log out
        navigate(paths.auth.jwt.signIn, { replace: true });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      dispatch(logout()); // ✅ Log out on error
      navigate(paths.auth.jwt.signIn, { replace: true });
    }
  }, [dispatch, navigate, token]);

  // ✅ Run once when the app loads (No need to call dispatch for session check)
  useEffect(() => {
    checkUserSession(); // ✅ Validate user session
  }, [checkUserSession]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = isLoggedIn ? 'authenticated' : 'unauthenticated';
  const status = loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: user
        ? {
            ...user,
            role: user?.role ?? 'admin',
          }
        : null,
      checkUserSession, // ✅ Keeping function name unchanged
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

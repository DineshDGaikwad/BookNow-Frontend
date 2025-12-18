import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/authSlice';

export const useAuthPersistence = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth state from localStorage on app load
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch(setUser(user));
        dispatch(setToken(token));
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
  }, [dispatch]);
};
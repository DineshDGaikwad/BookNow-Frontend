import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { setUser, setToken, initializeAuth } from './store/authSlice';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OptimisticUIProvider } from './components/customer/OptimisticUI';
import { OfflineBrowsing } from './components/customer/OfflineSupport';
import { AppRoutes } from './AppRoutes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth state from localStorage
    const token = localStorage.getItem('accessToken');
    const userDataStr = localStorage.getItem('userData');
    
    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        dispatch(setUser(userData));
        dispatch(setToken(token));
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
    
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <OptimisticUIProvider>
        <OfflineBrowsing>
          <div className="App min-h-screen bg-gray-900">
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </OfflineBrowsing>
      </OptimisticUIProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
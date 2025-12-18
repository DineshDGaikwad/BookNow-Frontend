import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OptimisticUIProvider } from './components/customer/OptimisticUI';
import { OfflineBrowsing } from './components/customer/OfflineSupport';
import { AppRoutes } from './AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <OptimisticUIProvider>
          <OfflineBrowsing>
            <div className="App min-h-screen bg-gray-50">
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
    </Provider>
  );
}

export default App;
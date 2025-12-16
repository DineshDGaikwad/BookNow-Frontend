import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';
import { googleAuth } from '../../store/authSlice';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleSignInButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleCredentialResponse = async (response: any) => {
    try {
      await dispatch(googleAuth(response.credential)).unwrap();
      toast.success('Successfully signed in with Google!');
      navigate('/');
    } catch (error: any) {
      toast.error(error || 'Google sign-in failed');
    }
  };

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '698458726464-licrdvk3i6pu4b4ks794p8baoek1ac83.apps.googleusercontent.com',
          callback: handleCredentialResponse,

        });
      console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [handleCredentialResponse]);

  return (
    <div className="w-full">
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <div id="google-signin-button" className="w-full flex justify-center"></div>
    </div>
  );
};

export default GoogleSignInButton;
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { customerLogin, organizerLogin, adminLogin } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';

interface LoginFormProps {
  userType: 'customer' | 'organizer' | 'admin';
}

const LoginForm: React.FC<LoginFormProps> = ({ userType }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      switch (userType) {
        case 'customer':
          result = await dispatch(customerLogin(formData));
          break;
        case 'organizer':
          result = await dispatch(organizerLogin(formData));
          break;
        case 'admin':
          result = await dispatch(adminLogin(formData));
          break;
      }

      if (result.type.endsWith('/fulfilled')) {
        const redirectPath = userType === 'customer' ? '/' : 
                           userType === 'organizer' ? '/organizer' : '/admin';
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getTitle = () => {
    switch (userType) {
      case 'customer': return 'Customer Login';
      case 'organizer': return 'Organizer Login';
      case 'admin': return 'Admin Login';
    }
  };

  const getRegisterLink = () => {
    if (userType === 'admin') return null;
    return (
      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <Link 
          to={`/register/${userType}`} 
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Sign up here
        </Link>
      </p>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="glass-effect rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
            <p className="text-gray-600">Welcome back to BookNow</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            {getRegisterLink()}

            <div className="text-center">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to login options
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
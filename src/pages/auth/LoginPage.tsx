import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="glass-effect rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BookNow</h2>
            <p className="text-gray-600 mb-8">Choose your account type to continue</p>
          </div>

          <div className="space-y-4">
            <Link
              to="/login/customer"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
            >
              <span className="text-xl">🎫</span>
              <span>Customer Login</span>
            </Link>

            <Link
              to="/login/organizer"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
            >
              <span className="text-xl">🎪</span>
              <span>Organizer Login</span>
            </Link>

            <Link
              to="/login/admin"
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
            >
              <span className="text-xl">⚙️</span>
              <span>Admin Login</span>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              New to BookNow?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="glass-effect rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Ticket className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join BookNow</h2>
            <p className="text-gray-600 mb-8">Choose your account type to get started</p>
          </div>

          <div className="space-y-4">
            <Link
              to="/register/customer"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
            >
              <span className="text-xl">🎫</span>
              <span>Join as Customer</span>
            </Link>

            <Link
              to="/register/organizer"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
            >
              <span className="text-xl">🎪</span>
              <span>Become an Organizer</span>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
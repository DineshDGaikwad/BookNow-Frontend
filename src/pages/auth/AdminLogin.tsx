import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const AdminLogin: React.FC = () => {
  return <LoginForm userType="admin" />;
};

export default AdminLogin;
import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const CustomerLogin: React.FC = () => {
  return <LoginForm userType="customer" />;
};

export default CustomerLogin;
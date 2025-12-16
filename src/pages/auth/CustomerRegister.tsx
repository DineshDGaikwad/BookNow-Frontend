import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const CustomerRegister: React.FC = () => {
  return <RegisterForm userType="customer" />;
};

export default CustomerRegister;
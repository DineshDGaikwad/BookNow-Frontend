import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const OrganizerLogin: React.FC = () => {
  return <LoginForm userType="organizer" />;
};

export default OrganizerLogin;
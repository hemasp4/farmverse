import React from 'react';
import Register from '../components/auth/Register';
import MainLayout from '../components/layout/MainLayout';

export default function RegisterPage() {
  return (
    <MainLayout requireAuth={false}>
      <Register />
    </MainLayout>
  );
}


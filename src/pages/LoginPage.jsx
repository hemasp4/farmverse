import React from 'react';
import Login from '../components/auth/Login';
import MainLayout from '../components/layout/MainLayout';

export default function LoginPage() {
  return (
    <MainLayout requireAuth={false}>
      <Login />
    </MainLayout>
  );
}

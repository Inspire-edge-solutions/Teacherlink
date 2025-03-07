import React from 'react';
import Head from './components/header';
import Forget from './components/forget';

const ForgetPassword = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Head />
      <div className="flex-grow-1">
        <Forget />
      </div>
    </div>
  );
};

export default ForgetPassword;
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import CommonForm from '../../components/common/form';
import { loginFormControls } from '../../config';

const initialState = {
  email: '',
  password: ''
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);

  function onSubmit(e) {
    
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Welcome back</h1>
        <p className='mt-2'>
          Don't have an account?{' '}
          <Link className="font-medium text-primary hover:underline" to='/auth/register'>Register</Link>
        </p>
      </div>
      <CommonForm 
        formControls={loginFormControls} 
        buttonText='Login'
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;

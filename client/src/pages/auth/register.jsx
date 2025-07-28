import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import CommonForm from '../../components/common/form';
import { registerFormControls } from '../../config';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/auth-slice';
import { toast } from "sonner";

const initialState = {
  userName: '',
  email: '',
  password: ''
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(registerUser(formData)).then((data) => {
      const res = data?.payload;

      if (res?.success) {
        toast.success(res.message);
        navigate("/auth/login");
      } else if (res?.errors) {
        //Display all validation errors
        res.errors.forEach((err) => {
          toast.error(err.msg);
        });
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    });
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Create new account</h1>
        <p className='mt-2'>
          Already have an account?{' '}
          <Link className="font-medium text-primary hover:underline" to='/auth/login'>Login</Link>
        </p>
      </div>
      <CommonForm 
        formControls={registerFormControls} 
        buttonText={'Sign Up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthRegister;

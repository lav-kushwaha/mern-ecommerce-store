import React from 'react'
import { Button } from '../ui/button';
import { AlignJustify } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser, resetTokenAndCredentials } from '../../store/auth-slice';
import { toast } from 'sonner';
import {useNavigate } from 'react-router-dom';

const AdminHeader = ({setOpen}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout(){
        dispatch(resetTokenAndCredentials());
        sessionStorage.clear();
        navigate('/auth/login');
        toast.success("Logout Successfully!");
    // dispatch(logoutUser()).then((data)=>{
    //    if(data?.payload?.success){
    //     toast.success(data?.payload?.message)
    //    }
    // })
  }
  return (
    <header className='flex items-center justify-between px-4 py-3 bg-background border-b'>
     <Button onClick={()=>setOpen(true)} className="lg:hidden sm:block cursor-pointer">
        <AlignJustify/>
        <span className='sr-only'>Toggle Menu</span>
    </Button>
    <div className='flex flex-1 justify-end'>
      <Button className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow cursor-pointer" onClick={()=>handleLogout()} >Logout</Button>
    </div>
  </header>
  )
}

export default AdminHeader;
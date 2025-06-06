import { ChartNoAxesCombined } from 'lucide-react';
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom';

function MenuItems(){
  
}

const AdminSidebar = () => {
  const navigate = useNavigate();
  return <Fragment>
    <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
      <div className='flex items-center gap-2 cursor-pointer' onClick={()=>navigate("/admin/dashboard")}>
          <ChartNoAxesCombined size={30} />
          <h1 className='text-xl font-bold'>Admin Pannel</h1>
      </div>
      </aside>
  </Fragment>
}

export default AdminSidebar;
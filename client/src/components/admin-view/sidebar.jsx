import { ChartNoAxesCombined } from 'lucide-react';
import { BadgeCheck, LayoutDashboard, ShoppingBasket } from "lucide-react"
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom';
import { adminSidebarMenuItems } from 'src/config';

export const adminSidebarMenuItems = [
    {
        id:'dashboard',
        label: 'Dashboard',
        path : '/admin/dashboard',
        icon: <LayoutDashboard/>
    },
    {
        id:'products',
        label: 'Products',
        path : '/admin/products',
        icon: <ShoppingBasket/>

    },
    {
        id:'orders',
        label: 'Products',
        path : '/admin/orders',
        icon: <BadgeCheck/>
    },
]

function MenuItems(){
    const navigate = useNavigate();
    return <nav className='mt-8 flex-col flex gap-2'>
    {
      adminSidebarMenuItems.map(menuItem=><div key={menuItem.id} onClick={()=>navigate(menuItem.path)} className='flex items-center gap-2 rounded-md px-3 py-2'>
          {menuItem.icon}
          <span>{menuItem.label}</span>
      </div>)
    }
  </nav>
}

const AdminSidebar = () => {
  const navigate = useNavigate();
  return <Fragment>
    <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
      <div className='flex items-center gap-2 cursor-pointer' onClick={()=>navigate("/admin/dashboard")}>
          <ChartNoAxesCombined size={30} />
          <h1 className='text-xl font-bold'>Admin Pannel</h1>
      </div>
      <MenuItems/>
      </aside>
  </Fragment>
}

export default AdminSidebar;
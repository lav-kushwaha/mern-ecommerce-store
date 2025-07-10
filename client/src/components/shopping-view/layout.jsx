import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingHeader from './header'
import ShoppingFooter from './footer'

const ShoppingLayout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
        {/*common header*/}
        <ShoppingHeader/>
        <main className='flex pt-16 flex-col w-full'>
            <Outlet/>
        </main>
        <ShoppingFooter/>
    </div>
  )
}

export default ShoppingLayout
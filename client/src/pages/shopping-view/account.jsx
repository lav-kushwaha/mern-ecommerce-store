import React from 'react'
import accImg from '../../assets/account.jpg'
import { Tabs } from '../../components/ui/tabs'
import { TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import Address from '../../components/shopping-view/address'
import ShoppingOrders from '../../components/shopping-view/orders'

const ShoppingAccount = () => {

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50">
      {/* Full-Width Banner */}
      <div className="relative w-full h-[300px] overflow-hidden shadow-md">
        <img 
          src={accImg} 
          alt="Account Banner" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Full-Width Main Section */}
      <div className="w-full px-4 sm:px-6 lg:px-12 py-10">
        <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <Tabs defaultValue="orders">
            {/* Tab Buttons */}
            <TabsList className="flex justify-start mb-6 space-x-4">
              <TabsTrigger 
                className="px-4 py-2 rounded-md text-sm font-medium transition-all border border-gray-300 hover:bg-gray-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                value="orders"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                className="px-4 py-2 rounded-md text-sm font-medium transition-all border border-gray-300 hover:bg-gray-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                value="address"
              >
                Address
              </TabsTrigger>
            </TabsList>

            {/* Tabs Content */}
            <TabsContent value="orders">
              <ShoppingOrders/>
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ShoppingAccount

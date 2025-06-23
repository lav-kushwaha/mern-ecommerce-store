import React from 'react'
import { SheetContent,SheetHeader,SheetTitle } from '../ui/sheet'

const UserCartWrapper = () => {
  return (
    <SheetContent className="sm:max-w-md">
        <SheetHeader>
           <SheetTitle>
             Your Cart
           </SheetTitle>
        </SheetHeader>
    </SheetContent>
  )
}

export default UserCartWrapper
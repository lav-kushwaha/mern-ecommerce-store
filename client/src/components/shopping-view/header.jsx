import React, { useEffect, useState } from 'react';
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { logoutUser } from '../../store/auth-slice';
import { toast } from 'sonner';
import { shoppingViewHeaderMenuItems } from '../../config';
import UserCartWrapper from './cart-wrapper';
import { fetchCartItems } from '../../store/shop/cart-slice';

function MenuItems() {
  const navigate = useNavigate();

  function handleNavigate(getCurrentMenuItem){
    sessionStorage.removeItem("filters");
    const currentFilter = getCurrentMenuItem.id !=='home'? 
    {
      category:[getCurrentMenuItem.id]
    }
    : null 
    sessionStorage.setItem('filters',JSON.stringify(currentFilter));
    navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col gap-4 lg:gap-6 lg:flex-row lg:items-center">
      {shoppingViewHeaderMenuItems.map((item) => (
        <label
          onClick={()=>handleNavigate(item)}
          key={item.id}
          to={item.path}
          className="font-medium cursor-pointer text-[18px] hover:text-gray-500 transition-colors"
        >
          {item.label}
        </label>
      ))}
    </nav>
  );
}

function HeaderRightContent({ isMobile = false }) {
  const { user } = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state)=>state.shopCart);
  const[openCartSheet,setOpenCartSheet] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser())
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
        }
      })
      .catch((err) => {
        console.log(err?.message);
      });
  };

  //fetch cartItems to persist in cart.
  useEffect(()=>{
    dispatch(fetchCartItems({userId:user?._id}))
  },[dispatch])

  const AccountLinks = (
    <>
      <Link
        to="/shop/account"
        className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-blue-100 rounded-md"
      >
        <UserCog className="w-4 h-4" />
        Account
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-100 rounded-md"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-4 border-t">
        <div className="text-sm font-semibold">Logged in as {user?.userName}</div>
        {AccountLinks}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
     
     <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}>
       <Button onClick={()=>setOpenCartSheet(true)} variant="outline" size="icon" className="cursor-pointer">
        <ShoppingCart className="w-6 h-6" />
        <span className="sr-only">User cart</span>
      </Button>
      <UserCartWrapper cartItems={cartItems}/>
     </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-bold">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mt-2">
          <DropdownMenuLabel className="text-sm font-medium">
            Logged in as {user?.userName?.toUpperCase() || 'User'}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/shop/account" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" /> Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-md">
      <div className="flex h-17 items-center justify-between px-4 md:px-6">
        {/* Brand Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 ">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold text-lg">Lav Store</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-4 space-y-6">
            <MenuItems />
            {isAuthenticated && <HeaderRightContent isMobile />}
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          <MenuItems />
        </div>

        {/* Right Side (Cart + Avatar) */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center">
            <HeaderRightContent />
          </div>
        )}
      </div>
    </header>
  );
}

export default ShoppingHeader;

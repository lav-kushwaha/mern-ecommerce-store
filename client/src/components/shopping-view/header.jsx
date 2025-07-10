import React, { useEffect, useState } from 'react';
import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
} from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
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

function MenuItems({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigate = (item) => {
    sessionStorage.removeItem('filters');
    const filter =
      item.id !== 'home' && item.id !== 'products'
        ? { category: [item.id] }
        : null;

    sessionStorage.setItem('filters', JSON.stringify(filter));

    if (location.pathname.includes('listing') && filter !== null) {
      setSearchParams(new URLSearchParams(`?category=${item.id}`));
    } else {
      navigate(item.path);
    }

    onNavigate?.();
  };

  const isItemActive = (item) => {
    if (item.id === 'home') return location.pathname === '/shop/home';
    if (item.id === 'products') {
      return location.pathname === '/shop/listing' && !searchParams.get('category');
    }
    if (
      location.pathname === '/shop/listing' &&
      searchParams.get('category') === item.id
    ) {
      return true;
    }
    if (item.id === 'search') {
      return location.pathname === '/shop/search';
    }
    return false;
  };

  return (
    <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
      {shoppingViewHeaderMenuItems.map((item) => {
        const active = isItemActive(item);
        return (
          <span
            key={item.id}
            onClick={() => handleNavigate(item)}
            className={`cursor-pointer text-[17px] font-medium transition-colors ${
              active
                ? 'text-black font-semibold underline-offset-4'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {item.label}
          </span>
        );
      })}
    </nav>
  );
}

function HeaderRightContent({ isMobile = false, onNavigate, isMobileCartOnly = false }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCartItems({ userId: user._id }));
    }
  }, [dispatch, user?._id]);

  const totalItemCount = cartItems.items?.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutUser())
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res.payload.message);
        }
      })
      .catch((err) => console.error(err));
  };

  if (isMobileCartOnly) {
    return (
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative ml-auto lg:hidden">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
                {totalItemCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems}
        />
      </Sheet>
    );
  }

  if (!user) {
    return isMobile ? (
      <div className="flex flex-col gap-3 border-t pt-4">
        <Link to="/auth/login" onClick={onNavigate} className="text-sm text-blue-600 font-medium">Login</Link>
        <Link to="/auth/register" onClick={onNavigate} className="text-sm text-blue-600 font-medium">Register</Link>
      </div>
    ) : (
      <div className="flex items-center gap-4">
        <Link to="/auth/login" className="text-sm text-blue-600 font-medium hover:underline">Login</Link>
        <Link to="/auth/register" className="text-sm text-blue-600 font-medium hover:underline">Register</Link>
      </div>
    );
  }

  const accountSection = (
    <>
      <Link to="/shop/account" onClick={onNavigate} className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-blue-50 rounded-md">
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

  return isMobile ? (
    <div className="flex flex-col gap-3 pt-4 border-t">
      <div className="text-sm font-semibold">Hi, {user?.userName}</div>
      {accountSection}
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
                {totalItemCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer ring-1 ring-gray-300">
            <AvatarFallback className="bg-gray-800 text-white">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel className="text-sm">
            Hi, {user?.userName?.toUpperCase()}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/shop/account" onClick={onNavigate}>
              <UserCog className="w-4 h-4 mr-2" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openMobileSheet, setOpenMobileSheet] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white shadow-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="w-6 h-6" />
          <span className="text-xl font-bold text-gray-800">Lav Store</span>
        </Link>

        {/* Mobile Cart & Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && <HeaderRightContent isMobileCartOnly />}
          <Sheet open={openMobileSheet} onOpenChange={setOpenMobileSheet}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-4 space-y-6">
              <MenuItems onNavigate={() => setOpenMobileSheet(false)} />
              <HeaderRightContent isMobile onNavigate={() => setOpenMobileSheet(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <MenuItems />
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;

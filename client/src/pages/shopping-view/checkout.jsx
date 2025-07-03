import React, { useState } from 'react'
import img from "../../assets/account.jpg"
import Address from '../../components/shopping-view/address';
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemsContent from '../../components/shopping-view/cart-items-content';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { createNewOrder } from '../../store/shop/order-slice';

const ShoppingCheckout = () => {

  const {cartItems} = useSelector((state)=>state.shopCart);
  const {items} = cartItems;
  const {user} = useSelector((state)=>state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();

  // console.log(cartItems,"item");

 const totalPrice = cartItems?.items?.reduce((acc, item) => {
    const price = item?.salePrice > 0 ? item.salePrice : item.price;
    return acc + price * item.quantity;
  }, 0);
  
  
   function handleInitiatePaypalPayment(){
      const orderData = {
        userId: user?._id,
        cartId: cartItems?._id,
        cartItems: items?.map((singleCartItem) => ({
          productId:singleCartItem?.productId,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
          quantity: singleCartItem?.quantity,
        })),
        addressInfo: {
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          pincode: currentSelectedAddress?.pincode,
          phone: currentSelectedAddress?.phone,
          notes: currentSelectedAddress?.notes,
        },
        orderStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "pending",
        totalAmount: totalPrice,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId: "",
        payerId: "",
      };
 
      console.log(orderData);

      dispatch(createNewOrder(orderData)).then((data)=>{
          console.log(data, "Lav")
      })
      
   }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='relative h-[300px] w-full overflow-hidden'>
        <img src={img} className='h-full w-full object-cover object-center' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5'>
        <Address setCurrentSelectedAddress={setCurrentSelectedAddress}/>
        <div className='flex flex-col gap-4'>
          {
            items && items.length > 0  ?
            items.map((cartItem)=>(
              <UserCartItemsContent cartItem={cartItem}/>
            )) : "There is no cart items!"
          }
         <div className='mt-8 space-y-4'> 
          <div className='flex justify-between'>
            <span className='font-bold'>Total</span>
            <span className='font-bold'>₹{totalPrice}</span>
          </div>
        </div>
        <div className="mt-4 w-full">
          <Button onClick={handleInitiatePaypalPayment} className="w-full">Checkout With Paypal</Button>
        </div>
        </div>
      </div>
    </div> 
  )
}

export default ShoppingCheckout;
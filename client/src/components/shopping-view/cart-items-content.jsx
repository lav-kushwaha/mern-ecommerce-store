import React from 'react';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, fetchCartItems } from '../../store/shop/cart-slice';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';


const UserCartItemsContent = ({ cartItem }) => {
  const dispatch = useDispatch()
  const {user} = useSelector((state)=>state.auth)
  const {
    image,
    title,
    quantity,
    price,
    salePrice,
    productId,
  } = cartItem;

  const finalPrice = salePrice > 0 ? salePrice : price;
  const itemTotal = finalPrice * quantity;

 function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?._id, productId: getCartItem?.productId })
    ).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        toast.success(data?.payload?.data?.message);
      }
    });
  }


  return (
    <div className="flex items-start space-x-4 border-b pb-4">
      {/* Product Image */}
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-contain rounded-md border bg-white"
      />

      {/* Product Info */}
      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium leading-tight line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          ₹{salePrice > 0 ? salePrice : price} × {quantity}
        </p>
        <p className="text-sm font-semibold text-primary">Total: ₹{itemTotal}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-1">
          <Button size="sm" variant="outline" >
            -
          </Button>
          <span className="text-sm">{quantity}</span>
          <Button size="sm" variant="outline">
            +
          </Button>
        </div>
      </div>

      {/* Remove Button */}
      <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
    </div>
  );
};

export default UserCartItemsContent;

import React from 'react';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCartItem,
  fetchCartItems,
  updateCartQuantity,
} from '../../store/shop/cart-slice';
import { Minus, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

const UserCartItemsContent = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);

  const { image, title, quantity, price, salePrice, productId } = cartItem;

  const finalPrice = salePrice > 0 ? salePrice : price;
  const itemTotal = finalPrice * quantity;

  const currentProduct = productList.find((product) => product._id === productId);
  const totalStock = currentProduct?.totalStock ?? Infinity;

  const handleCartItemDelete = () => {
    dispatch(deleteCartItem({ userId: user?._id, productId })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.data?.message);
        dispatch(fetchCartItems({ userId: user?._id }));
      }
    });
  };

  const handleUpdateQuantity = (typeOfAction) => {
    const newQty = typeOfAction === 'add' ? quantity + 1 : quantity - 1;

    if (typeOfAction === 'add' && newQty > totalStock) {
      toast.warning(`Only ${totalStock} items available in stock`);
      return;
    }

    if (newQty < 1) return;

    dispatch(
      updateCartQuantity({
        userId: user?._id,
        productId,
        quantity: newQty,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        dispatch(fetchCartItems({ userId: user?._id }));
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 border rounded-xl shadow-sm bg-white mb-4">
      {/* Product Image */}
      <img
        src={image}
        alt={title}
        className="w-24 h-24 object-contain rounded-md border bg-white"
      />

      {/* Product Info */}
      <div className="flex-1 space-y-2 w-full">
        <div className="flex justify-between items-start gap-4 w-full">
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-snug line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground">
              ${finalPrice} × {quantity}
            </p>
            <p className="text-sm font-medium text-primary">Total: ${itemTotal.toFixed(2)}</p>
          </div>
          <div className="sm:hidden">
            <Trash
              onClick={handleCartItemDelete}
              className="cursor-pointer text-destructive hover:scale-110 transition-transform duration-200 w-6 h-6"
              size={24}
            />
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={quantity === 1}
            onClick={() => handleUpdateQuantity('minus')}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">{quantity}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={quantity >= totalStock}
            onClick={() => handleUpdateQuantity('add')}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Remove Button*/}
      <div className="hidden sm:block">
        <Trash
          onClick={handleCartItemDelete}
          className="cursor-pointer text-destructive hover:scale-110 transition-transform duration-200 w-6 h-6 mt-1"
          size={24}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContent;

import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalPrice = cartItems?.items?.reduce((acc, item) => {
    const price = item?.salePrice > 0 ? item.salePrice : item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
      </div>

      {/* Scrollable cart content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {cartItems?.items?.length > 0 ? (
          cartItems.items.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
            <ShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-1">Your cart is empty</p>
            <p className="text-sm mb-4">Looks like you haven’t added anything yet.</p>
            <Button
              variant="outline"
              onClick={() => {
                setOpenCartSheet(false);
                navigate("/shop/listing");
              }}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems?.items?.length > 0 && (
        <div className="border-t px-6 py-4 bg-white">
          <div className="flex justify-between text-lg font-semibold mb-3">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;

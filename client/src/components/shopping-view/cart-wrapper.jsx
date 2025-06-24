import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems }) {

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

      {/* Scrollable Cart Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {cartItems?.items?.length > 0 ? (
          cartItems.items.map((item) => (
            <UserCartItemsContent
              key={item.productId}
              cartItem={item}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground mt-8">Your cart is empty.</p>
        )}
      </div>

      {/* Sticky Footer */}
      {cartItems?.items?.length > 0 && (
        <div className="border-t px-6 py-4 bg-white sticky bottom-0">
          <div className="flex justify-between text-lg font-semibold mb-3">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={() => { /* navigate("/checkout") */ }}>
            Proceed to Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;

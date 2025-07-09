import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { captureOrder } from "../../store/shop/order-slice";

const PaypalSuccess = () => {
  const [params] = useSearchParams();
  const orderID = params.get("token"); //PayPal ID
  const orderId = params.get("orderId"); //database Id
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (orderID && orderId) {
      dispatch(captureOrder({ orderID, orderId }))
        .then((action) => {
          console.log(action, "captureOrder");
          
          const status = action.type.endsWith("fulfilled") ? "success" : "failed";
          navigate(`/shop/order-confirmed/${orderId}?status=${status}`);
        })
        .catch(() => {
          navigate(`/shop/order-confirmed/${orderId}?status=failed`);
        });
    }
  }, [orderID, orderId, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Processing Your Payment</h2>
        <p className="text-gray-500 mt-3">
          Please wait while we confirm your payment with PayPal. This may take a few seconds.
        </p>
      </div>
    </div>
  );
};

export default PaypalSuccess;

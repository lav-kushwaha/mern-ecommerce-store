import { Link, useParams, useSearchParams } from "react-router-dom";

const OrderConfirmed = () => {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const status = params.get("status");
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center 
          ${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
          <svg
            className={`w-8 h-8 ${isSuccess ? "text-green-600" : "text-red-600"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isSuccess ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </div>

        <h2 className={`text-2xl font-bold ${isSuccess ? "text-green-700" : "text-red-700"}`}>
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </h2>

        <p className="text-gray-600 mt-2">
          {isSuccess
            ? `Your order #${orderId} has been confirmed.`
            : `We couldn’t confirm order #${orderId}.`}
        </p>

        <Link
          to={isSuccess ? "/shop/account" : "/shop/checkout"}
          className={`mt-6 inline-block px-6 py-2 rounded transition font-medium 
            ${isSuccess
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
            }`}
        >
          {isSuccess ? "View My Orders" : "Retry Checkout"}
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmed;

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import OrderDetailsPDF from './OrderDetailsPDF';

const ShoppingOrderDetailsView = ({ order }) => {
  if (!order) {
    return <p className="text-center text-sm text-muted-foreground">Loading order details...</p>;
  }

  const {
    _id,
    userName,
    orderDate,
    totalAmount,
    orderStatus,
    cartItems = [],
    addressInfo = {},
    paymentId,
    paymentMethod,
    paymentStatus,
  } = order;

  return (
    <div className="grid gap-6 text-sm sm:text-base max-w-full">
      {/* Order Summary */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Order ID</span><Label>{_id}</Label></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Order Date</span><Label>{new Date(orderDate).toLocaleDateString()}</Label></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Amount</span><Label>${totalAmount}</Label></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><Label className={`${orderStatus === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>{orderStatus}</Label></div>
           <div className="flex items-center justify-between"><span className="text-muted-foreground">Payment Id</span><Label>{paymentId || 'N/A'}</Label></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Payment Method</span><Label className="capitalize">{paymentMethod || 'N/A'}</Label></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Payment Status</span><Label className={`${paymentStatus === 'unpaid' ? 'text-red-600' : 'text-green-600'}`}>{paymentStatus}</Label></div>
        </div>
      </div>

      <Separator />

      {/* Order Items */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Order Items</h2>
        <ul className="grid gap-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <li key={item._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover border" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-right sm:text-left">${item.price}</p>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No items found.</li>
          )}
        </ul>
      </div>

      <Separator />

      {/* Shipping Info */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Shipping Info</h2>
        <div className="grid gap-1 text-muted-foreground">
          <span><strong>Name:</strong> {userName || 'N/A'}</span>
          <span><strong>Address:</strong> {addressInfo.address || 'N/A'}</span>
          <span><strong>City:</strong> {addressInfo.city || 'N/A'}</span>
          <span><strong>Pincode:</strong> {addressInfo.pincode || 'N/A'}</span>
          <span><strong>Phone:</strong> {addressInfo.phone || 'N/A'}</span>
          <span><strong>Notes:</strong> {addressInfo.notes || 'N/A'}</span>
        </div>
      </div>

      {/* PDF Download */}
      <div className="mt-6">
        <PDFDownloadLink
          document={<OrderDetailsPDF order={order} />}
          fileName={`Order_${order._id}.pdf`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default ShoppingOrderDetailsView;

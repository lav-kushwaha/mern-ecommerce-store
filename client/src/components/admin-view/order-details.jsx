import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import CommonForm from '../common/form';

const initialFormData = {
  status: '',
};

const AdminOrderDetailsView = ({ order }) => {
  const [formData, setFormData] = useState({
    status: order?.orderStatus || '',
  });

  const handleUpdateStatus = (event) => {
    event.preventDefault();
    // Dispatch update action here
    console.log('Updated status:', formData.status);
  };

  if (!order) return <p className="text-muted-foreground">Loading order details...</p>;

  return (
    <div className="grid gap-6 text-sm sm:text-base">
      {/* Order Summary */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <Label>{order._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order Date</span>
            <Label>{new Date(order.orderDate).toLocaleDateString()}</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order Price</span>
            <Label>₹{order.totalAmount}</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order Status</span>
            <Label className="capitalize text-green-600">{order.orderStatus}</Label>
          </div>
        </div>
      </div>

      <Separator />

        {/* Order Items */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Order Items</h2>
        <ul className="grid gap-4">
          {order?.cartItems.length > 0 ? (
            order?.cartItems.map((item) => (
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
        <div className="grid gap-0.5 text-muted-foreground">
          <span><strong>Name:</strong>  {order.userName}</span>
          <span><strong>Address:</strong>  {order.addressInfo?.address}</span>
          <span> <strong>City:</strong> {order.addressInfo?.city}</span>
          <span> <strong>Pincode:</strong> {order.addressInfo?.pincode}</span>
          <span> <strong>Phone:</strong> {order.addressInfo?.phone}</span>
          {order.addressInfo?.notes && <span><strong>Note:</strong> {order.addressInfo.notes}</span>}
        </div>

        <CommonForm
          formControls={[
            {
              label: 'Order Status',
              name: 'status',
              componentType: 'select',
              options: [
                { id: 'pending', label: 'Pending' },
                { id: 'inProcess', label: 'In Process' },
                { id: 'inShipping', label: 'In Shipping' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'rejected', label: 'Rejected' },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={'Update Order Status'}
          onSubmit={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default AdminOrderDetailsView;

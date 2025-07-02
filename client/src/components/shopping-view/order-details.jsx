import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';


const ShoppingOrderDetailsView = () => {

  return (

    <div className="grid gap-6 text-sm sm:text-base">
      {/* Order Summary */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <Label>123456</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order Date</span>
            <Label>27/12/2025</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order Price</span>
            <Label>₹2,000</Label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order Status</span>
            <Label className="text-yellow-600">In Process</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Products */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Order Items</h2>
        <ul className="grid gap-3">
          <li className="flex items-center justify-between">
            <span>Product One</span>
            <span className="font-medium">₹200,000</span>
          </li>
        </ul>
      </div>

      <Separator />

      {/* Shipping Info */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-800">Shipping Info</h2>
        <div className="grid gap-0.5 text-muted-foreground">
          <span>John Doe</span>
          <span>Address</span>
          <span>City</span>
          <span>Pincode</span>
          <span>Phone</span>
          <span>Notes</span>
        </div>
      </div>
    </div>
  );
};

export default ShoppingOrderDetailsView;

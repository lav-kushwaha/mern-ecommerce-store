import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

const AddressCard = ({
  addressInfo,
  selectedAddressId,
  setCurrentSelectedAddress,
  handleEditAddress,
  handleDeleteAddress,
}) => {
  const isSelected = selectedAddressId === addressInfo._id;

  return (
    <Card
      onClick={() => setCurrentSelectedAddress?.(addressInfo)}
      className={`relative group flex flex-col justify-between h-full rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-300/40 shadow-md bg-blue-50'
          : 'border-gray-200 hover:shadow-md hover:border-blue-300'
      }`}
    >
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* Selected Tag */}
        {isSelected && (
          <div className="absolute top-2 right-2 text-xs font-medium text-blue-600 flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full shadow-sm">
            <CheckCircle className="w-4 h-4" />
            Selected
          </div>
        )}

        {/* Address Details */}
        <div className="space-y-1 text-sm text-gray-800">
          <div>
            <span className="font-semibold text-gray-600">Address:</span> {addressInfo.address}
          </div>
          <div>
            <span className="font-semibold text-gray-600">City:</span> {addressInfo.city}
          </div>
          <div>
            <span className="font-semibold text-gray-600">Pincode:</span> {addressInfo.pincode}
          </div>
          <div>
            <span className="font-semibold text-gray-600">Phone:</span> {addressInfo.phone}
          </div>
          {addressInfo.notes && (
            <div>
              <span className="font-semibold text-gray-600">Notes:</span> {addressInfo.notes}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEditAddress(addressInfo);
            }}
            className="flex items-center gap-1 text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(addressInfo);
            }}
            className="flex items-center gap-1 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;

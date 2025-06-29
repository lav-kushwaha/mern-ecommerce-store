import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Pencil, Trash2 } from 'lucide-react'

const AddressCard = ({ addressInfo, handleEditAddress ,handleDeleteAddress }) => {
  return (
    <Card className="relative group flex flex-col justify-between h-full rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">

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
        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditAddress(addressInfo)}
            className="flex items-center gap-1 text-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteAddress(addressInfo)}
            className="flex items-center gap-1 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AddressCard

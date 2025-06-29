import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { addressFormControls } from '../../config'
import { useDispatch, useSelector } from 'react-redux'
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses
} from '../../store/shop/address-slice'
import AddressCard from './address-card'
import { toast } from 'sonner'

const initialAddressFormData = {
  address: '',
  city: '',
  phone: '',
  pincode: '',
  notes: ''
}

const Address = () => {
  const [formData, setFormData] = useState(initialAddressFormData)
  const [currentEditId, setCurrentEditId] = useState(null) 
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { addressList } = useSelector((state) => state.shopAddress)

  // Handle Add or Edit submission
  function handleManageAddress(event) {
    event.preventDefault();

    if(addressList.length>=3 && currentEditId===null){
      toast.warning("You can add max 3 addresses!");
      return;
    }

    if (currentEditId !== null) {
      dispatch(editAddress({
        userId: user?._id,
        addressId: currentEditId,
        formData
      })).then((data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message)
          dispatch(fetchAllAddresses(user?._id))
          setFormData(initialAddressFormData)
          setCurrentEditId(null)
        }
      })
    } else {
      dispatch(addNewAddress({
        ...formData,
        userId: user?._id
      })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?._id))
          toast.success(data?.payload?.message)
          setFormData(initialAddressFormData)
        }
      })
    }
  }

  //Populate form for editing
  function handleEditAddress(address) {
    setCurrentEditId(address?._id)
    setFormData({
      address: address?.address || '',
      city: address?.city || '',
      phone: address?.phone || '',
      pincode: address?.pincode || '',
      notes: address?.notes || ''
    })
  }

  // Handle delete
  function handleDeleteAddress(address) {
    dispatch(deleteAddress({ userId: user?._id, addressId: address?._id }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user._id))
          toast.success(data?.payload?.message)
        }
      })
  }

  function isFormValid() {
    return Object.values(formData)
      .map((val) => val.trim() !== '')
      .every(Boolean)
  }

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAllAddresses(user._id))
    }
  }, [dispatch, user?._id])

  return (
    <div className="space-y-6">
      {/* Address List Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {addressList && addressList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {addressList.map((address, index) => (
                <AddressCard
                  key={index}
                  addressInfo={address}
                  handleEditAddress={handleEditAddress}
                  handleDeleteAddress={handleDeleteAddress}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No addresses added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {currentEditId !== null ? 'Edit Address' : 'Add New Address'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditId !== null ? 'Update Address' : 'Add Address'}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Address

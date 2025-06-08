import React, { useState } from 'react'
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetHeader,SheetTitle } from '../../components/ui/sheet';
import CommonForm from '../../components/common/form';
import { addProductFormElements } from '../../config';
import ProductImageUpload from '../../components/admin-view/image-upload';

const initialFormData = {
  image:null,
  title:'',
  description:'',
  category: '',
  brand:'',
  price:"",
  salePrice:'',
  totalStock:''
}

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData,setFormData] = useState(initialFormData);
  
  const [imageFile,setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('') 

  function onSubmit(){

  }

  return (
    <>
      <div className='mb-5 w-full flex justify-end'>
        <Button  className='cursor-pointer' onClick={()=>setOpenCreateProductsDialog(true)}>Add New Products</Button>
      </div>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'></div>
      <Sheet open={openCreateProductsDialog} onOpenChange={()=>{
        setOpenCreateProductsDialog(false)
      }}>
       <SheetContent side="right" className="overflow-y-auto max-h-screen max-w-xl w-full p-6">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
        </SheetHeader>
        <ProductImageUpload 
        imageFile={imageFile} 
        setImageFile={setImageFile} 
        uploadedImageUrl={uploadedImageUrl} 
        setUploadedImageUrl={setUploadedImageUrl}
        />
        <div className="mt-6">
          <CommonForm
            onSubmit={onSubmit}
            formData={formData}
            setFormData={setFormData}
            buttonText="Add"
            formControls={addProductFormElements}
          />
        </div>
      </SheetContent>
      </Sheet>
    </>
  )
}

export default AdminProducts;
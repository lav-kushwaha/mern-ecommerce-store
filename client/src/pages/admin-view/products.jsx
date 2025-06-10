import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetHeader,SheetTitle } from '../../components/ui/sheet';
import CommonForm from '../../components/common/form';
import { addProductFormElements } from '../../config';
import ProductImageUpload from '../../components/admin-view/image-upload';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProduct, fetchAllProducts } from '../../store/admin/products-slice';
import { toast } from "sonner"


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
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const {productList} = useSelector((state)=>state.adminProduct);  

  const dispatch = useDispatch();

  //add products
  function onSubmit(event){
    event.preventDefault();
    dispatch(addNewProduct({
      ...formData,
      image:uploadedImageUrl
    })
  ).then((data)=>{
        console.log(data);
        if(data?.payload?.success){
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast.success(data.payload.message); 
        }
     })
    .catch((err)=>{ 
        console.log(err.msg);
    })
  }

  useEffect(()=>{
    dispatch(fetchAllProducts());
  },[dispatch])

  return (
    <>
      <div className='mb-5 w-full flex justify-end'>
        <Button  className='cursor-pointer' onClick={()=>setOpenCreateProductsDialog(true)}>Add New Products</Button>
      </div>

      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'></div>
      <Sheet open={openCreateProductsDialog} onOpenChange={()=>{setOpenCreateProductsDialog(false)}}>
       <SheetContent side="right" className="overflow-y-auto max-h-screen max-w-xl w-full p-6">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
        </SheetHeader>

        <ProductImageUpload 
        imageFile={imageFile} 
        setImageFile={setImageFile} 
        uploadedImageUrl={uploadedImageUrl} 
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
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
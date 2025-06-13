import React, { useEffect, useRef } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';


const ProductImageUpload = ({
  imageFile,
  setImageFile,
  imageLoadingState, 
  uploadedImageUrl, 
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode
}) => {

const inputRef = useRef(null);

//select file
function handleImageFileChange(event){
    // console.log(event.target.files);
    const selectedFile = event.target.files?.[0]    
    if(selectedFile) setImageFile(selectedFile);
}

//drop file
function handleDrop(event){
   event.preventDefault();
   const droppedFile = event.dataTransfer.files?.[0];
  // console.log(droppedFile)
   if(droppedFile) setImageFile(droppedFile);
}

//handle drag drop
function handleDragOver(event){
    event.preventDefault();
}

  //handleremove image
function handleRemoveImage(event){
  setImageFile(null);
  if(inputRef.current){
    //we are clearing input current value so that if user try to upload same file, 
    //onChange will be trigger otherwise it wont trigger and if it wont trigger file will not be upload.
    inputRef.current.value = "";
  }
}

//upload image on cloudinary API
async function uploadImageToCloudinary() {
   setImageLoadingState(true);
   const data = new FormData();  //webAPI
   data.append('my_file',imageFile);
   const response = await axios.post("http://localhost:5000/api/admin/products/upload-image", data);
   console.log(response?.data);
   if(response?.data?.success){    
    setUploadedImageUrl(response?.data?.data?.url);
    setImageLoadingState(false);
   } 
}

useEffect(()=>{
  if(imageFile!==null) uploadImageToCloudinary();
},[imageFile])


  return (
    <div className='w-full max-w-md mx-auto mt-4'>
        <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
        <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode?'opacity-60':""}border-2 border-dashed rounded-lg p-4`}>
            <Input 
            id="image-upload" 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            onChange={handleImageFileChange}
            disabled={isEditMode}
            />
            {
              !imageFile ? 
              
             ( <Label htmlFor="image-upload" className={`${isEditMode?"cursor-not-allowed":" "}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                  <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2'/>
                  <span>Drag & Drop or Click To Upload Image </span>
              </Label>)
              : (
                // <Skeleton className= 'h-10 bg-gray-100'/>
                  imageLoadingState ? (<span>Loading..</span>) :
                   ( <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <FileIcon className="w-8 text-primary mr-2 h-8 "/>
                      </div>
                      <p className='text-sm font-medium'>{imageFile.name}</p>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={handleRemoveImage}>
                        <XIcon className='w-4 h-4 '/>
                        <span className='sr-only'>Remove File</span>
                      </Button>
                  </div>)
                )
            }
        </div>
    </div>
  ) 
}

export default ProductImageUpload;
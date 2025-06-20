import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import CommonForm from "../../components/common/form";
import { addProductFormElements } from "../../config";
import ProductImageUpload from "../../components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "../../store/admin/products-slice";
import { toast } from "sonner";
import AdminProductTile from "../../components/admin-view/product-tile";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProduct);

  const dispatch = useDispatch();

  // Add or Edit Products
  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setUploadedImageUrls([]);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast.success(data?.payload?.message);
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          images: uploadedImageUrls,
        })
      )
        .then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setUploadedImageUrls([]);
            setFormData(initialFormData);
            toast.success(data?.payload?.message);
          }
        })
        .catch((err) => {
          console.error("Failed to add product:", err);
          toast.error("Failed to add product");
        });
    }
  }

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success(data?.payload?.message);
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => setOpenCreateProductsDialog(true)}
        >
          Add New Products
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.length > 0 &&
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              product={productItem}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              handleDelete={handleDelete}
            />
          ))}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrls([]);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-y-auto max-h-screen max-w-xl w-full p-6"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId != null ? "Edit Product" : "Add Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="mt-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId != null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminProducts;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImage, getFeatureImages } from "../../store/common-slice";
import { toast } from "sonner";
import ProductImageUpload from "../../components/admin-view/image-upload";
import { Button } from "../../components/ui/button";

const AdminDashboard = () => {
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(getFeatureImages());
  }, []);

  const handleUpload = async () => {
    if (uploadedImageUrls.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const res = await dispatch(addFeatureImage(uploadedImageUrls));
    if (res?.payload?.success) {
      toast.success("Images uploaded successfully!");
      setUploadedImageUrls([]);
      dispatch(getFeatureImages());
    } else {
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Feature Images</h1>

    <ProductImageUpload
      uploadedImageUrls={uploadedImageUrls}
      setUploadedImageUrls={setUploadedImageUrls}
    />

    <Button className="mt-6 w-full" onClick={handleUpload}>
      Upload Images
    </Button>

      {/* Render Uploaded Feature Images */}
      <div className="flex flex-col gap-6 mt-8">
      {featureImageList && featureImageList.length > 0 ? (
        featureImageList.map((item, i) =>
          item.images.map((imgUrl, j) => (
            <div
              key={`${i}-${j}`}
              className="w-full overflow-hidden rounded-lg shadow"
            >
              <img
                src={imgUrl}
                alt={`feature-${i}-${j}`}
                className="w-full aspect-[3/1] object-cover"
              />
            </div>
          ))
        )
      ) : (
        <p className="text-muted-foreground text-center">No feature images uploaded yet.</p>
      )}
      </div>

    </div>
  );
};

export default AdminDashboard;

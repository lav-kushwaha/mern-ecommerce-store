import React, { useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";

const MAX_FILES = 5;

const ProductImageUpload = ({
  uploadedImageUrls = [],
  setUploadedImageUrls,
  isEditMode = false,
}) => {
  const inputRef = useRef(null);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const handleImageFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length) uploadMultipleImages(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (droppedFiles.length) uploadMultipleImages(droppedFiles);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleRemoveImage = (urlToRemove) => {
    setUploadedImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const uploadMultipleImages = async (files) => {
    const total = uploadedImageUrls.length + files.length;
    if (total > MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} images.`);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("my_file", file));
    setUploadingFiles(files.map((f) => f.name));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/products/upload-images",
        formData
      );

      if (res?.data?.success) {
        setUploadedImageUrls((prev) => [...prev, ...res.data.data]);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploadingFiles([]);
    }
  };

  return (
    <div className="w-full">
      <Label className="text-lg font-semibold mb-3 block">Upload Images</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        } border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center transition hover:border-primary`}
        onClick={() => {
          if (!isEditMode && uploadedImageUrls.length < MAX_FILES) {
            inputRef.current?.click();
          }
        }}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          multiple
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode || uploadedImageUrls.length >= MAX_FILES}
        />

        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">
          Drag & Drop or Click to Upload (Max {MAX_FILES} images)
        </span>
      </div>

      {/* Uploading status */}
      <div className="mt-2 text-sm text-muted-foreground">
        {uploadingFiles.map((fileName, idx) => (
          <div key={idx} className="flex items-center gap-2 mt-1">
            <FileIcon className="w-4 h-4" />
            Uploading: {fileName}
          </div>
        ))}
      </div>

      {/* Preview thumbnails */}
      {uploadedImageUrls.length > 0 && (
        <div className="mt-4 flex justify-start gap-3 flex-wrap">
          {uploadedImageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative w-[70px] h-[70px] border rounded overflow-hidden"
            >
              <img
                src={url}
                alt={`uploaded-${idx}`}
                className="w-full h-full object-cover"
              />
              {!isEditMode && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-white rounded-full text-red-500 p-0 h-5 w-5"
                >
                  <XIcon className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;

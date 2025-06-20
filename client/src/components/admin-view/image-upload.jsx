import React, { useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';

const MAX_FILES = 5;

const ProductImageUpload = ({
  uploadedImageUrls = [],
  setUploadedImageUrls,
  isEditMode = false
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

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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
    files.forEach((file) => formData.append('my_file', file)); // 💡 Matches backend field name
    setUploadingFiles(files.map((f) => f.name));

    try {
      const res = await axios.post(
        'http://localhost:5000/api/admin/products/upload-images',
        formData
      );

      if (res?.data?.success) {
        setUploadedImageUrls((prev) => [...prev, ...res.data.data]);
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Image upload failed');
    } finally {
      setUploadingFiles([]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? 'opacity-60' : ''
        } border-2 border-dashed rounded-lg p-4`}
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

        <Label
          htmlFor="image-upload"
          className={`${
            isEditMode || uploadedImageUrls.length >= MAX_FILES
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          } flex flex-col items-center justify-center h-32`}
        >
          <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
          <span>
            Drag & Drop or Click to Upload (Max {MAX_FILES} images)
          </span>
        </Label>
      </div>

      {/* Uploading status */}
      <div className="mt-2 text-sm text-muted-foreground">
        {uploadingFiles.length > 0 &&
          uploadingFiles.map((fileName, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <FileIcon className="w-4 h-4" />
              Uploading: {fileName}
            </div>
          ))}
      </div>

      {/* Preview images */}
      {uploadedImageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {uploadedImageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative group border rounded overflow-hidden"
            >
              <img
                src={url}
                alt={`uploaded-${idx}`}
                className="w-full h-24 object-cover"
              />
              {!isEditMode && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500"
                >
                  <XIcon className="w-4 h-4" />
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

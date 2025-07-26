import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="border rounded-xl p-4 animate-pulse space-y-4">
      <div className="h-40 bg-muted rounded-lg" />
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-8 bg-muted rounded w-full" />
    </div>
  );
};

export default ProductSkeleton;

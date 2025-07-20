import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { brandOptionsMap, categoryOptionsMap } from '../../config';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import StartRatingComponent from '../common/star-rating';

const ShoppingProductTile = ({
  product,
  handleAddtoCart,
  cartBtn = true,
  disabled = false,
}) => {
  const isOnSale = product?.salePrice > 0 && product?.salePrice < product?.price;
  const outOfStock = product?.totalStock === 0;
  const lowStock = product?.totalStock > 0 && product?.totalStock < 10;

  const getDiscountPercentage = () => {
    if (isOnSale) {
      const discount = ((product.price - product.salePrice) / product.price) * 100;
      return `${Math.round(discount)}% OFF`;
    }
    return null;
  };

  const averageRating = product?.averageReview;

  return (
    <Card className="group flex flex-col h-full rounded-xl border border-gray-200 bg-white transition hover:shadow-md">
      <Link to={`/shop/product-details/${product._id}`}>
        {/* Image section */}
        <div className="relative bg-gray-50 rounded-t-xl flex items-center justify-center h-60 p-4 overflow-hidden">
          <img
            src={product?.images?.[0] || '/placeholder.jpg'}
            alt={product?.title || 'Product'}
            className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badge */}
          {outOfStock ? (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">Out of Stock</Badge>
          ) : lowStock ? (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              Only {product?.totalStock} left
            </Badge>
          ) : isOnSale ? (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white">
              {getDiscountPercentage()}
            </Badge>
          ) : null}
        </div>
      </Link>

      {/* Product info */}
      <CardContent className="p-4 flex flex-col gap-2 flex-grow">
        <Link to={`/shop/product-details/${product._id}`}>
          <h2 className="text-base font-medium text-gray-800 line-clamp-2 hover:text-gray-600">
            {product?.title || 'Untitled Product'}
          </h2>
        </Link>

        {/* Rating */}
        <div className="min-h-[24px]">
          {averageRating ? (
            <div className="flex items-center gap-1 text-sm text-yellow-500">
              <StartRatingComponent review={{ rating: averageRating }} />
              <span className="text-gray-600 text-xs">({averageRating.toFixed(1)})</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">No reviews</span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{categoryOptionsMap[product?.category] || 'Uncategorized'}</span>
          <span>{brandOptionsMap[product?.brand] || 'Unknown Brand'}</span>
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center mt-1">
          <span
            className={`text-sm font-semibold ${
              isOnSale ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            ${product?.price?.toFixed(2)}
          </span>

          {isOnSale && (
            <span className="text-sm font-bold text-green-600">
              ${product?.salePrice?.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      {/* Add to cart */}
      {cartBtn && (
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full gap-2 text-white text-sm"
            disabled={outOfStock || disabled}
          >
            <ShoppingCart className="w-4 h-4" />
            {outOfStock ? 'Out of Stock' : disabled ? 'Max Limit' : 'Add to Cart'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ShoppingProductTile;

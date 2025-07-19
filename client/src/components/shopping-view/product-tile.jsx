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
    <Card className="group h-full flex flex-col justify-between rounded-2xl transition-all duration-300 bg-white">
      <div>
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
          <Link to={`/shop/product-details/${product._id}`}>
            <img
              src={product?.images?.[0] || '/placeholder.jpg'}
              alt={product?.title || 'Product'}
              className="w-full h-72 object-contain transition-transform duration-300 group-hover:scale-105 p-4"
            />
          </Link>

          {/* Badge */}
          {outOfStock ? (
            <Badge className="absolute top-3 left-3 bg-red-600 text-white shadow">
              Out Of Stock
            </Badge>
          ) : lowStock ? (
            <Badge className="absolute top-3 left-3 bg-yellow-500 text-white shadow">
              Only {product?.totalStock} left
            </Badge>
          ) : isOnSale ? (
            <Badge className="absolute top-3 left-3 bg-green-600 text-white shadow">
              {getDiscountPercentage()}
            </Badge>
          ) : null}
        </div>

        {/* Product Info */}
        <CardContent className="p-4 flex flex-col gap-2">
          <Link to={`/shop/product-details/${product._id}`}>
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-gray-500">
              {product?.title || 'Untitled Product'}
            </h2>
          </Link>

          {/* Rating (Always render for consistent height) */}
          <div className="min-h-[28px]">
            {averageRating ? (
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <StartRatingComponent review={{ rating: averageRating }} />
                <span className="text-gray-600">({averageRating.toFixed(1)})</span>
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
          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-base font-semibold ${
                isOnSale ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              ${product?.price?.toFixed(2)}
            </span>

            {isOnSale && (
              <span className="text-base font-bold text-green-600">
                ${product?.salePrice?.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Add to Cart */}
      {cartBtn && (
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            className="w-full gap-2 text-white"
            disabled={outOfStock || disabled}
          >
            <ShoppingCart className="w-4 h-4" />
            {outOfStock ? 'Out of Stock' : disabled ? 'Max Limit Reached' : 'Add to Cart'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ShoppingProductTile;

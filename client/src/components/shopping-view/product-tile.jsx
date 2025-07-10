import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { brandOptionsMap, categoryOptionsMap } from '../../config';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ShoppingProductTile = ({ product, handleAddtoCart, cartBtn = true }) => {
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

  return (
    <Card className="group w-full transition-all duration-300 border rounded-2xl shadow-sm hover:shadow-lg bg-white">
      <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
        <Link to={`/shop/product-details/${product._id}`}>
          <img
            src={product?.images?.[0] || '/placeholder.jpg'}
            alt={product?.title || 'Product'}
            className="w-full h-72 object-contain transition-transform duration-300 group-hover:scale-105 p-4"
          />
        </Link>

        {/* Badges */}
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

      <CardContent className="p-4 space-y-2">
        <Link to={`/shop/product-details/${product._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 truncate hover:text-gray-500">
            {product?.title || 'Untitled Product'}
          </h2>
        </Link>

        <div className="flex justify-between text-sm text-gray-500">
          <span>{categoryOptionsMap[product?.category] || 'Uncategorized'}</span>
          <span>{brandOptionsMap[product?.brand] || 'Unknown Brand'}</span>
        </div>

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

      {cartBtn && (
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddtoCart(product._id);
            }}
            className="w-full gap-2 text-white"
            disabled={outOfStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ShoppingProductTile;

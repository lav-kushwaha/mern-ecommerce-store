import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const ShoppingProductTile = ({ product }) => {
  return (
    <Card className="w-full max-w-sm mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden border">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-xl"
          />
          {product?.salePrice > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
              SALE
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold truncate">{product?.title}</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{product?.category}</span>
            <span>{product?.brand}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className={`${product?.salePrice > 0 ? 'line-through text-gray-400' : 'text-primary'} text-base font-semibold`}>
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-base font-bold text-green-600">
                ₹{product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full text-white">
            Add To Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default ShoppingProductTile

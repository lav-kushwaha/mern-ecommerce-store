import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchResults, resetSearchResults } from '../../store/search-slice';
import { useSearchParams } from 'react-router-dom';
import ShoppingProductTile from '../../components/shopping-view/product-tile';
import { addToCart, fetchCartItems } from '../../store/shop/cart-slice';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SearchProducts = () => {
  const dispatch = useDispatch();
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const trimmed = keyword.trim();
    const timer = setTimeout(() => {
      if (trimmed.length > 2) {
        setSearchParams({ query: trimmed });
        dispatch(getSearchResults(trimmed));
      } else {
        setSearchParams({});
        dispatch(resetSearchResults());
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, dispatch, setSearchParams]);

  const handleAddtoCart = (productId, totalStock) => {
    const cartItemsList = cartItems?.items || [];
    const existingItem = cartItemsList.find(item => item.productId === productId);
    const existingQty = existingItem?.quantity || 0;

    if (totalStock === 0) {
      toast.warning("This product is out of stock.");
      return;
    }

    if (existingQty + 1 > totalStock) {
      toast.warning(`Only ${totalStock} items available. You already have ${existingQty}.`);
      return;
    }

    dispatch(addToCart({ userId: user?._id, productId, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?._id }));
        toast.success(res.payload.message || 'Added to cart.');
      }
    });
  };

  const renderSkeletons = (count = 8) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="rounded border p-2">
          <Skeleton height={160} />
          <Skeleton height={20} className="mt-2" />
          <Skeleton height={20} width="60%" />
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <input
          className="w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={keyword}
          type="text"
          placeholder="Search for products..."
          onChange={(e) => setKeyword(e.target.value)}
        />

        {keyword.trim().length > 2 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Search Results:</h2>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {renderSkeletons()}
              </div>
            ) : searchResults?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {searchResults.map((product) => {
                  const existingItem = cartItems?.items?.find(
                    (item) => item.productId === product._id
                  );
                  const existingQty = existingItem?.quantity || 0;

                  const isOutOfStock = product.totalStock === 0;
                  const isLimitReached = existingQty >= product.totalStock;

                  return (
                    <ShoppingProductTile
                      key={product._id}
                      product={product}
                      handleAddtoCart={() =>
                        handleAddtoCart(product._id, product.totalStock)
                      }
                      cartBtn={true}
                      disabled={isOutOfStock || isLimitReached}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic mt-4">
                No products found for "{keyword.trim()}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProducts;

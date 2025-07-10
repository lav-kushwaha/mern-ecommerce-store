import React, { useEffect, useMemo, useState } from 'react';
import ProductFilter from '../../components/shopping-view/filter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { sortOptions } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '../../store/shop/products-slice';
import ShoppingProductTile from '../../components/shopping-view/product-tile';
import { useSearchParams } from 'react-router-dom';
import { addToCart, fetchCartItems } from '../../store/shop/cart-slice';
import { toast } from 'sonner';

// Helper to convert filters into search param string
function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(','))}`);
    }
  }
  return queryParams.join('&');
}

const ShoppingListing = () => {
  const dispatch = useDispatch();
  const { productList, loading } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].id);
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySearchParam = searchParams.get('category');

  const productCount = useMemo(() => productList?.length || 0, [productList]);

  // Handle filter toggle
  const handleFilter = (section, option) => {
    const updatedFilters = { ...filters };
    const options = updatedFilters[section] || [];

    if (options.includes(option)) {
      updatedFilters[section] = options.filter((item) => item !== option);
    } else {
      updatedFilters[section] = [...options, option];
    }

    setFilters(updatedFilters);
    sessionStorage.setItem('filters', JSON.stringify(updatedFilters));
  };

  // Handle Clear All filters
  const handleClearAll = () => {
    setFilters({});
    sessionStorage.removeItem('filters');
    setSearchParams({}); // Optional: clears URL filters too
  };

  // Handle Add to Cart
  const handleAddtoCart = (productId) => {
    dispatch(addToCart({ userId: user?._id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?._id }));
        toast.success(data?.payload?.message);
      }
    });
  };

  // Load filters from sessionStorage
  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem('filters')) || {};
    setFilters(storedFilters);
  }, [categorySearchParam]);

  // Update URL when filters change
  useEffect(() => {
    const query = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(query), { replace: true });
  }, [filters, setSearchParams]);

  // Fetch products
  useEffect(() => {
    if (filters && selectedSort) {
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: selectedSort }));
    }
  }, [dispatch, filters, selectedSort]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
      {/* Sidebar Filter */}
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        handleClearAll={handleClearAll}
      />

      {/* Main Section */}
      <div className="bg-white dark:bg-background w-full rounded-xl shadow-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">All Products</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{productCount} Products</span>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuRadioGroup
                  value={selectedSort}
                  onValueChange={(value) => setSelectedSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                      className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {loading ? (
            <p className="text-center col-span-full py-8">Loading products...</p>
          ) : productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem?._id}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full py-8">
              No products found. Try adjusting filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListing;

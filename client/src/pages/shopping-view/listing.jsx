import React, { useEffect, useState } from 'react';
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


function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',');
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join('&');
}

const ShoppingListing = () => {
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({});
  const [selectedSort, setSelectedSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const categorySearchParam = searchParams.get("category");


  const handleFilter = (section, option) => {
    const updateFilter = { ...filters };
    const options = updateFilter[section] || [];

    if (options.includes(option)) {
      updateFilter[section] = options.filter((item) => item !== option);
    } else {
      updateFilter[section] = [...options, option];
    }

    setFilters(updateFilter);
    sessionStorage.setItem('filters', JSON.stringify(updateFilter));
  };

   useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    setSelectedSort(sortOptions[0].id)
    const stored = JSON.parse(sessionStorage.getItem('filters')) || {};
    setFilters(stored);
  }, [categorySearchParam]);

   useEffect(() => {
    if (filters !== null && selectedSort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: selectedSort })
      );
  }, [dispatch, selectedSort, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
      {/* Sidebar */}
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      {/* Product Listing */}
      <div className="bg-white dark:bg-background w-full rounded-xl shadow-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">All Products</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {productList?.length || 0} Products
            </span>

            {/* Sort Menu */}
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
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile key={productItem?._id} product={productItem} />
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

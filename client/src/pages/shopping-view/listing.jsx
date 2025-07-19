import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  setPage,
} from "../../store/shop/products-slice";
import ProductFilter from "../../components/shopping-view/filter";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom";
import { sortOptions } from "../../config";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import { toast } from 'sonner';

const ShoppingListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, isLoading, page, totalPages, totalItems } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ category: [], brand: [] });
  const [sortBy, setSortBy] = useState("price-lowtohigh");
  const [currentPage, setCurrentPage] = useState(1);

  // Load from URL or session storage
  useEffect(() => {
    const categoryParam = searchParams.getAll("category");
    const brandParam = searchParams.getAll("brand");
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const sortParam = searchParams.get("sortBy") || "price-lowtohigh";

    const storedFilters = JSON.parse(sessionStorage.getItem("filters"));

    setFilters(
      categoryParam.length || brandParam.length
        ? { category: categoryParam, brand: brandParam }
        : storedFilters || { category: [], brand: [] }
    );

    setCurrentPage(pageParam);
    setSortBy(sortParam);
  }, [searchParams]);

  // Fetch products on change
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({
      filterParams: filters,
      sortParams: sortBy,
      page: currentPage,
    }));
    dispatch(setPage(currentPage));
  }, [dispatch, filters, sortBy, currentPage]);

  // Handle filter
  const handleFilter = (section, option) => {
    const selected = filters[section] || [];
    const updatedSection = selected.includes(option)
      ? selected.filter((i) => i !== option)
      : [...selected, option];

    const updatedFilters = {
      ...filters,
      [section]: updatedSection,
    };

    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));

    const query = {
      ...updatedFilters,
      sortBy,
      page: 1,
    };

    navigate({
      pathname: "/shop/listing",
      search: createSearchParams(query).toString(),
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    setFilters({ category: [], brand: [] });
    sessionStorage.removeItem("filters");
    navigate({
      pathname: "/shop/listing",
      search: "",
    });
  };

  // Pagination
  const handlePageChange = (pageNum) => {
    const query = {
      ...filters,
      sortBy,
      page: pageNum,
    };
    navigate({
      pathname: "/shop/listing",
      search: createSearchParams(query).toString(),
    });
  };

  // Add to cart
  const handleAddtoCart = (productId, totalStock) => {
    const existingItem = cartItems?.items?.find(item => item.productId === productId);
    const currentQty = existingItem?.quantity || 0;

    if (totalStock === 0) {
      toast.warning("This product is out of stock.");
      return;
    }

    if (currentQty + 1 > totalStock) {
      toast.warning(`Only ${totalStock} items available. You already have ${currentQty}.`);
      return;
    }

    dispatch(addToCart({ userId: user?._id, productId, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?._id }));
        toast.success(res.payload.message || 'Added to cart.');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} handleClearAll={handleClearAll} />

      <div className="bg-white w-full rounded-xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold">All Products</h2>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    const query = { ...filters, page: 1, sortBy: value };
                    navigate({
                      pathname: "/shop/listing",
                      search: createSearchParams(query).toString(),
                    });
                  }}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                      className="cursor-pointer text-sm"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 p-4">
          {isLoading ? (
            <p className="text-center col-span-full py-8">Loading...</p>
          ) : productList.length > 0 ? (
            productList.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <p className="text-center col-span-full py-8 text-muted-foreground">
              No products found. Try adjusting filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 py-6 border-t text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="w-full sm:w-auto px-4"
            >
              Previous
            </Button>
            <div className="text-center text-muted-foreground text-sm">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="w-full sm:w-auto px-4"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListing;
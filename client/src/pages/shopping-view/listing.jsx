import React, { useEffect } from 'react';
import ProductFilter from '../../components/shopping-view/filter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { sortOptions } from '../../config';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '../../store/shop/products-slice';
import ShoppingProductTile from '../../components/shopping-view/product-tile';

const ShoppingListing = () => {

  const {productList} = useSelector((state)=>state.shopProducts);
 const dispatch = useDispatch();

  const {filters,setFilters} = useState(null);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].id);


 function handleFilter(getSectionId, getCurrentOption) {
  console.log(getSectionId, getCurrentOption);
  const filteredProducts = productList.filter(
    (product) => product[getSectionId] === getCurrentOption
  );
  return filteredProducts;
}



  useEffect(()=>{
    dispatch(fetchAllFilteredProducts()).then((data)=>{
        if(data?.payload?.success){
            // console.log(data);

        }
    })
  },[dispatch])

  console.log(productList);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
      
      {/* Left Sidebar */}
      <ProductFilter filters={filters} handleFilter={handleFilter}/>

      {/* Product Listing Area */}
      <div className="bg-white dark:bg-background w-full rounded-xl shadow-md">
        
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            All Products
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{productList?.length} Products</span>
            
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
                  {sortOptions.map((Sortitem) => (
                    <DropdownMenuRadioItem
                      key={Sortitem.id}
                      value={Sortitem.id}
                      className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {Sortitem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Placeholder for product cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  product={productItem}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListing;

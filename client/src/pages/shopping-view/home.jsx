import React, { useEffect, useState } from 'react';
import bannerOne from '../../assets/banner-1.webp';
import bannerTwo from '../../assets/banner-2.webp';
import bannerThree from '../../assets/banner-3.webp';

import menIcon from '../../assets/icons/categories/men.jpg';
import womenIcon from '../../assets/icons/categories/women.jpg';
import kidsIcon from '../../assets/icons/categories/kids.jpg';
import accessoriesIcon from '../../assets/icons/categories/accessories.jpg';
import footwearIcon from '../../assets/icons/categories/footwear.jpg';

import nikeIcon from '../../assets/icons/brands/nike.jpg';
import adidasIcon from '../../assets/icons/brands/adidas.jpg';
import pumaIcon from '../../assets/icons/brands/puma.jpg';
import leviIcon from '../../assets/icons/brands/levi.jpg';
import zaraIcon from '../../assets/icons/brands/zara.jpg';
import hnmIcon from '../../assets/icons/brands/hm.jpg';

import {
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';

import { Card, CardContent } from '../../components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '../../store/shop/products-slice';
import ShoppingProductTile from '../../components/shopping-view/product-tile';
import { addToCart, fetchCartItems } from '../../store/shop/cart-slice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getFeatureImages } from '../../store/common-slice';

const ShoppingHome = () => {
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fallbackSlides = [bannerOne, bannerTwo, bannerThree];
  const dynamicSlides = Array.isArray(featureImageList) && featureImageList.length > 0
    ? featureImageList.flatMap((item) => item.images)
    : fallbackSlides;

  const [currentIndex, setCurrentIndex] = useState(0);

  const categoriesWithIcon = [
    { id: 'men', label: 'Men', icon: menIcon },
    { id: 'women', label: 'Women', icon: womenIcon },
    { id: 'kids', label: 'Kids', icon: kidsIcon },
    { id: 'accessories', label: 'Accessories', icon: accessoriesIcon },
    { id: 'footwear', label: 'Footwear', icon: footwearIcon },
  ];

  const brandsWithIcon = [
    { id: 'h&m', label: 'H&M', icon: hnmIcon },
    { id: 'zara', label: 'Zara', icon: zaraIcon },
    { id: 'nike', label: 'Nike', icon: nikeIcon },
    { id: 'levi', label: "Levi's", icon: leviIcon },
    { id: 'adidas', label: 'Adidas', icon: adidasIcon },
    { id: 'puma', label: 'Puma', icon: pumaIcon },
  ];

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dynamicSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dynamicSlides.length]);

  const handleAddtoCart = (productId) => {
    dispatch(addToCart({ userId: user?._id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?._id }));
        toast.success(data?.payload?.message);
      }
    });
  };

  const handleNavigateToListingPage = (filter, section) => {
    sessionStorage.removeItem('filters');
    const currentFilter = {
      [section]: [filter.id],
    };
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate('/shop/listing');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Banner / Carousel */}
      <div className="relative w-full aspect-[10/5] sm:aspect-[5/2] md:aspect-[2.6.1/1] overflow-hidden">
        {dynamicSlides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent z-20"></div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length)}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow z-30"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % dynamicSlides.length)}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow z-30"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {dynamicSlides.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Shop By Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, 'category')}
                className="cursor-pointer hover:shadow-xl transition-transform hover:-translate-y-1 bg-white border rounded-xl"
              >
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-24 h-24 object-cover mb-4 rounded-full border border-gray-200 shadow transition-transform hover:scale-105"
                  />
                  <span className="font-semibold text-lg text-gray-700">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Shop By Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {brandsWithIcon.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, 'brand')}
                className="cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1 bg-white border rounded-xl"
              >
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-24 h-24 object-cover mb-4 rounded-full border border-gray-200 shadow transition-transform hover:scale-105"
                  />
                  <span className="font-semibold text-lg text-gray-700">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Feature Products</h2>

          <div className="flex justify-center sm:justify-end mb-8">
            <button
              onClick={() => navigate('/shop/listing')}
              className="text-base sm:text-lg px-4 py-2 font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0 &&
              productList.slice(0, 4).map((productItem) => (
                <ShoppingProductTile
                  key={productItem.id}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShoppingHome;

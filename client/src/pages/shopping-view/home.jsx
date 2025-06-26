import React, { useEffect, useState } from 'react';
import bannerOne from '../../assets/banner-1.webp';
import bannerTwo from '../../assets/banner-2.webp';
import bannerThree from '../../assets/banner-3.webp';
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '../../store/shop/products-slice';
import ShoppingProductTile from '../../components/shopping-view/product-tile';

const ShoppingHome = () => {
  const slides = [bannerOne, bannerTwo, bannerThree];
  const [currentIndex, setCurrentIndex] = useState(0);
  const {productList} = useSelector((state)=>state.shopProducts);
  const dispatch = useDispatch();

  const categoriesWithIcon = [
    { id: 'men', label: 'Men', icon: ShirtIcon },
    { id: 'women', label: 'Women', icon: CloudLightning },
    { id: 'kids', label: 'Kids', icon: BabyIcon },
    { id: 'accessories', label: 'Accessories', icon: WatchIcon },
    { id: 'footwear', label: 'Footwear', icon: UmbrellaIcon },
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(()=>{
     dispatch(fetchAllFilteredProducts({filterParams:{},sortParams:'price-lowtohigh'}))
  },[dispatch])

    console.log(productList);
    
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Banner / Carousel */}
      <div className="relative w-full aspect-[10/5] sm:aspect-[5/2] md:aspect-[2.6.1/1] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-20"></div>

        {/* Carousel Controls */}
        <button
          onClick={()=> setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow z-30"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={()=>setCurrentIndex((prev) => (prev + 1) % slides.length)}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow z-30"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-1 bg-white border rounded-lg"
              >
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <item.icon className="w-12 h-12 mb-4" />
                  <span className="font-semibold">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-4'>
      
        </div>
      </section>
    </div>
  );
};

export default ShoppingHome;

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  fetchProductDetails,
  fetchRecommendations,
} from '../../store/shop/products-slice';
import ShoppingProductTile from '../../components/shopping-view/product-tile';
import { addToCart, fetchCartItems } from '../../store/shop/cart-slice';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams();
  const {user} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  const { productDetails, recommendations, isLoadingRecommendations } = useSelector(
    (state) => state.shopProducts
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const carouselRef = useRef(null);

  //add to cart
  function handleAddtoCart(){
      dispatch(addToCart({userId:user?._id,productId:id,quantity:1}))
      .then((data)=>{
        if(data?.payload?.success){
          dispatch(fetchCartItems({userId:user?._id}))
          toast.success(data?.payload?.message);
        }
      })
  }

  useEffect(() => {
    dispatch(fetchProductDetails({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails?.images?.length > 0) {
      setSelectedImage(productDetails.images[0]);
    }
  }, [productDetails]);

  useEffect(() => {
    if (productDetails) {
      dispatch(
        fetchRecommendations({
          category: productDetails.category,
          excludeId: productDetails._id,
        })
      );
    }
  }, [productDetails, dispatch]);

  const scrollToImage = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  if (!productDetails) {
    return <div className="text-center py-20 text-lg font-medium">Loading product...</div>;
  }

  const { title, description, price, salePrice, brand, category, images } = productDetails;
  const isOnSale = salePrice < price;

  return (
    <div className="bg-white min-h-screen px-4 md:px-10 py-10">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Left - Image Section */}
        <div className="w-full lg:w-1/2">
          {/* Mobile Carousel */}
          <div className="lg:hidden mb-6">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-4 pb-2 scroll-smooth snap-x snap-mandatory"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const width = e.target.offsetWidth;
                setCurrentMobileIndex(Math.round(scrollLeft / width));
              }}
            >
              {images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`slide-${idx}`}
                  className="w-full h-80 flex-shrink-0 object-contain border rounded-lg snap-center"
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
            {/* Dots */}
            <div className="flex justify-center mt-3 space-x-2">
              {images?.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition ${
                    idx === currentMobileIndex ? 'bg-black' : 'bg-gray-300'
                  }`}
                  onClick={() => scrollToImage(idx)}
                ></button>
              ))}
            </div>
          </div>

          {/* Desktop Image Display */}
          <div className="hidden lg:flex gap-6">
            {/* Thumbnails */}
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto sticky top-20">
              {images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`w-20 h-25 object-cover border rounded cursor-pointer hover:ring-2 hover:ring-black transition ${
                    selectedImage === idx ? 'ring-2 ring-black' : ''
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 border rounded-lg overflow-hidden shadow sticky top-20">
              <img
                src={selectedImage}
                alt="Main"
                className="w-full h-[650px] object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">
            <span className="font-semibold">Brand:</span> {brand} &nbsp;|&nbsp;
            <span className="font-semibold">Category:</span> {category}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-green-600">${salePrice}</span>
            {isOnSale && (
              <span className="line-through text-gray-400 text-lg">${price}</span>
            )}
          </div>
          {isOnSale && (
            <p className="text-green-600 text-sm">You save ${price - salePrice}</p>
          )}

          <p className="text-gray-700 text-base leading-relaxed border-t pt-4">{description}</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button onClick={handleAddtoCart} className="w-full cursor-pointer sm:w-auto px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition">
              Add to Cart
            </button>
            {/* <button className="w-full sm:w-auto px-6 py-3 border border-black rounded hover:bg-gray-100 transition">
              Buy Now
            </button> */}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="max-w-screen-xl mx-auto mt-20 ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">You may also like</h2>
        {isLoadingRecommendations ? (
          <p className="text-gray-500">Loading recommendations...</p>
        ) : recommendations?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 8).map((item) => (
              <Link to={`/shop/product-details/${item._id}`}><ShoppingProductTile key={item._id} product={item} cartBtn={false}/></Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No similar products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import StartRatingComponent from '../common/star-rating';
import {
  addReview,
  getReviews,
  checkPurchaseStatus,
} from '../../store/review-slice';
import { toast } from 'sonner';

const REVIEWS_PER_PAGE = 4;

const ReviewsSection = ({ productId }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { reviews, hasPurchased } = useSelector((state) => state.shopReview);
  const { user } = useSelector((state) => state.auth);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(getReviews(productId));
      if (user?._id) {
        dispatch(checkPurchaseStatus({ userId: user._id, productId }));
      }
      setCurrentPage(1);
      setHasReviewed(false);
    }
  }, [dispatch, productId, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const alreadyReviewed = reviews.some((r) => r.userId === user._id);
      setHasReviewed(alreadyReviewed);
    }
  }, [reviews, user]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => prev + direction);
  };

  const handleAddReview = async () => {
    if (!title.trim() || !comment.trim() || rating === 0) return;

    const payload = {
      productId,
      userId: user._id,
      userName: user.userName,
      title,
      comment,
      rating,
    };

    try {
      await dispatch(addReview(payload)).unwrap();
      toast.success('Review submitted!');
      setTitle('');
      setComment('');
      setRating(0);
      dispatch(getReviews(productId));
      setCurrentPage(1);
    } catch (err) {
      toast.error(err || 'Something went wrong.');
    }
  };

  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const visibleReviews = reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">Customer Reviews</h2>
        <div className="mt-2 text-gray-600 text-sm">
          {reviews.length > 0 ? (
            <>
              <span className="font-medium text-yellow-500">
                {averageRating.toFixed(1)} ★
              </span>{' '}
              based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </>
          ) : (
            <span>No reviews yet. Be the first to write one!</span>
          )}
        </div>
      </div>

      {/* Review Cards */}
      <div
        ref={scrollRef}
        className="max-h-[480px] overflow-y-auto border rounded-xl bg-gray-50 p-6 mb-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {visibleReviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border p-4 hover:shadow transition"
            >
              <StartRatingComponent review={review} />
              <h3 className="text-lg font-semibold mt-2">{review.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
              <div className="text-xs text-gray-500 mt-2">
                <span className="font-medium">{review.userName}</span>{' '}
                <span className="mx-1">•</span>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {reviews.length > REVIEWS_PER_PAGE && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
          </span>
          <Button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
            variant="outline"
            size="sm"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Review Form */}
      <div className="bg-white rounded-xl p-6 mt-10">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

        {!user ? (
          <p className="text-gray-500">You must be logged in to leave a review.</p>
        ) : !hasPurchased ? (
          <p className="text-gray-500">You must purchase the product to leave a review.</p>
        ) : hasReviewed ? (
          <p className="text-gray-600">You have already reviewed this product.</p>
        ) : (
          <>
            <div className="mb-4">
              <Label className="block mb-1 text-sm">Your Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon
                    key={i}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      (hoverRating || rating) >= i
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill={(hoverRating || rating) >= i ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="title" className="block text-sm mb-1">
                Review Title
              </Label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-4 py-2 rounded-md"
                placeholder="Give your review a title..."
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="comment" className="block text-sm mb-1">
                Your Review
              </Label>
              <textarea
                id="comment"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border px-4 py-2 rounded-md resize-none"
                placeholder="Share your experience..."
              />
            </div>

            <Button
              onClick={handleAddReview}
              disabled={!title || !comment || rating === 0}
              className="bg-black text-white"
            >
              Submit Review
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;

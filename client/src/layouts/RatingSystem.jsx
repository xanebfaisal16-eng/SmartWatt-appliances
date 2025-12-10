import React, { useState, useEffect } from 'react';

// 1. Star Display Component (Shows ratings)
const StarRatingDisplay = ({ rating, size = 'md', showNumber = true, reviews = 0 }) => {
  const starSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  }[size];

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className={`fas fa-star text-yellow-400 ${starSize}`}></i>
        ))}
        
        {/* Half Star */}
        {hasHalfStar && (
          <i className={`fas fa-star-half-alt text-yellow-400 ${starSize}`}></i>
        )}
        
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className={`far fa-star text-yellow-400 ${starSize}`}></i>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        {renderStars()}
        {showNumber && (
          <span className="ml-2 text-sm font-medium text-gray-700">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
      {reviews > 0 && (
        <span className="text-sm text-gray-500">
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
};

// 2. Interactive Rating Component (For submitting ratings)
const StarRatingInput = ({ initialRating = 0, onChange, size = 'lg', disabled = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const starSize = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }[size];

  const handleClick = (value) => {
    if (!disabled) {
      setRating(value);
      if (onChange) onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!disabled) setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (!disabled) setHoverRating(0);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = hoverRating || rating;
        const isFull = star <= displayRating;
        const isHalf = star - 0.5 === displayRating;

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`${starSize} ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} ${
              isFull ? 'text-yellow-400' : 'text-gray-300'
            }`}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            {isHalf ? (
              <i className="fas fa-star-half-alt"></i>
            ) : (
              <i className={isFull ? "fas fa-star" : "far fa-star"}></i>
            )}
          </button>
        );
      })}
      {!disabled && (
        <span className="ml-3 text-gray-600 font-medium">
          {rating > 0 ? `${rating.toFixed(1)}/5` : 'Rate this product'}
        </span>
      )}
    </div>
  );
};

// 3. Rating Breakdown Component (Shows rating distribution)
const RatingBreakdown = ({ ratings, totalReviews }) => {
  const total = ratings.reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-800 mb-3">Customer Reviews</h4>
      
      {/* Overall Rating */}
      <div className="flex items-center mb-4">
        <div className="text-3xl font-bold text-gray-900 mr-4">
          {(totalReviews > 0 ? ratings.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalReviews : 0).toFixed(1)}
        </div>
        <div className="mr-4">
          <StarRatingDisplay 
            rating={totalReviews > 0 ? ratings.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalReviews : 0} 
            size="md"
            showNumber={false}
          />
        </div>
        <div className="text-gray-600">
          {totalReviews.toLocaleString()} review{totalReviews !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Rating Bars */}
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = ratings[stars - 1] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={stars} className="flex items-center">
            <span className="w-10 text-sm text-gray-600">{stars} star</span>
            <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="w-12 text-sm text-gray-600 text-right">
              {count.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 4. Review Card Component
const ReviewCard = ({ review }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="font-semibold text-gray-600">
              {review.userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h5 className="font-medium text-gray-900">{review.userName}</h5>
            <StarRatingDisplay 
              rating={review.rating} 
              size="sm" 
              showNumber={false}
            />
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
      
      <h6 className="font-semibold text-gray-800 mb-2">{review.title}</h6>
      <p className="text-gray-600 mb-3">{review.comment}</p>
      
      {review.verifiedPurchase && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <i className="fas fa-check-circle mr-1"></i>
          Verified Purchase
        </span>
      )}
      
      {review.helpful && review.helpful > 0 && (
        <div className="mt-3 text-sm text-gray-500">
          {review.helpful} people found this helpful
        </div>
      )}
    </div>
  );
};

// 5. Main Rating Component (Combines everything)
const ProductRating = ({ productId, productName }) => {
  // Sample data - Replace with API call
  const [productRatings, setProductRatings] = useState({
    averageRating: 4.7,
    totalReviews: 1243,
    ratings: [850, 200, 100, 50, 43], // [5-star, 4-star, 3-star, 2-star, 1-star]
    reviews: [
      {
        id: 1,
        userName: "John D.",
        rating: 5,
        title: "Excellent energy savings!",
        comment: "Reduced my electricity bill by 30% in the first month. Very happy with this purchase.",
        date: "2024-01-15",
        verifiedPurchase: true,
        helpful: 42
      },
      {
        id: 2,
        userName: "Sarah M.",
        rating: 4,
        title: "Good product, great features",
        comment: "Works as advertised. The AI optimization is impressive.",
        date: "2024-01-10",
        verifiedPurchase: true,
        helpful: 18
      }
    ]
  });

  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState({
    title: '',
    comment: ''
  });

  const handleSubmitReview = () => {
    if (userRating > 0) {
      const newReview = {
        id: Date.now(),
        userName: "You",
        rating: userRating,
        title: userReview.title || "My Review",
        comment: userReview.comment,
        date: new Date().toISOString().split('T')[0],
        verifiedPurchase: true,
        helpful: 0
      };

      setProductRatings(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
        totalReviews: prev.totalReviews + 1,
        ratings: prev.ratings.map((count, index) => 
          index === userRating - 1 ? count + 1 : count
        )
      }));

      // Reset form
      setUserRating(0);
      setUserReview({ title: '', comment: '' });
      
      alert('Thank you for your review!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Ratings & Reviews</h3>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Rating Overview */}
        <div>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {productRatings.averageRating.toFixed(1)}
            </div>
            <StarRatingDisplay 
              rating={productRatings.averageRating} 
              size="lg"
              showNumber={false}
            />
            <div className="text-gray-600 mt-2">
              {productRatings.totalReviews.toLocaleString()} ratings
            </div>
          </div>
          
          <RatingBreakdown 
            ratings={productRatings.ratings}
            totalReviews={productRatings.totalReviews}
          />
        </div>

        {/* Middle Column - Write Review */}
        <div className="md:col-span-2">
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">Write a Review</h4>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Rating</label>
              <StarRatingInput 
                initialRating={userRating}
                onChange={setUserRating}
                size="lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Review Title</label>
              <input
                type="text"
                value={userReview.title}
                onChange={(e) => setUserReview({...userReview, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summarize your experience"
                maxLength="100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Review</label>
              <textarea
                value={userReview.comment}
                onChange={(e) => setUserReview({...userReview, comment: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Share details of your experience with this product"
                maxLength="1000"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {userReview.comment.length}/1000 characters
              </div>
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={userRating === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                userRating === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Submit Review
            </button>
          </div>

          {/* Reviews List */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">
              Most Helpful Reviews
            </h4>
            
            <div className="space-y-1">
              {productRatings.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {productRatings.totalReviews > 5 && (
              <button className="mt-6 w-full py-3 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50">
                View All {productRatings.totalReviews} Reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. Small Rating Badge for Product Cards
const RatingBadge = ({ rating, reviews, size = 'sm' }) => {
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];

  return (
    <div className="flex items-center">
      <div className="flex items-center mr-2">
        <i className="fas fa-star text-yellow-400 text-sm"></i>
        <span className={`ml-1 font-medium ${textSize}`}>
          {rating.toFixed(1)}
        </span>
      </div>
      <span className={`text-gray-500 ${textSize}`}>
        ({reviews.toLocaleString()})
      </span>
    </div>
  );
};

export {
  StarRatingDisplay,
  StarRatingInput,
  RatingBreakdown,
  ReviewCard,
  ProductRating,
  RatingBadge
};
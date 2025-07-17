import React from "react";
import { StarIcon } from "lucide-react";

const StartRatingComponent = ({ review = 0 }) => {
  return (
    <div className="flex items-center gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          className={`w-5 h-5 drop-shadow-sm transition ${
            i <= review.rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={i <= review.rating ? "#facc15" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

export default StartRatingComponent;

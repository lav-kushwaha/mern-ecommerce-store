import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

const StartRatingComponent = ({ review = 0 }) => {
  return (
    <div className="flex items-center mb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          className={`w-5 h-5 ${
            i <= review.rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={i <= review.rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

export default StartRatingComponent;

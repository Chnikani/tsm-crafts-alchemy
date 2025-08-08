import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  currentUserReview?: Review | null;
  onAddReview?: (rating: number, text: string) => Promise<void>;
  onUpdateReview?: (reviewId: string, rating: number, text: string) => Promise<void>;
  isLoggedIn: boolean;
}

export const ProductReviews = ({
  productId,
  reviews,
  currentUserReview,
  onAddReview,
  onUpdateReview,
  isLoggedIn
}: ProductReviewsProps) => {
  const [newRating, setNewRating] = useState(currentUserReview?.rating || 5);
  const [newReviewText, setNewReviewText] = useState(currentUserReview?.review_text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { toast } = useToast();

  const handleRatingChange = (rating: number) => {
    setNewRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (newReviewText.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write a review with at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentUserReview && onUpdateReview) {
        await onUpdateReview(currentUserReview.id, newRating, newReviewText);
        toast({ title: "Review Updated" });
      } else if (onAddReview) {
        await onAddReview(newRating, newReviewText);
        toast({ title: "Review Submitted" });
      }
      
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reviews.length === 0 && !isLoggedIn && !showReviewForm) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review this product!</p>
          <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
        {isLoggedIn && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)}>
            {currentUserReview ? "Edit Your Review" : "Write a Review"}
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">
              {currentUserReview ? "Edit Your Review" : "Write a Review"}
            </h3>
            
            {/* Star Rating */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${rating <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Review Text */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Review</p>
              <Textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : currentUserReview ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-foreground">{review.profiles.full_name}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.review_text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};
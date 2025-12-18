import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";




import { getProduct } from "../api/productApi";
import { getReviewsByProduct, voteReview } from "../api/reviewApi";

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated,userId } = useContext(AuthContext);

  const normalizeReviews = (data) => {
    // Handles: array | {data: []} | {content: []}
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };




useEffect(() => {
  console.log("Effect started for product:", productId);

  Promise.all([
    getProduct(productId),
    getReviewsByProduct(productId)
  ])
    .then(([productRes, reviewsRes]) => {
      console.log("Product:", productRes.data);
      console.log("Reviews:", reviewsRes.data);
      setProduct(productRes.data);
      setReviews(normalizeReviews(reviewsRes.data));
    })
    .catch(err => {
      console.error("API ERROR:", err);
       console.error("Error details:", err.response?.data);
    })
    .finally(() => {
      console.log("Stopping loading");
      setLoading(false);
    });
}, [productId]);







  const loadReviews = () => {
    getReviewsByProduct(productId).then(res => {
      setReviews(normalizeReviews(res.data));
    });
  };

  const handleVote = async (reviewId, type) => {
    try {
      await voteReview(reviewId, type);
      loadReviews(); // refresh counts
    } catch (err) {
      alert(err.response?.data || "Unable to vote");
    }
  };

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="mt-2">{product.description}</p>

      <h2 className="text-xl mt-6 mb-3">Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} className="border p-3 mb-3 rounded">
            <p><strong>Rating:</strong> {r.rating}/5</p>
            <p><strong>Pros:</strong> {r.pros}</p>
            <p><strong>Cons:</strong> {r.cons}</p>
            <p><strong>Used For:</strong> {r.usedFor}</p>

            <div className="flex gap-4 mt-3">
              {isAuthenticated ? (
                userId !== r.authorId ? (
                  <>
                    <button onClick={() => handleVote(r.id, "HELPFUL")}>
                      👍 Helpful ({r.helpfulCount})
                    </button>

                    <button onClick={() => handleVote(r.id, "NOT_HELPFUL")}>
                      👎 Not Helpful ({r.notHelpfulCount})
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    You cannot vote on your own review
                  </p>
                )
              ) : (
                <Link to="/login" className="text-blue-600 underline">
                  Login to vote
                </Link>
              )}

            </div>

          </div>
        ))
      )}
    </div>
  );
}

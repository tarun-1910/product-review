import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";



import { getProduct } from "../api/productApi";
import { getReviewsByProduct, voteReview, deleteReview } from "../api/reviewApi";

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, userId } = useContext(AuthContext);

  const normalizeReviews = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([
      getProduct(productId),
      getReviewsByProduct(productId),
    ])
      .then(([productRes, reviewsRes]) => {
        setProduct(productRes.data);
        setReviews(normalizeReviews(reviewsRes.data));
      })
      .catch(() => {
        alert("Failed to load product details");
      })
      .finally(() => {
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
      loadReviews();
    } catch (err) {
      alert(err.response?.data || "Unable to vote");
    }
  };


const handleDelete = async (reviewId) => {
  try {
    await deleteReview(reviewId);
    loadReviews(); // 🔁 refresh reviews after delete
  } catch (err) {
    alert(err.response?.data || "Unable to delete review");
  }
};


  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!product) {
    return <p className="p-6 text-red-600">Product not found</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* PRODUCT IMAGE */}
      <div className="w-full h-64 bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="h-full w-full object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

       <Link to={`/products/${productId}/review`}
               className="bg-green-600 text-white px-4 py-2 rounded">
          Add a Review
        </Link>

      {/* PRODUCT INFO */}
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="mt-2 text-gray-700">{product.description}</p>

      {/* REVIEWS */}
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
              {!isAuthenticated && (
                <Link to="/login" className="text-blue-600 underline">
                  Login to vote
                </Link>
              )}

              {isAuthenticated && (
                <>
                  {/* Vote buttons (only if NOT author) */}
                  {Number(userId) !== Number(r.authorId) && (
                    <>
                      <button
                        onClick={() => handleVote(r.id, "HELPFUL")}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Helpful ({r.helpfulCount})
                      </button>

                      <button
                        onClick={() => handleVote(r.id, "NOT_HELPFUL")}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Not Helpful ({r.notHelpfulCount})
                      </button>
                    </>
                  )}

                  {/* Delete button (only if AUTHOR) */}
                  {Number(userId) === Number(r.authorId) && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Delete
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

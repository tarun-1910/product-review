import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { getProduct } from "../api/productApi";
import {
  getReviewsByProduct,
  voteReview,
  deleteReview,
  searchReviewsInProduct
} from "../api/reviewApi";

export default function ProductDetails() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewQuery, setReviewQuery] = useState("");
  const [searching, setSearching] = useState(false);

  // 🔑 IMPORTANT STATES
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);



const { isAuthenticated, user } = useContext(AuthContext);

const loggedInUserId = user?.userId ?? null;


  const normalizeReviews = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  /* 🔹 Load product + reviews */
  useEffect(() => {
    if (isAuthenticated && loggedInUserId === null) return;

    setLoading(true);
    setReviewsLoaded(false); // 🔴 RESET HERE

    Promise.all([
      getProduct(productId),
      getReviewsByProduct(productId),
    ])
      .then(([productRes, reviewsRes]) => {
        setProduct(productRes.data);

        const normalized = normalizeReviews(reviewsRes.data);
        setReviews(normalized);

        setReviewsLoaded(true); // ✅ SET ONLY AFTER REVIEWS ARRIVE
      })
      .catch(() => alert("Failed to load product details"))
      .finally(() => setLoading(false));

  }, [productId, isAuthenticated, loggedInUserId]);

  /* 🔹 Re-check ownership ONLY when reviews are loaded */
  useEffect(() => {
    if (!reviewsLoaded || !isAuthenticated || loggedInUserId == null) {
      setHasReviewed(false);
      return;
    }

    const reviewed = reviews.some(
      r => Number(r.authorId) === Number(loggedInUserId)
    );

    setHasReviewed(reviewed);

  }, [reviewsLoaded, reviews, isAuthenticated, loggedInUserId]);

  const loadReviews = () => {
    setReviewsLoaded(false);

    getReviewsByProduct(productId).then(res => {
      setReviews(normalizeReviews(res.data));
      setReviewsLoaded(true);
    });
  };

  /* 🔹 Voting */
  const handleVote = async (reviewId, type) => {
    try {
      await voteReview(reviewId, type);
      loadReviews();
    } catch (err) {
      alert(err.response?.data || "Unable to vote");
    }
  };

  /* 🔹 Delete review */
  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      loadReviews();
    } catch (err) {
      alert(err.response?.data || "Unable to delete review");
    }
  };

  /* 🔍 Review Search */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (reviewQuery.trim() === "") {
        loadReviews();
        return;
      }

      if (reviewQuery.trim().length < 2) return;

      try {
        setSearching(true);
        const res = await searchReviewsInProduct(productId, reviewQuery);
        setReviews(normalizeReviews(res.data));
        setReviewsLoaded(true);
      } catch {
        alert("Search failed");
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [reviewQuery, productId]);

  /* 🔹 Safe returns */
  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6 text-red-600">Product not found</p>;





// console.log("🔎 DEBUG STATE", {
//   isAuthenticated,
//   loggedInUserId,
//   loggedInUserIdType: typeof loggedInUserId,
//   reviewsLoaded,
//   hasReviewed,
//   reviewCount: reviews.length,
//   authorIds: reviews.map(r => ({
//     authorId: r.authorId,
//     type: typeof r.authorId
//   }))
// });
//
//
//
// console.log("FINAL STATE", {
//   loggedInUserId,
//   authorIds: reviews.map(r => r.authorId),
//   hasReviewed
// });





  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* PRODUCT IMAGE */}
      <div className="w-full h-64 bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      {/* PRODUCT INFO */}
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="mt-2 text-gray-700">{product.description}</p>

      {/* ADD REVIEW + SEARCH */}
      <div className="mt-4 space-y-2">

        {/* 🔴 KEY FIX: block UI until reviewsLoaded */}
        {isAuthenticated && reviewsLoaded && !hasReviewed && (
          <Link
            to={`/products/${productId}/review`}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded"
          >
            Add a Review
          </Link>
        )}

        {isAuthenticated && reviewsLoaded && hasReviewed && (
          <p className="text-sm text-gray-500">
            You have already reviewed this product
          </p>
        )}

        <input
          type="text"
          placeholder="Search reviews (pros, cons, usage...)"
          value={reviewQuery}
          onChange={(e) => setReviewQuery(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {searching && (
          <p className="text-sm text-gray-500">Searching reviews...</p>
        )}
      </div>

      {/* REVIEWS */}
      <h2 className="text-xl mt-6 mb-3">Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div
            key={r.id}
            className="relative border p-4 mb-4 rounded bg-white shadow-sm"
          >

            {/* DELETE BUTTON */}
            {isAuthenticated &&
              Number(loggedInUserId) === Number(r.authorId) && (
                <button
                  onClick={() => handleDelete(r.id)}
                  className="absolute top-2 right-2 text-red-600 border border-red-300 px-2 py-1 rounded text-xs hover:bg-red-50"
                >
                  Delete
                </button>
            )}

            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {r.imageUrl ? (
                  <img
                    src={`http://localhost:8080${r.imageUrl}`}
                    alt="Review"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-sm"><strong>Rating:</strong> {r.rating}/5</p>
                <p className="text-sm"><strong>Pros:</strong> {r.pros}</p>
                <p className="text-sm"><strong>Cons:</strong> {r.cons}</p>
                <p className="text-sm"><strong>Used For:</strong> {r.usedFor}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Reviewed by <span className="font-medium">{r.authorName}</span>
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4 flex-wrap items-center">
              {!isAuthenticated && (
                <Link to="/login" className="text-blue-600 underline text-sm">
                  Login to vote
                </Link>
              )}

              {isAuthenticated &&
                Number(loggedInUserId) !== Number(r.authorId) && (
                  <>
                    <button
                      onClick={() => handleVote(r.id, "HELPFUL")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Helpful ({r.helpfulCount})
                    </button>

                    <button
                      onClick={() => handleVote(r.id, "NOT_HELPFUL")}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Not Helpful ({r.notHelpfulCount})
                    </button>
                  </>
              )}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

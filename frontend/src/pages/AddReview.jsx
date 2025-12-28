import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addReview } from "../api/reviewApi";
import { addReviewWithImage } from "../api/reviewApi";

export default function AddReview() {
  console.log("🔄 AddReview component mounted");

  const { productId } = useParams();
  const navigate = useNavigate();

  console.log("📦 productId from URL:", productId);

  const [form, setForm] = useState({
    pros: "",
    cons: "",
    usedFor: "",
    rating: ""
  });

  const [image, setImage] = useState(null);

  // 🔍 Track form state changes
  useEffect(() => {
    console.log("📝 Form state updated:", form);
  }, [form]);

  // 🖼️ Track image state changes
  useEffect(() => {
    console.log("🖼️ Image state updated:", image);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Submit clicked");
    console.log("📦 productId:", productId);
    console.log("📝 form payload:", form);
    console.log("🖼️ image payload:", image);

    try {
      await addReviewWithImage(productId, form, image);
      console.log("✅ Review API success");

      alert("Review submitted!");
      navigate(`/products/${productId}`);
    } catch (err) {
      console.error("❌ Review API failed:", err);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Add Review</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          placeholder="Pros"
          className="border p-2 w-full"
          onChange={e => {
            console.log("✍️ Pros changed:", e.target.value);
            setForm({ ...form, pros: e.target.value });
          }}
        />

        <input
          placeholder="Cons"
          className="border p-2 w-full"
          onChange={e => {
            console.log("✍️ Cons changed:", e.target.value);
            setForm({ ...form, cons: e.target.value });
          }}
        />

        <input
          placeholder="Used For"
          className="border p-2 w-full"
          onChange={e => {
            console.log("✍️ UsedFor changed:", e.target.value);
            setForm({ ...form, usedFor: e.target.value });
          }}
        />

        <input
          type = "number"
          min = "1"
          max = "5"
          placeholder="Rating (1-5)"
          className="border p-2 w-full"
          onChange={e => {
            console.log("⭐ Rating changed:", e.target.value);
            setForm({ ...form, rating: e.target.value });
          }}
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full"
          onChange={e => {
            console.log("🖼️ Image selected:", e.target.files[0]);
            setImage(e.target.files[0]);
          }}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Submit Review
        </button>
      </form>
    </div>
  );
}










































//
// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { addReview } from "../api/reviewApi";
// import { addReviewWithImage } from "../api/reviewApi";
//
//
//
//
//
// export default function AddReview() {
//
//    const { productId } = useParams();
//    const  navigate = useNavigate();
//    const [form, setForm] = useState({
//      pros: "",
//      cons: "",
//      usedFor: "",
//      rating: ""
//    });
//
//
// const [image, setImage] = useState(null);
//
//
//
//  const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     //console.log("productId:", productId); // debug
//
//     await addReview(productId, form, image);
//
//     alert("Review submitted!");
//     navigate(`/products/${productId}`);
//   };
//
//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-xl mb-4">Add Review</h1>
//
//       <form onSubmit={handleSubmit} className="space-y-3">
//
//
//         <input placeholder="Pros" className="border p-2 w-full"
//           onChange={e => setForm({...form, pros: e.target.value})} />
//
//         <input placeholder="Cons" className="border p-2 w-full"
//           onChange={e => setForm({...form, cons: e.target.value})} />
//
//         <input placeholder="Used For" className="border p-2 w-full"
//           onChange={e => setForm({...form, usedFor: e.target.value})} />
//
//         <input placeholder="Rating (1-5)" className="border p-2 w-full"
//           onChange={e => setForm({...form, rating: e.target.value})} />
//
//         <input
//                   type="file"
//                   accept="image/*"
//                   className="border p-2 w-full"
//                   onChange={e => setImage(e.target.files[0])}
//         />
//
//
//
//         <button className="bg-green-600 text-white px-4 py-2 rounded">
//           Submit Review
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addReview } from "../api/reviewApi";




export default function AddReview() {

   const { productId } = useParams();
   const  navigate = useNavigate();
  const [form, setForm] = useState({
    pros: "",
    cons: "",
    usedFor: "",
    rating: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();



  //console.log("productId:", productId); // debug

  await addReview(productId, form);
    alert("Review submitted!");
    navigate(`/products/${productId}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Add Review</h1>

      <form onSubmit={handleSubmit} className="space-y-3">


        <input placeholder="Pros" className="border p-2 w-full"
          onChange={e => setForm({...form, pros: e.target.value})} />

        <input placeholder="Cons" className="border p-2 w-full"
          onChange={e => setForm({...form, cons: e.target.value})} />

        <input placeholder="Used For" className="border p-2 w-full"
          onChange={e => setForm({...form, usedFor: e.target.value})} />

        <input placeholder="Rating (1-5)" className="border p-2 w-full"
          onChange={e => setForm({...form, rating: e.target.value})} />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Submit Review
        </button>
      </form>
    </div>
  );
}


import { useState } from "react";


import { addReview } from "../api/reviewApi";



export default function AddReview() {
  const [form, setForm] = useState({
    productId: "",
    pros: "",
    cons: "",
    usedFor: "",
    rating: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReview(form);
    alert("Review submitted!");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Add Review</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Product ID" className="border p-2 w-full"
          onChange={e => setForm({...form, productId: e.target.value})} />

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

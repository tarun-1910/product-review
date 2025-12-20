import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct, uploadProductImage } from "../api/productApi";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addProduct({ name, description });
      const productId = res.data.id;

      if (image) {
        await uploadProductImage(productId, image);
      }

      navigate("/products");
    } catch (err) {
      setError("Failed to add product");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Product description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        {/* IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setImage(file);
            setImagePreview(URL.createObjectURL(file));
          }}
        />

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="h-40 w-full object-contain border rounded"
            />
          </div>
        )}

        <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">
          Add Product
        </button>
      </form>
    </div>
  );
}

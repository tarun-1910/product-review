import { useState } from "react";
import { registerUser } from "../api/authApi";
import {useNavigate} from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    alert("Registered Successfully!");
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Full Name"
          onChange={(e) => setForm({...form, fullName: e.target.value})} />

        <input className="border p-2 w-full" placeholder="Email"
          onChange={(e) => setForm({...form, email: e.target.value})} />

        <input type="password" className="border p-2 w-full" placeholder="Password"
          onChange={(e) => setForm({...form, password: e.target.value})} />



        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}

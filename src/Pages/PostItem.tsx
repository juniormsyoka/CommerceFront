import React, { useState, useEffect } from "react";
import { Button } from "../Components/UI/Button";
import { productsApi } from "../Services/api";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { ProductCreateDto } from "../types/types";
import { LoadingSpinner } from "../Components/UI/LoadingSpinner";
import "./PostItem.css";
import toast from "react-hot-toast";

const PostItem: React.FC = () => {
  const [form, setForm] = useState<ProductCreateDto>({
    name: "",
    description: "",
    price: 0,
    condition: "Used",
    category: "Laptop",
    imageUrl: "",
  });

  const sellerId = useUserStore.getState().user?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Convert price to number
    if (name === "price") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const { user } = useUserStore();
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    if (!user?.id) throw new Error("User not logged in");

    await productsApi.create({ ...form, sellerId: user.id });
    alert("✅ Item posted successfully!");
    navigate("/profile");
  } catch (error: any) {
    alert(`❌ Failed to post item: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

useEffect(() => {
    if (!user?.id) {
      toast.error("You must be signed in to post an item.");
      navigate("/signin");
    }
  }, [user, navigate]);

  return (
    <div className="post-item-container">
      <h2 className="post-item-header">Post an Item</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="name">Title</label>
          <input
            id="name"
            name="name"
            className="form-input"
            placeholder="Enter item title"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="Describe your item in detail"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (Ksh.)</label>
          <input
            id="price"
            name="price"
            type="number"
            className="form-input"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            className="form-select"
            value={form.condition}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={form.category}
            onChange={handleChange}
          >
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="Accessory">Accessory</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            id="imageUrl"
            name="imageUrl"
            className="form-input"
            placeholder="Paste image URL here"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={`submit-btn ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "" : "Post Item"}
        </button>
      </form>
    </div>
  );
};

export default PostItem;

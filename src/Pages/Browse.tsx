// Pages/Browse.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Product } from "../types/types";
import { productsApi } from "../Services/api";
import ProductCard from "../Components/Products/ProductCard";
import { useCartStore } from "../store/cartStore";
import { LoadingSpinner } from "../Components/UI/LoadingSpinner";
import "./Browse.css";

const ITEMS_PER_PAGE = 12;

const Browse: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  
  //const categories = ['Laptop', 'Phone', 'Accessory', 'Other'];

  const categories = Array.from(new Set(products.map(p => p.category)));

  const { cart, addToCart } = useCartStore();

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productsApi.getAll();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const getFilteredSortedProducts = useCallback(() => {
    let filtered = [...products];

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
          filtered = filtered.filter((p) => p.category === categoryFilter);
        }


    switch (sortOption) {
      case "priceLowHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [products, searchQuery, categoryFilter, sortOption]);

  // Reset displayed products whenever filters/search/sort changes
  useEffect(() => {
    const filtered = getFilteredSortedProducts();
    setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [getFilteredSortedProducts]);

  // Infinite scroll: load more products when user reaches bottom
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  const loadMoreProducts = () => {
    setLoadingMore(true);
    const filtered = getFilteredSortedProducts();
    const currentLength = displayedProducts.length;
    const nextProducts = filtered.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    setDisplayedProducts((prev) => [...prev, ...nextProducts]);
    setHasMore(currentLength + nextProducts.length < filtered.length);
    setLoadingMore(false);
  };

  return (
    <div className="browse-page container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Browse Products</h1>

      {/* Filters */}
      <div className="filters mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="priceLowHigh">Price: Low → High</option>
          <option value="priceHighLow">Price: High → Low</option>
        </select>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <LoadingSpinner />
        </div>
      ) : displayedProducts.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product, index) => {
            if (index === displayedProducts.length - 1) {
              return (
                <div ref={lastProductRef} key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}   // ✅ no userId needed here
                    isInCart={cart.some((item) => item.product.id === product.id)}
                  />

                </div>
              );
            }
            return (
              

            <ProductCard
              product={product}
              onAddToCart={() => addToCart(product)}
              isInCart={cart.some((item) => item.product.id === product.id)}
            />

            );
          })}
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Browse;

import React from "react";
import { useParams } from "react-router-dom";
import { listingsApi } from "../Services/api";
import { useEffect, useState } from "react";
import { Listing } from "../types/types";

const ListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await listingsApi.getById(Number(id));
        setListing(data);
      } catch (error) {
        console.error("❌ Failed to fetch listing", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found</p>;

  return (
    <div className="page-container">
      <div className="listing-detail">
        <img src={listing.imageUrl} alt={listing.title} />
        <div className="listing-info">
          <h2>{listing.title}</h2>
          <p>{listing.description}</p>
          <p className="price">${listing.price}</p>
          <p>Condition: {listing.condition}</p>
          <p>Category: {listing.category}</p>

          <div className="seller-info">
            <h4>Seller: {listing.seller.username}</h4>
            <p>Email: {listing.seller.email}</p>
          </div>

          <button className="primary-btn">Contact Seller</button>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;

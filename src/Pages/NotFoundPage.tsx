import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-art">
          <div className="not-found-404">404</div>
          <div className="not-found-illustration">
            <div className="planet"></div>
            <div className="rocket">🚀</div>
            <div className="stars">
              <div className="star"></div>
              <div className="star"></div>
              <div className="star"></div>
              <div className="star"></div>
              <div className="star"></div>
            </div>
          </div>
        </div>
        
        <h1>Page Not Found</h1>
        <p className="not-found-message">
          Oops! The page <code>{location.pathname}</code> doesn't seem to exist.
        </p>
        <p className="not-found-submessage">
          You might have entered the wrong address, or the page has moved.
        </p>
        
        <div className="not-found-actions">
          <button 
            className="not-found-btn primary"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
          <button 
            className="not-found-btn secondary"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
        
        <div className="not-found-search">
          <p>Or try searching:</p>
          <form 
                className="search-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const query = (form.elements.namedItem('query') as HTMLInputElement).value;
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                }}
                >
            <input
              type="text"
              name="query"
              placeholder="Search..."
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
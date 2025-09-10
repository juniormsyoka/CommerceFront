import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast"; 
import "./App.css";

import Home from "./Pages/Home";
import Cart from "./Pages/CartPage";
import Profile from "./Pages/Profile";
import PostItem from "./Pages/PostItem";
import Checkout from "./Pages/Checkout";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Browse from "./Pages/Browse";
import NotificationsPage from "./Pages/NotificationsPage";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <div className="app-container">
          <header className="app-header">
             <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
      >
        ☰
      </button>
            <nav className={isMenuOpen ? "open" : ""}>
              <Link to="/">🏠 Home</Link>
              <Link to="/browse">🔍 Browse</Link>
              <Link to="/cartpage">🛒 Cart</Link>
              <Link to="/checkout">💳 Checkout</Link>
             {/* <Link to="/signup">🆕 Sign Up</Link> */}
              <Link to="/signin">🔑 Sign In</Link>
              <Link to="/postitem">⬆️ Post Item</Link>
              <Link to="/Profile">👤 Profile</Link>
              
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/cartpage" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path='/postitem' element={<PostItem />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </main>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

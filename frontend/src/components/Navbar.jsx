import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isHome = location.pathname === '/';
  const navClass = `navbar ${scrolled || !isHome ? 'navbar-solid' : 'navbar-transparent'}`;

  return (
    <nav className={navClass} id="main-navbar">
      <div className="navbar-container container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <span className="logo-icon">🍰</span>
          <div className="logo-text">
            <span className="logo-name">Sweet Cake</span>
            <span className="logo-tagline">Premium Sri Lankan Bakery</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-links" id="navbar-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
          <li className="nav-dropdown">
            <Link to="/shop" className={location.pathname.startsWith('/shop') ? 'active' : ''}>
              Cakes <span className="dropdown-arrow">▾</span>
            </Link>
            <ul className="dropdown-menu">
              <li><Link to="/shop">All Cakes</Link></li>
              <li><Link to="/shop/birthday-cakes">Birthday Cakes</Link></li>
              <li><Link to="/shop/wedding-cakes">Wedding Cakes</Link></li>
              <li><Link to="/shop/cupcakes">Cupcakes</Link></li>
              <li><Link to="/shop/sri-lankan-special">Sri Lankan Special</Link></li>
              <li><Link to="/shop/chocolate-cakes">Chocolate Cakes</Link></li>
            </ul>
          </li>
          <li><Link to="/custom-orders" className={location.pathname === '/custom-orders' ? 'active' : ''}>Custom Orders</Link></li>
          <li><Link to="/special-offers" className={location.pathname === '/special-offers' ? 'active' : ''}>Offers</Link></li>
          <li><Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>Gallery</Link></li>
          <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
        </ul>

        {/* Right side */}
        <div className="navbar-actions">
          {/* Cart */}
          <Link to="/cart" className="nav-cart-btn" id="nav-cart-btn">
            <span className="cart-icon">🛒</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div className="nav-user-dropdown">
              <button className="nav-user-btn" id="nav-user-btn">
                <span className="user-avatar">{user.first_name?.[0]}</span>
                <span className="user-name">{user.first_name}</span>
              </button>
              <ul className="user-dropdown-menu">
                <li><Link to="/my-orders">My Orders</Link></li>
                {isAdmin && <li><Link to="/admin">Admin Dashboard</Link></li>}
                <li><button onClick={logout} className="logout-btn">Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="nav-login-btn">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            id="hamburger-btn"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobile-menu">
        <ul className="mobile-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/shop">All Cakes</Link></li>
          <li><Link to="/shop/birthday-cakes">Birthday Cakes</Link></li>
          <li><Link to="/shop/wedding-cakes">Wedding Cakes</Link></li>
          <li><Link to="/shop/cupcakes">Cupcakes</Link></li>
          <li><Link to="/custom-orders">Custom Orders</Link></li>
          <li><Link to="/special-offers">Special Offers</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {user ? (
            <>
              <li><Link to="/my-orders">My Orders</Link></li>
              {isAdmin && <li><Link to="/admin">Admin Dashboard</Link></li>}
              <li><button onClick={logout} className="mobile-logout">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

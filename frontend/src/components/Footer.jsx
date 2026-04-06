
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '../services/api';
import './Footer.css';

const Footer = () => {
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Newsletter submit handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterMsg('');
    if (!newsletterEmail) {
      setNewsletterMsg('Please enter your email address.');
      return;
    }
    setNewsletterLoading(true);
    try {
      // Use contactAPI to submit as a contact message (or create a dedicated API if needed)
      await contactAPI.submit({
        name: 'Newsletter Subscriber',
        email: newsletterEmail,
        subject: 'Newsletter Subscription',
        message: 'Please subscribe me to the newsletter.'
      });
      setNewsletterMsg('Thank you for subscribing! 🎉');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg('Subscription failed. Please try again later.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="footer" id="main-footer">
      {/* Wave decoration */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,40 C360,120 720,0 1080,80 C1260,110 1380,60 1440,40 L1440,120 L0,120Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="footer-logo-icon">🍰</span>
                <span className="footer-logo-text">Sweet Cake</span>
              </Link>
              <p className="footer-description">
                Handcrafted with love in Sri Lanka. We create memorable moments 
                through our exquisite cakes and pastries, blending traditional 
                flavors with modern artistry.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com/sweetcake" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/sweetcake" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.335 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.335-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.063-1.366.335-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.355 2.618 6.778 6.98 6.978 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.199-4.359-2.62-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://wa.me/94112345678" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.983.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .01 5.437.008 12.045c0 2.112.551 4.173 1.597 5.982L0 24l6.121-1.605a11.837 11.837 0 005.923 1.587h.005c6.604 0 12.039-5.441 12.041-12.045a11.83 11.83 0 00-3.536-8.514z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/shop">All Cakes</Link></li>
                <li><Link to="/custom-orders">Custom Orders</Link></li>
                <li><Link to="/special-offers">Special Offers</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-column">
              <h4 className="footer-heading">Cake Categories</h4>
              <ul className="footer-links">
                <li><Link to="/shop/birthday-cakes">Birthday Cakes</Link></li>
                <li><Link to="/shop/wedding-cakes">Wedding Cakes</Link></li>
                <li><Link to="/shop/cupcakes">Cupcakes</Link></li>
                <li><Link to="/shop/anniversary-cakes">Anniversary Cakes</Link></li>
                <li><Link to="/shop/sri-lankan-special">Sri Lankan Special</Link></li>
                <li><Link to="/shop/chocolate-cakes">Chocolate Cakes</Link></li>
              </ul>
            </div>

            {/* Contact & Delivery */}
            <div className="footer-column">
              <h4 className="footer-heading">Get in Touch</h4>
              <ul className="footer-contact">
                <li>📍 42 Flower Road, Colombo 07, Sri Lanka</li>
                <li>📞 +94 11 234 5678</li>
                <li>📱 +94 77 123 4567 (WhatsApp)</li>
                <li>✉️ hello@sweetcake.lk</li>
                <li>🕐 Mon-Sat: 8:00 AM - 8:00 PM</li>
                <li>🕐 Sunday: 9:00 AM - 6:00 PM</li>
              </ul>
              <div className="delivery-areas">
                <h5>We Deliver To:</h5>
                <p>Colombo, Gampaha, Kandy, Galle, Negombo, Kurunegala, and more!</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <div className="newsletter-content">
              <h4>Subscribe to Our Sweet Newsletter 🍩</h4>
              <p>Get exclusive offers, new cake alerts, and seasonal treats delivered to your inbox!</p>
            </div>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                disabled={newsletterLoading}
              />
              <button type="submit" className="btn btn-rose" disabled={newsletterLoading}>
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {newsletterMsg && (
              <div className="newsletter-message" style={{marginTop:8, color:'#fff'}}>{newsletterMsg}</div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Sweet Cake. All rights reserved. Made with 💝 in Sri Lanka.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/refund-policy">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

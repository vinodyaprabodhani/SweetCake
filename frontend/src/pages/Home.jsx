import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import CakeCard from '../components/CakeCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const observerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, bestsellerRes, catRes] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getAll({ bestseller: 'true', limit: 8 }),
          categoryAPI.getAll()
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setBestSellers(bestsellerRes.data.products);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    };
    fetchData();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const timer = setTimeout(() => {
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '50px' }
      );

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('visible');
        } else {
          observerRef.current.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [featuredProducts, bestSellers, categories]);

  const testimonials = [
    { name: 'Samanthi Jayasuriya', text: 'The birthday cake was absolutely stunning! My daughter\'s eyes lit up when she saw it. Thank you Sweet Cake!', rating: 5, location: 'Colombo' },
    { name: 'Ruwanthika Perera', text: 'Our wedding cake exceeded all expectations. The attention to detail was incredible and it tasted divine.', rating: 5, location: 'Kandy' },
    { name: 'Dinesh Fernando', text: 'Best bakery in Sri Lanka! The Watalappan cake fusion was a revelation. Will definitely order again.', rating: 5, location: 'Galle' },
    { name: 'Anusha De Silva', text: 'The custom order process was so easy. They brought my vision to life perfectly. Highly recommend!', rating: 5, location: 'Negombo' },
  ];

  return (
    <div className="home-page">
      {/* ========== HERO SECTION ========== */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          {/* Floating decorations */}
          <div className="floating-element float-1">🎂</div>
          <div className="floating-element float-2">🧁</div>
          <div className="floating-element float-3">🍰</div>
          <div className="floating-element float-4">✨</div>
          <div className="floating-element float-5">🌸</div>
          <div className="floating-element float-6">🎀</div>
        </div>
        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-label animate-fadeInDown">✨ Premium Sri Lankan Bakery</span>
            <h1 className="hero-title animate-fadeInUp">
              Crafting <span className="text-gradient">Sweet</span> Moments,<br />
              One <span className="text-accent">Cake</span> at a Time
            </h1>
            <p className="hero-subtitle animate-fadeInUp-delay">
              Handcrafted with love using the finest ingredients. From traditional Sri Lankan 
              delicacies to stunning modern designs — every cake tells a story.
            </p>
            <div className="hero-buttons animate-fadeInUp-delay2">
              <Link to="/shop" className="btn btn-rose btn-lg">
                Explore Our Cakes 🍰
              </Link>
              <Link to="/custom-orders" className="btn btn-secondary btn-lg">
                Custom Order ✨
              </Link>
            </div>
            <div className="hero-stats animate-fadeInUp-delay3">
              <div className="stat-item">
                <span className="stat-number">2000+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Cake Designs</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">8+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>
          </div>
          <div className="hero-image animate-scaleIn">
            <div className="hero-cake-showcase">
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600" 
                alt="Premium chocolate cake" 
                className="hero-cake-img"
              />
              <div className="hero-cake-glow"></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="section categories-section" id="categories-section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-label">Explore Our Collection</span>
            <h2 className="section-title">Cake Categories</h2>
            <p className="section-subtitle">From traditional Sri Lankan delights to modern masterpieces</p>
          </div>
          <div className="categories-grid">
            {categories.slice(0, 8).map((cat, index) => (
              <Link to={`/shop/${cat.slug}`} key={cat.id} className={`category-card fade-in fade-delay-${(index % 4) + 1}`}>
                <div className="category-card-image">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-card-overlay"></div>
                </div>
                <div className="category-card-content">
                  <h3>{cat.name}</h3>
                  <span className="category-count">{cat.product_count} items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="section featured-section" id="featured-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">Handpicked for You</span>
            <h2 className="section-title">Featured Cakes</h2>
            <p className="section-subtitle">Our chef's selection of the finest cakes</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <CakeCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="section-cta animate-on-scroll">
            <Link to="/shop" className="btn btn-secondary btn-lg">View All Cakes →</Link>
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="section why-section" id="why-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">Why Sweet Cake?</span>
            <h2 className="section-title">What Makes Us Special</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: '🌿', title: 'Premium Ingredients', desc: 'We use only the finest ingredients — New Zealand butter, Belgian chocolate, and fresh local produce from Sri Lanka.' },
              { icon: '👨‍🍳', title: 'Master Cake Artists', desc: 'Our team of experienced pastry chefs brings artistry and passion to every creation, with over 8 years of expertise.' },
              { icon: '🎨', title: 'Custom Designs', desc: 'From fantasy themes to elegant minimalism, we craft one-of-a-kind cakes tailored to your exact vision and celebration.' },
              { icon: '🚚', title: 'Island-wide Delivery', desc: 'We deliver across Sri Lanka with special care and temperature-controlled packaging to ensure perfection.' },
              { icon: '🏆', title: 'Award-Winning Taste', desc: 'Recognized as one of the top bakeries in Sri Lanka, our cakes win hearts with every bite.' },
              { icon: '💝', title: 'Made with Love', desc: 'Every cake is handcrafted with love and attention to detail. We treat each order as if it were our own celebration.' },
            ].map((item, index) => (
              <div key={index} className={`why-card animate-on-scroll animate-delay-${(index % 3) + 1}`}>
                <div className="why-card-icon">{item.icon}</div>
                <h3 className="why-card-title">{item.title}</h3>
                <p className="why-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BEST SELLERS ========== */}
      <section className="section bestsellers-section" id="bestsellers-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">Most Loved</span>
            <h2 className="section-title">Bestselling Cakes 🔥</h2>
            <p className="section-subtitle">The cakes our customers can't stop ordering</p>
          </div>
          <div className="products-grid">
            {bestSellers.slice(0, 4).map((product, index) => (
              <CakeCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CUSTOM CAKE CTA ========== */}
      <section className="section custom-cta-section" id="custom-cta-section">
        <div className="custom-cta-bg">
          <div className="container">
            <div className="custom-cta-content animate-on-scroll">
              <span className="section-label" style={{color: 'var(--color-gold-light)'}}>Dream It, We Bake It</span>
              <h2 className="custom-cta-title">Create Your Dream Cake</h2>
              <p className="custom-cta-desc">
                Have a unique vision? Our talented cake artists will bring your imagination to life. 
                From whimsical birthday themes to breathtaking wedding centrepieces — no dream is too big.
              </p>
              <div className="custom-cta-features">
                <div className="cta-feature">
                  <span>🎂</span>
                  <span>Any Size</span>
                </div>
                <div className="cta-feature">
                  <span>🎨</span>
                  <span>Any Design</span>
                </div>
                <div className="cta-feature">
                  <span>🍫</span>
                  <span>Any Flavor</span>
                </div>
                <div className="cta-feature">
                  <span>📅</span>
                  <span>Any Occasion</span>
                </div>
              </div>
              <Link to="/custom-orders" className="btn btn-rose btn-lg">
                Start Your Custom Order →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="section testimonials-section" id="testimonials-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <span className="section-label">Love Letters</span>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, index) => (
              <div key={index} className={`testimonial-card animate-on-scroll animate-delay-${(index % 4) + 1}`}>
                <div className="testimonial-stars">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-location">📍 {t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SPECIAL OFFERS BANNER ========== */}
      <section className="section offers-banner-section" id="offers-banner">
        <div className="container">
          <div className="offers-banner animate-on-scroll">
            <div className="offers-banner-content">
              <span className="offers-label">🎉 Limited Time Offer</span>
              <h2 className="offers-title">Avurudu Special Collection</h2>
              <p className="offers-desc">Celebrate the Sinhala & Tamil New Year with our exclusive festive cakes. Order now and get 15% off!</p>
              <Link to="/special-offers" className="btn btn-primary btn-lg">Shop Offers →</Link>
            </div>
            <div className="offers-banner-image">
              <img src="https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=500" alt="Special offer cakes" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== DELIVERY INFO ========== */}
      <section className="section delivery-section" id="delivery-section">
        <div className="container">
          <div className="delivery-grid animate-on-scroll">
            <div className="delivery-card">
              <span className="delivery-icon">🚚</span>
              <h4>Island-wide Delivery</h4>
              <p>We deliver across all major cities in Sri Lanka</p>
            </div>
            <div className="delivery-card">
              <span className="delivery-icon">⏰</span>
              <h4>Same Day Available</h4>
              <p>Order before 10 AM for same-day delivery in Colombo</p>
            </div>
            <div className="delivery-card">
              <span className="delivery-icon">🎁</span>
              <h4>Free Delivery</h4>
              <p>Free delivery for orders above LKR 5,000</p>
            </div>
            <div className="delivery-card">
              <span className="delivery-icon">❄️</span>
              <h4>Temperature Controlled</h4>
              <p>All cakes delivered in climate-controlled packaging</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

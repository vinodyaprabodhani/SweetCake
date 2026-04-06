import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewAPI } from '../services/api';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import CakeCard from '../components/CakeCard';
import './ProductDetail.css';
import ReviewItem from './ReviewItem';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getBySlug(slug);
        setProduct(data.product);
        setReviews(data.reviews || []);
        setRelated(data.related || []);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const formatPrice = (price) => new Intl.NumberFormat('en-LK').format(price);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}>★</span>);
    }
    return stars;
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div><p>Loading...</p></div>;
  if (!product) return <div className="loading-page"><h2>Product not found</h2></div>;

  const currentPrice = product.sale_price || product.price;
  const discount = product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

  return (
    <div className="product-detail-page page-enter">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            {product.category_name && <><Link to={`/shop/${product.category_name.toLowerCase().replace(/\s+/g, '-')}`}>{product.category_name}</Link><span>/</span></>}
            <span className="current">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="section product-section">
        <div className="container">
          <div className="product-grid">
            {/* Image */}
            <div className="product-image-container">
              <div className="product-main-image">
                <img src={product.image} alt={product.name} />
                {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                {product.is_featured && <span className="featured-tag">⭐ Featured</span>}
              </div>
              <div className="product-image-3d-hint">
                <span>🔄</span> Hover to explore
              </div>
            </div>

            {/* Info */}
            <div className="product-info">
              <span className="product-category-tag">{product.category_name}</span>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating-row">
                <div className="stars">{renderStars(product.rating)}</div>
                <span style={{fontWeight: 'bold', fontSize: '1.5rem', margin: '0 8px'}}>{Number(product.rating).toFixed(1)}</span>
                <a
                  href="#reviews"
                  style={{ color: '#a0a0a0', fontSize: '1.1rem', textDecoration: 'none' }}
                  onClick={e => {
                    e.preventDefault();
                    setActiveTab('reviews');
                    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  ({product.review_count} reviews)
                </a>
              </div>

              <div className="product-price-box">
                <span className="product-price-current">LKR {formatPrice(currentPrice)}</span>
                {product.sale_price && (
                  <span className="product-price-original">LKR {formatPrice(product.price)}</span>
                )}
                {discount > 0 && <span className="save-badge">Save {discount}%!</span>}
              </div>

              <p className="product-short-desc">{product.short_description}</p>

              <div className="product-meta-info">
                {product.weight && <div className="meta-item"><span className="meta-icon">⚖️</span><span>Weight: {product.weight}</span></div>}
                {product.serves && <div className="meta-item"><span className="meta-icon">👥</span><span>Serves: {product.serves}</span></div>}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="product-actions">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">−</button>
                  <span className="qty-value">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
                </div>
                <button className="btn btn-rose btn-lg add-to-cart-btn" onClick={() => addToCart(product, quantity)}>
                  🛒 Add to Cart — LKR {formatPrice(currentPrice * quantity)}
                </button>
              </div>

              {/* Trust badges */}
              <div className="trust-badges">
                <div className="trust-item">🚚 Free delivery over LKR 5,000</div>
                <div className="trust-item">❄️ Temperature-controlled delivery</div>
                <div className="trust-item">🔄 Freshness guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section product-tabs-section">
        <div className="container">
          <div className="tabs">
            <button className={`tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>Ingredients</button>
            <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews ({reviews.length})</button>
          </div>
          <div className="tab-content">
            {activeTab === 'description' && <div className="tab-panel"><p>{product.description}</p></div>}
            {activeTab === 'ingredients' && <div className="tab-panel"><p>{product.ingredients}</p></div>}
            {activeTab === 'reviews' && (
              <div className="tab-panel">
                {/* Review Form - always visible, but only submit if logged in */}
                <form
                  className="review-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setReviewError('');
                    setReviewSuccess('');
                    if (!user) {
                      setReviewError('You must be logged in to submit a review.');
                      return;
                    }
                    if (!reviewRating || !reviewComment.trim()) {
                      setReviewError('Please provide a rating and comment.');
                      return;
                    }
                    setReviewSubmitting(true);
                    try {
                      await reviewAPI.add({ product_id: product.id, rating: reviewRating, comment: reviewComment });
                      setReviewSuccess('Review submitted! Awaiting approval.');
                      setReviewRating(0);
                      setReviewComment('');
                      // Optionally, fetch reviews again
                      const { data } = await reviewAPI.getForProduct(product.id);
                      setReviews(data);
                    } catch (err) {
                      setReviewError(err.response?.data?.message || 'Failed to submit review.');
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }}
                  style={{ marginBottom: 32 }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontWeight: 500 }}>Your Rating: </label>
                    {[1,2,3,4,5].map(star => (
                      <span
                        key={star}
                        style={{ cursor: 'pointer', color: star <= reviewRating ? '#e57373' : '#ccc', fontSize: 24 }}
                        onClick={() => setReviewRating(star)}
                        data-testid={`star-${star}`}
                      >★</span>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder={user ? "Write your review..." : "Login to write a review..."}
                    style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                    disabled={!user}
                    required
                  />
                  <div>
                    <button type="submit" className="btn btn-rose" disabled={reviewSubmitting || !user}>
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                  {!user && <div style={{ color: '#b77', marginTop: 8 }}>You must be logged in to submit a review.</div>}
                  {reviewError && <div style={{ color: 'red', marginTop: 8 }}>{reviewError}</div>}
                  {reviewSuccess && <div style={{ color: 'green', marginTop: 8 }}>{reviewSuccess}</div>}
                </form>
                {/* Reviews List */}
                {reviews.length === 0 ? <p>No reviews yet. Be the first to review!</p> : (
                  <div className="reviews-list">
                    {reviews.map((review, i) => (
                      <ReviewItem
                        key={i}
                        review={review}
                        user={user}
                        onDelete={async (id) => {
                          if (!window.confirm('Delete this review?')) return;
                          try {
                            await reviewAPI.delete(id);
                            const { data } = await reviewAPI.getForProduct(product.id);
                            setReviews(data);
                          } catch (err) {
                            alert('Failed to delete review.');
                          }
                        }}
                        onEdit={async (id, newRating, newComment, done) => {
                          try {
                            await reviewAPI.delete(id); // Remove old review
                            await reviewAPI.add({ product_id: product.id, rating: newRating, comment: newComment }); // Add new
                            const { data } = await reviewAPI.getForProduct(product.id);
                            setReviews(data);
                            done();
                          } catch (err) {
                            alert('Failed to edit review.');
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>


    </div>
  );
};

export default ProductDetail;

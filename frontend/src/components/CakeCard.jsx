import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CakeCard.css';

const CakeCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const formatPrice = (price) => {
    // Always show as whole number (no decimals) for LKR
    return new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 }).format(Math.round(price));
  };

  return (
    <div className={`cake-card animate-on-scroll animate-delay-${(index % 4) + 1}`} id={`cake-card-${product.id}`}>
      {/* Image Container */}
      <div className="cake-card-image">
        <Link to={`/product/${product.slug}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="cake-card-overlay">
            <span className="view-details">View Details ✨</span>
          </div>
        </Link>
        {/* Badges */}
        <div className="cake-card-badges">
          {product.sale_price && <span className="badge badge-sale">SALE</span>}
          {product.is_featured && <span className="badge badge-featured">⭐ Featured</span>}
          {product.is_bestseller && <span className="badge badge-new">🔥 Bestseller</span>}
        </div>
        {/* Quick add */}
        <button
          className="quick-add-btn"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          🛒 Add
        </button>
      </div>

      {/* Card Body */}
      <div className="cake-card-body">
        <span className="cake-card-category">{product.category_name}</span>
        <Link to={`/product/${product.slug}`}>
          <h3 className="cake-card-title">{product.name}</h3>
        </Link>
        <p className="cake-card-desc">{product.short_description}</p>

        <div className="cake-card-meta">
          <div className="cake-card-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-count">({product.review_count})</span>
          </div>
          <div className="cake-card-price">
            {product.sale_price ? (
              <>
                <span className="price-current">LKR {formatPrice(product.sale_price)}</span>
                <span className="price-original">LKR {formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="price-current">LKR {formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        <button className="btn btn-primary cake-card-btn" onClick={() => addToCart(product)}>
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
};

export default CakeCard;

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  const formatPrice = (price) => new Intl.NumberFormat('en-LK').format(price);
  const shippingFee = total >= 5000 ? 0 : 350;
  const grandTotal = total + shippingFee;

  if (items.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="cart-empty-page">
          <span style={{fontSize:'5rem'}}>🛒</span>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any cakes yet!</p>
          <Link to="/shop" className="btn btn-rose btn-lg">Browse Cakes →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="cart-header-section">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              {items.map(item => {
                const price = item.sale_price || item.price;
                return (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <span className="cart-item-price">LKR {formatPrice(price)}</span>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="qty-btn">−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
                    </div>
                    <div className="cart-item-total">
                      <span>LKR {formatPrice(price * item.quantity)}</span>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>LKR {formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="free-shipping">FREE ✨</span> : `LKR ${formatPrice(shippingFee)}`}</span>
              </div>
              {total < 5000 && (
                <div className="free-shipping-hint">
                  Add LKR {formatPrice(5000 - total)} more for free shipping! 🚚
                </div>
              )}
              <div className="summary-total">
                <span>Total</span>
                <span>LKR {formatPrice(grandTotal)}</span>
              </div>
              {user ? (
                <Link to="/checkout" className="btn btn-rose btn-lg" style={{width:'100%'}}>
                  Proceed to Checkout →
                </Link>
              ) : (
                <Link to="/login" className="btn btn-rose btn-lg" style={{width:'100%'}}>
                  Login to Checkout →
                </Link>
              )}
              <Link to="/shop" className="continue-shopping">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shipping_address: '', shipping_city: '', shipping_phone: '',
    payment_method: 'cod', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const formatPrice = (p) => new Intl.NumberFormat('en-LK').format(p);
  const shippingFee = total >= 5000 ? 0 : 350;
  const grandTotal = total + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await orderAPI.place(form);
      setOrderPlaced(data.order);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page page-enter">
        <div className="order-success">
          <div className="success-animation">🎉</div>
          <h1>Order Confirmed!</h1>
          <p>Your order <strong>#{orderPlaced.order_number}</strong> has been placed successfully.</p>
          <div className="order-success-details">
            <div className="osd-item"><span>Order Number</span><strong>{orderPlaced.order_number}</strong></div>
            <div className="osd-item"><span>Total Amount</span><strong>LKR {formatPrice(orderPlaced.total_amount)}</strong></div>
            <div className="osd-item"><span>Status</span><strong className="status-badge">Pending</strong></div>
          </div>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/my-orders" className="btn btn-primary btn-lg">View My Orders</Link>
            <Link to="/shop" className="btn btn-secondary btn-lg">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page page-enter">
        <div className="order-success">
          <h2>Your cart is empty</h2>
          <Link to="/shop" className="btn btn-rose btn-lg">Browse Cakes</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="checkout-page page-enter">
        <div className="order-success" style={{textAlign: 'center', maxWidth: '500px'}}>
          <div className="success-animation">🔒</div>
          <h2>Account Required</h2>
          <p>You must be signed in to submit an order. Don't worry, your Cart is safe!</p>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', marginTop:'2rem'}}>
            <Link to="/login" className="btn btn-primary btn-lg">Log In</Link>
            <Link to="/register" className="btn btn-secondary btn-lg">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-enter">
      <div className="checkout-header"><div className="container"><h1>Checkout</h1></div></div>
      <section className="section">
        <div className="container">
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h3>Shipping Details</h3>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea value={form.shipping_address} onChange={e => setForm({...form, shipping_address: e.target.value})} required rows="2" placeholder="Full delivery address"></textarea>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select value={form.shipping_city} onChange={e => setForm({...form, shipping_city: e.target.value})} required>
                    <option value="">Select city</option>
                    {['Colombo','Gampaha','Kandy','Galle','Negombo','Kurunegala','Matara','Jaffna','Batticaloa','Trincomalee','Ratnapura','Anuradhapura'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input value={form.shipping_phone} onChange={e => setForm({...form, shipping_phone: e.target.value})} required placeholder="+94 7X XXX XXXX" />
                </div>
              </div>
              <h3 style={{marginTop:'var(--space-6)'}}>Payment Method</h3>
              <div className="payment-options">
                {[
                  { val:'cod', label:'Cash on Delivery', icon:'💵', desc:'Pay when you receive your order' },
                  { val:'card', label:'Card Payment', icon:'💳', desc:'Pay securely with your card' },
                  { val:'bank_transfer', label:'Bank Transfer', icon:'🏦', desc:'Transfer to our bank account' },
                ].map(p => (
                  <label key={p.val} className={`payment-option ${form.payment_method === p.val ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={p.val} checked={form.payment_method === p.val} onChange={e => setForm({...form, payment_method: e.target.value})} />
                    <span className="payment-icon">{p.icon}</span>
                    <div><strong>{p.label}</strong><span>{p.desc}</span></div>
                  </label>
                ))}
              </div>
              <div className="form-group" style={{marginTop:'var(--space-5)'}}>
                <label className="form-label">Order Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows="2" placeholder="Any special instructions for delivery..."></textarea>
              </div>
              <button type="submit" className="btn btn-rose btn-lg" style={{width:'100%'}} disabled={loading}>
                {loading ? 'Placing Order...' : `🎉 Place Order — LKR ${formatPrice(grandTotal)}`}
              </button>
            </form>

            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="checkout-items">
                {items.map(item => (
                  <div key={item.id} className="checkout-item">
                    <img src={item.image?.startsWith('/images/') ? `${import.meta.env.BASE_URL}${item.image.slice(1)}` : item.image} alt={item.name} />
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-qty">x{item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">LKR {formatPrice((item.sale_price || item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-row"><span>Subtotal</span><span>LKR {formatPrice(total)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `LKR ${formatPrice(shippingFee)}`}</span></div>
              <div className="summary-total"><span>Total</span><span>LKR {formatPrice(grandTotal)}</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;

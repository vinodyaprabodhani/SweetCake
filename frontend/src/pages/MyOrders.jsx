import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [user, navigate]);

  const formatPrice = (p) => new Intl.NumberFormat('en-LK').format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });

  const statusColors = {
    pending: '#F59E0B', confirmed: '#3B82F6', processing: '#8B5CF6',
    baking: '#EC4899', out_for_delivery: '#10B981', delivered: '#059669', cancelled: '#EF4444'
  };

  if (loading) return <div className="loading-page" style={{paddingTop:'120px'}}><div className="spinner"></div></div>;

  return (
    <div className="orders-page page-enter">
      <div className="orders-header"><div className="container"><h1>My Orders</h1><p>Track and manage your cake orders</p></div></div>
      <section className="section">
        <div className="container">
          {orders.length === 0 ? (
            <div className="no-orders">
              <span style={{fontSize:'4rem'}}>📦</span>
              <h2>No Orders Yet</h2>
              <p>You haven't placed any orders yet. Start exploring our cakes!</p>
              <Link to="/shop" className="btn btn-rose btn-lg">Browse Cakes →</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-number">#{order.order_number}</span>
                      <span className="order-date">{formatDate(order.created_at)}</span>
                    </div>
                    <span className="order-status" style={{background: statusColors[order.status] || '#888'}}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="order-card-items">
                    {order.items?.map((item, i) => (
                      <div key={i} className="order-item-mini">
                        <img src={item.product_image?.startsWith('/images/') ? `${import.meta.env.BASE_URL}${item.product_image.slice(1)}` : item.product_image} alt={item.product_name} />
                        <div>
                          <span className="oi-name">{item.product_name}</span>
                          <span className="oi-qty">x{item.quantity} — LKR {formatPrice(item.total_price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-card-footer">
                    <div className="order-payment">
                      <span>Payment: {order.payment_method?.toUpperCase()}</span>
                      <span className={`payment-status ps-${order.payment_status}`}>{order.payment_status}</span>
                    </div>
                    <div className="order-total">
                      <span>Total:</span>
                      <strong>LKR {formatPrice(order.total_amount)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyOrders;

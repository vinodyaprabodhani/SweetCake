import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, orderAPI, productAPI, categoryAPI, customOrderAPI, contactAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', description: '', short_description: '', price: '', 
    sale_price: '', category_id: '', image: '', ingredients: '', weight: '', 
    serves: '', is_featured: false, is_bestseller: false, is_available: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/login'); return; }
    fetchData();
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    try {
      const [dashRes, ordersRes, productsRes, usersRes, customRes, msgRes, catRes] = await Promise.all([
        adminAPI.getDashboard(),
        orderAPI.getAll({}),
        productAPI.getAll({ limit: 100 }),
        adminAPI.getUsers(),
        customOrderAPI.getAll(),
        contactAPI.getAll(),
        categoryAPI.getAll()
      ]);
      setDashboard(dashRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data.products);
      setUsers(usersRes.data);
      setCustomOrders(customRes.data);
      setMessages(msgRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-LK').format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' });

  const updateOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      fetchData();
    } catch (err) { alert('Failed to update'); }
  };

  const handleUpdateCustomOrderStatus = async (id, status) => {
    try {
      await customOrderAPI.update(id, { status });
      fetchData();
    } catch (err) { alert('Failed to update custom order status'); }
  };

  const handleDeleteContactMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await contactAPI.delete(id);
        fetchData();
      } catch(err) {
        alert("Failed to delete message");
      }
    }
  };

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '', slug: product.slug || '', description: product.description || '',
        short_description: product.short_description || '', price: product.price || '',
        sale_price: product.sale_price || '', category_id: product.category_id || '', image: product.image || '',
        ingredients: product.ingredients || '', weight: product.weight || '', serves: product.serves || '',
        is_featured: product.is_featured || false, is_bestseller: product.is_bestseller || false,
        is_available: product.is_available ?? true
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', slug: '', description: '', short_description: '', price: '',
        sale_price: '', category_id: categories.length > 0 ? categories[0].id : '', image: '',
        ingredients: '', weight: '', serves: '', is_featured: false, is_bestseller: false, is_available: true
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleProductChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    let newForm = { ...productForm, [name]: value };
    
    // Auto-generate slug from name if creating
    if (!editingProduct && name === 'name') {
      newForm.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    setProductForm(newForm);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, productForm);
      } else {
        await productAPI.create(productForm);
      }
      closeProductModal();
      fetchData();
    } catch (error) {
      alert('Failed to save product. Check required fields.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this cake? This cannot be undone.')) {
      try {
        await productAPI.delete(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete product.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading-page" style={{paddingTop:'120px'}}><div className="spinner"></div></div>;

  const stats = dashboard?.stats || {};

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'orders', label: `📦 Orders (${stats.pending_orders || 0})` },
    { id: 'products', label: '🍰 Products' },
    { id: 'customers', label: '👥 Customers' },
    { id: 'custom', label: `🎨 Custom (${stats.pending_custom_orders || 0})` },
    { id: 'messages', label: `💌 Messages (${stats.unread_messages || 0})` },
  ];

  return (
    <div className="admin-page page-enter">
      <div className="admin-header"><div className="container"><h1>Admin Dashboard</h1><p>Manage your Sweet Cake business</p></div></div>

      <div className="container admin-layout">
        {/* Sidebar tabs */}
        <nav className="admin-sidebar">
          {tabs.map(tab => (
            <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </nav>

        {/* Content */}
        <div className="admin-content">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-grid">
                {[
                  { label: 'Total Orders', value: stats.total_orders, icon: '📦', color: '#3B82F6' },
                  { label: 'Revenue', value: `LKR ${formatPrice(stats.total_revenue || 0)}`, icon: '💰', color: '#10B981' },
                  { label: 'Customers', value: stats.total_users, icon: '👥', color: '#8B5CF6' },
                  { label: 'Products', value: stats.total_products, icon: '🍰', color: '#EC4899' },
                  { label: 'Pending Orders', value: stats.pending_orders, icon: '⏳', color: '#F59E0B' },
                  { label: 'Custom Requests', value: stats.pending_custom_orders, icon: '🎨', color: '#6366F1' },
                  { label: 'Unread Messages', value: stats.unread_messages, icon: '💌', color: '#EF4444' },
                ].map((stat, i) => (
                  <div key={i} className="stat-card" style={{'--stat-color': stat.color}}>
                    <div className="stat-card-icon">{stat.icon}</div>
                    <div className="stat-card-info">
                      <span className="stat-card-value">{stat.value}</span>
                      <span className="stat-card-label">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <h3 style={{margin:'2rem 0 1rem', color:'var(--color-chocolate)'}}>Recent Orders</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {(dashboard?.recent_orders || []).map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.order_number}</strong></td>
                        <td>{o.first_name} {o.last_name}</td>
                        <td>LKR {formatPrice(o.total_amount)}</td>
                        <td><span className="table-status" style={{background: o.status === 'delivered' ? '#059669' : o.status === 'pending' ? '#F59E0B' : '#3B82F6'}}>{o.status}</span></td>
                        <td>{formatDate(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="admin-section-title">All Orders ({orders.length})</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.order_number}</strong><br/><small>{formatDate(o.created_at)}</small></td>
                        <td>{o.first_name} {o.last_name}<br/><small>{o.email}</small></td>
                        <td>{o.items?.length} items</td>
                        <td>LKR {formatPrice(o.total_amount)}</td>
                        <td><span className="table-status" style={{background: o.status === 'delivered' ? '#059669' : o.status === 'cancelled' ? '#EF4444' : '#F59E0B'}}>{o.status}</span></td>
                        <td>
                          <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className="status-select">
                            {['pending','confirmed','processing','baking','out_for_delivery','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div>
              <div className="admin-section-header-flex">
                <h2 className="admin-section-title">All Products ({products.length})</h2>
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenProductModal()}>+ Add Cake</button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.image} alt={p.name} style={{width:50,height:50,borderRadius:8,objectFit:'cover'}} /></td>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.category_name}</td>
                        <td>LKR {formatPrice(p.price)}{p.sale_price && <><br/><small style={{color:'#EF4444'}}>Sale: LKR {formatPrice(p.sale_price)}</small></>}</td>
                        <td>⭐ {p.rating} ({p.review_count})</td>
                        <td>
                          {p.is_available ? <span className="mini-badge" style={{background:'#10B981'}}>Active</span> : <span className="mini-badge" style={{background:'#6B7280'}}>Hidden</span>}
                          {p.is_featured && <span className="mini-badge feat" style={{marginLeft: '4px'}}>Featured</span>} 
                          {p.is_bestseller && <span className="mini-badge best" style={{marginLeft: '4px'}}>Bestseller</span>}
                        </td>
                        <td className="actions-cell">
                          <button onClick={() => handleOpenProductModal(p)} className="action-btn edit-btn" title="Edit">✎</button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="action-btn delete-btn" title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers */}
          {activeTab === 'customers' && (
            <div>
              <h2 className="admin-section-title">Customers ({users.length})</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td><strong>{u.first_name} {u.last_name}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phone || '-'}</td>
                        <td>{u.city || '-'}</td>
                        <td><span className="mini-badge" style={{background: u.role === 'admin' ? '#EC4899' : '#3B82F6'}}>{u.role}</span></td>
                        <td>{formatDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Custom Orders */}
          {activeTab === 'custom' && (
            <div>
              <h2 className="admin-section-title">Custom Orders ({customOrders.length})</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Customer</th><th>Cake Type</th><th>Size</th><th>Delivery Date</th><th>Budget</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {customOrders.map(co => (
                      <tr key={co.id}>
                        <td><strong>{co.customer_name}</strong><br/><small>{co.customer_email}</small></td>
                        <td>{co.cake_type}</td>
                        <td>{co.cake_size || '-'}</td>
                        <td>{formatDate(co.delivery_date)}</td>
                        <td>{co.budget_range || '-'}</td>
                        <td><span className="table-status" style={{background: co.status === 'pending' ? '#F59E0B' : co.status === 'cancelled' ? '#EF4444' : '#10B981'}}>{co.status}</span></td>
                        <td className="actions-cell" style={{minWidth: '90px'}}>
                          {co.status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateCustomOrderStatus(co.id, 'accepted')} className="action-btn" style={{background: '#10B981', color: 'white', marginRight: '5px'}} title="Accept Order">✓</button>
                              <button onClick={() => handleUpdateCustomOrderStatus(co.id, 'cancelled')} className="action-btn" style={{background: '#EF4444', color: 'white'}} title="Reject Order">✗</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="admin-section-title">Contact Messages ({messages.length})</h2>
              <div className="messages-list">
                {messages.map(m => (
                  <div key={m.id} className={`message-card ${m.is_read ? '' : 'unread'}`}>
                    <div className="message-header">
                      <div>
                        <strong>{m.name}</strong>
                        <span className="message-email">{m.email}</span>
                      </div>
                      <span className="message-date">{formatDate(m.created_at)}</span>
                    </div>
                    <div className="message-subject">{m.subject || 'General Inquiry'}</div>
                    <p className="message-body">{m.message}</p>
                    <div style={{marginTop: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '10px', display: 'flex', gap: '10px'}}>
                      <a href={`mailto:${m.email}?subject=Reply:%20${m.subject || 'General Inquiry'}`} className="btn btn-secondary btn-sm" style={{textDecoration: 'none'}}>Reply ✉️</a>
                      <button onClick={() => handleDeleteContactMessage(m.id)} className="btn btn-secondary btn-sm" style={{color: '#EF4444', borderColor: '#EF4444'}}>Delete 🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal */}
          {showProductModal && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal-header">
                  <h2>{editingProduct ? 'Edit Cake' : 'Add New Cake'}</h2>
                  <button className="close-btn" onClick={closeProductModal}>&times;</button>
                </div>
                <form className="admin-modal-body" onSubmit={handleSaveProduct}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required />
                    </div>
                    <div className="form-group">
                      <label>Slug *</label>
                      <input type="text" name="slug" value={productForm.slug} onChange={handleProductChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (LKR) *</label>
                      <input type="number" name="price" value={productForm.price} onChange={handleProductChange} required />
                    </div>
                    <div className="form-group">
                      <label>Sale Price (LKR)</label>
                      <input type="number" name="sale_price" value={productForm.sale_price || ''} onChange={handleProductChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select name="category_id" value={productForm.category_id} onChange={handleProductChange} required>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Weight (e.g., 1 kg)</label>
                      <input type="text" name="weight" value={productForm.weight} onChange={handleProductChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL *</label>
                    <input type="url" name="image" value={productForm.image} onChange={handleProductChange} required />
                  </div>
                  <div className="form-group">
                    <label>Short Description *</label>
                    <input type="text" name="short_description" value={productForm.short_description} onChange={handleProductChange} required />
                  </div>
                  <div className="form-group">
                    <label>Detailed Description *</label>
                    <textarea name="description" value={productForm.description} onChange={handleProductChange} rows="3" required></textarea>
                  </div>
                  <div className="form-group">
                    <label>Ingredients</label>
                    <input type="text" name="ingredients" value={productForm.ingredients} onChange={handleProductChange} placeholder="Flour, Sugar, Butter..." />
                  </div>
                  <div className="form-row checkbox-row">
                    <label className="checkbox-label">
                      <input type="checkbox" name="is_featured" checked={productForm.is_featured} onChange={handleProductChange} />
                      Featured
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="is_bestseller" checked={productForm.is_bestseller} onChange={handleProductChange} />
                      Bestseller
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="is_available" checked={productForm.is_available} onChange={handleProductChange} />
                      Active / Available
                    </label>
                  </div>
                  <div className="admin-modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeProductModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

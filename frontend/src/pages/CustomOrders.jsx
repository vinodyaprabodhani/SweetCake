import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customOrderAPI } from '../services/api';
import './CustomOrders.css';

const CustomOrders = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    cake_type: '', cake_size: '', cake_flavor: '', cake_layers: 1,
    decoration_details: '', message_on_cake: '', delivery_date: '',
    delivery_address: '', budget_range: '', additional_notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customOrderAPI.submit(form);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="custom-page page-enter">
        <div className="custom-hero"><div className="custom-hero-overlay"></div>
          <div className="container custom-hero-content"><h1>Custom Orders</h1><p>Your dream cake awaits</p></div>
        </div>
        <div className="section"><div className="container"><div className="success-message">
          <span style={{fontSize:'4rem'}}>🎉</span>
          <h2>Order Submitted!</h2>
          <p>Thank you! Our team will contact you within 24 hours with a quote. Check your email for confirmation.</p>
          <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setForm({customer_name:'',customer_email:'',customer_phone:'',cake_type:'',cake_size:'',cake_flavor:'',cake_layers:1,decoration_details:'',message_on_cake:'',delivery_date:'',delivery_address:'',budget_range:'',additional_notes:''}); }}>Submit Another Order</button>
        </div></div></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="custom-page page-enter">
        <div className="custom-hero">
          <div className="custom-hero-overlay"></div>
          <div className="container custom-hero-content">
            <h1>Account Required</h1>
            <p>You must be signed in to request a custom cake.</p>
          </div>
        </div>
        <div className="section"><div className="container">
          <div className="success-message">
            <span style={{fontSize:'3rem'}}>🔒</span>
            <h2>Sign in to Order</h2>
            <p>Our expert bakers would love to bring your vision to life. Please log in or create an account to submit your custom request!</p>
            <div style={{display:'flex', gap:'1rem', justifyContent:'center', marginTop:'2rem'}}>
              <Link to="/login" className="btn btn-primary btn-lg">Log In</Link>
              <Link to="/register" className="btn btn-secondary btn-lg">Create Account</Link>
            </div>
          </div>
        </div></div>
      </div>
    );
  }

  return (
    <div className="custom-page page-enter">
      <div className="custom-hero">
        <div className="custom-hero-overlay"></div>
        <div className="container custom-hero-content">
          <span className="hero-label-about">🎨 Your Vision, Our Creation</span>
          <h1>Custom Cake Orders</h1>
          <p>Tell us your dream cake and we'll make it a reality</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="custom-layout">
            <div className="custom-info">
              <h2>How It Works</h2>
              <div className="steps-list">
                {[
                  { step: '01', title: 'Share Your Vision', desc: 'Fill in the form with details about your dream cake.' },
                  { step: '02', title: 'Get a Quote', desc: 'Our team will review and send you a custom quote within 24 hours.' },
                  { step: '03', title: 'Confirm & Create', desc: 'Once confirmed, our artists start crafting your masterpiece.' },
                  { step: '04', title: 'Receive & Enjoy', desc: 'Your custom cake is delivered fresh to your doorstep!' },
                ].map((s, i) => (
                  <div key={i} className="step-item">
                    <span className="step-number">{s.step}</span>
                    <div><h4>{s.title}</h4><p>{s.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <form className="custom-form" onSubmit={handleSubmit}>
              <h3>Order Details</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input name="customer_name" value={form.customer_name} onChange={handleChange} required placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange} required placeholder="email@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input name="customer_phone" value={form.customer_phone} onChange={handleChange} required placeholder="+94 7X XXX XXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Cake Type *</label>
                  <select name="cake_type" value={form.cake_type} onChange={handleChange} required>
                    <option value="">Select type</option>
                    <option>Birthday Cake</option><option>Wedding Cake</option><option>Anniversary Cake</option>
                    <option>Cupcakes</option><option>Corporate Cake</option><option>Baby Shower Cake</option>
                    <option>Graduation Cake</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Size</label>
                  <select name="cake_size" value={form.cake_size} onChange={handleChange}>
                    <option value="">Select size</option>
                    <option>Small (1 kg)</option><option>Medium (2 kg)</option><option>Large (3 kg)</option>
                    <option>Extra Large (5 kg)</option><option>Custom Size</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Flavor</label>
                  <select name="cake_flavor" value={form.cake_flavor} onChange={handleChange}>
                    <option value="">Select flavor</option>
                    <option>Vanilla</option><option>Chocolate</option><option>Red Velvet</option>
                    <option>Strawberry</option><option>Butter</option><option>Coffee</option>
                    <option>Lemon</option><option>Coconut</option><option>Watalappan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Layers</label>
                  <input type="number" name="cake_layers" value={form.cake_layers} onChange={handleChange} min="1" max="10" />
                </div>
                <div className="form-group">
                  <label className="form-label">Budget Range</label>
                  <select name="budget_range" value={form.budget_range} onChange={handleChange}>
                    <option value="">Select budget</option>
                    <option>Under LKR 5,000</option><option>LKR 5,000 - 10,000</option>
                    <option>LKR 10,000 - 25,000</option><option>LKR 25,000 - 50,000</option>
                    <option>Above LKR 50,000</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message on Cake</label>
                <input name="message_on_cake" value={form.message_on_cake} onChange={handleChange} placeholder="e.g. Happy Birthday Sarah!" />
              </div>
              <div className="form-group">
                <label className="form-label">Decoration Details *</label>
                <textarea name="decoration_details" value={form.decoration_details} onChange={handleChange} rows="4" required placeholder="Describe your dream cake design, colors, theme, special elements..."></textarea>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Delivery Date *</label>
                  <input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <input name="delivery_address" value={form.delivery_address} onChange={handleChange} placeholder="Full delivery address" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea name="additional_notes" value={form.additional_notes} onChange={handleChange} rows="3" placeholder="Any allergies, dietary requirements, or special instructions..."></textarea>
              </div>
              <button type="submit" className="btn btn-rose btn-lg" style={{width:'100%'}} disabled={loading}>
                {loading ? 'Submitting...' : '✨ Submit Custom Order'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomOrders;

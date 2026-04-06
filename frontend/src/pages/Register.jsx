import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        <div className="auth-image-side">
          <img src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800" alt="Wedding Cake" />
          <div className="auth-image-overlay">
            <div className="auth-image-content">
              <span className="auth-image-icon">🎂</span>
              <h2>Join Sweet Cake!</h2>
              <p>Create an account to unlock exclusive offers, track orders, and save your favorite cakes.</p>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-content">
            <Link to="/" className="auth-logo">🍰 Sweet Cake</Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Start your sweet journey with us!</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required placeholder="First name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required placeholder="Last name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+94 7X XXX XXXX" />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="At least 6 characters" minLength="6" />
              </div>
              <button type="submit" className="btn btn-rose btn-lg auth-submit-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

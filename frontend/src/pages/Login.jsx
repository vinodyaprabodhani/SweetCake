import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        <div className="auth-image-side">
          <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800" alt="Cake" />
          <div className="auth-image-overlay">
            <div className="auth-image-content">
              <span className="auth-image-icon">🍰</span>
              <h2>Welcome Back!</h2>
              <p>Sign in to your Sweet Cake account to order your favorite cakes and track deliveries.</p>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-form-content">
            <Link to="/" className="auth-logo">🍰 Sweet Cake</Link>
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Welcome back! Please enter your details.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="you@example.com" id="login-email" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="••••••••" id="login-password" />
              </div>
              <button type="submit" className="btn btn-rose btn-lg auth-submit-btn" disabled={loading} id="login-submit">
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { contactAPI } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(form);
      setSubmitted(true);
    } catch { alert('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page page-enter">
      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="container contact-hero-content">
          <span className="hero-label-about">📞 Get in Touch</span>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you!</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info-side">
              <h2>Let's Connect</h2>
              <p>Have a question, need a quote, or want to share feedback? We're here for you!</p>

              <div className="contact-info-cards">
                <div className="contact-card">
                  <span className="contact-card-icon">📍</span>
                  <h4>Visit Us</h4>
                  <p>42 Flower Road, Colombo 07<br/>Sri Lanka</p>
                </div>
                <div className="contact-card">
                  <span className="contact-card-icon">📞</span>
                  <h4>Call Us</h4>
                  <p>+94 11 234 5678<br/>+94 77 123 4567 (WhatsApp)</p>
                </div>
                <div className="contact-card">
                  <span className="contact-card-icon">✉️</span>
                  <h4>Email Us</h4>
                  <p>hello@sweetcake.lk<br/>orders@sweetcake.lk</p>
                </div>
                <div className="contact-card">
                  <span className="contact-card-icon">🕐</span>
                  <h4>Working Hours</h4>
                  <p>Mon-Sat: 8:00 AM - 8:00 PM<br/>Sunday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="contact-social">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="https://facebook.com/sweetcake" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
                    Facebook
                  </a>
                  <a href="https://instagram.com/sweetcake" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.335 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.335-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.063-1.366.335-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.355 2.618 6.778 6.98 6.978 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.199-4.359-2.62-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    Instagram
                  </a>
                  <a href="https://wa.me/94112345678" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.983.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .01 5.437.008 12.045c0 2.112.551 4.173 1.597 5.982L0 24l6.121-1.605a11.837 11.837 0 005.923 1.587h.005c6.604 0 12.039-5.441 12.041-12.045a11.83 11.83 0 00-3.536-8.514z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-side">
              {submitted ? (
                <div className="success-message" style={{padding: '3rem'}}>
                  <span style={{fontSize:'3rem'}}>💌</span>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll respond within 24 hours.</p>
                  <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({name:'',email:'',phone:'',subject:'',message:''}); }}>Send Another</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h3>Send Us a Message</h3>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="email@example.com" />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+94 7X XXX XXXX" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                        <option value="">Select subject</option>
                        <option>General Inquiry</option><option>Order Question</option>
                        <option>Custom Cake Quote</option><option>Feedback</option><option>Complaint</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows="5" required placeholder="Tell us how we can help..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-rose btn-lg" style={{width:'100%'}} disabled={loading}>
                    {loading ? 'Sending...' : '📨 Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.83416972283!2d79.85172285!3d6.9038933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25962f37c356d%3A0x1d5f2a1b9c9f0b1a!2s42%20Flower%20Rd%2C%20Colombo%2000700!5e0!3m2!1sen!2slk!4v1707000000000!5m2!1sen!2slk" 
                width="100%" 
                height="450" 
                style={{ border: 0, borderRadius: 'var(--radius-xl)' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sweet Cake Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

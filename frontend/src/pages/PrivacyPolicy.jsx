import React from 'react';
import './About.css'; // Reusing About.css for consistent text layout

const PrivacyPolicy = () => {
  return (
    <div className="about-page page-enter">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <span className="hero-label-about">🛡️ Security & Trust</span>
          <h1>Privacy Policy</h1>
          <p>How we protect your sweet moments and personal data</p>
        </div>
      </div>

      <section className="section">
        <div className="container container-sm">
          <div className="text-content">
            <h2>Your Privacy Matters</h2>
            <p>
              At Sweet Cake, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
            </p>

            <h3>Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, such as your name, email address, phone number, 
              delivery address, and payment information when you place an order or create an account.
            </p>

            <h3>How We Use Your Information</h3>
            <p>
              We use the information we collect to:
              <ul>
                <li>Process and fulfill your cake orders.</li>
                <li>Communicate with you about your orders and requests.</li>
                <li>Send you promotional offers and updates (with your consent).</li>
                <li>Improve our website and customer service.</li>
              </ul>
            </p>

            <h3>Data Security</h3>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. 
              Your payment information is processed through secure gateways and is never stored on our servers.
            </p>

            <h3>Sharing Your Information</h3>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties, 
              except for trusted third parties who assist us in operating our website and conducting our business, 
              so long as those parties agree to keep this information confidential.
            </p>

            <h3>Contact Us</h3>
            <p>
              If you have any questions regarding this Privacy Policy, you may contact us at 
              <strong> hello@sweetcake.lk</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

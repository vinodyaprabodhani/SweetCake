import React from 'react';
import './About.css';

const TermsOfService = () => {
  return (
    <div className="about-page page-enter">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <span className="hero-label-about">📜 Legal Agreement</span>
          <h1>Terms of Service</h1>
          <p>The rules and guidelines for using our services</p>
        </div>
      </div>

      <section className="section">
        <div className="container container-sm">
          <div className="text-content">
            <h2>Terms of Use</h2>
            <p>
              By accessing and using the Sweet Cake website, you agree to comply with and be bound by the following terms and conditions. 
              Please read them carefully before using our services.
            </p>

            <h3>Ordering and Payment</h3>
            <p>
              All orders placed through our website are subject to acceptance and availability. 
              Prices are listed in LKR and are subject to change. Payment must be made in full at the time of ordering 
              unless otherwise agreed upon for custom orders.
            </p>

            <h3>Custom Orders</h3>
            <p>
              Custom orders require a minimum of 48 hours notice. 
              Designs and specific requirements must be finalized at least 24 hours prior to the delivery/pickup date.
            </p>

            <h3>Intellectual Property</h3>
            <p>
              All content on this website, including text, graphics, logos, and images, is the property of Sweet Cake 
              and is protected by intellectual property laws.
            </p>

            <h3>Limitation of Liability</h3>
            <p>
              Sweet Cake shall not be liable for any indirect, incidental, or consequential damages resulting from the 
              use or inability to use our services or products.
            </p>

            <h3>Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the website 
              after changes are posted constitutes your acceptance of the new terms.
            </p>

            <h3>Governing Law</h3>
            <p>
              These terms are governed by and construed in accordance with the laws of Sri Lanka.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;

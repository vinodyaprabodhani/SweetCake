import React from 'react';
import './About.css';

const RefundPolicy = () => {
  return (
    <div className="about-page page-enter">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <span className="hero-label-about">🔄 Return & Refund</span>
          <h1>Refund Policy</h1>
          <p>Understanding our policies on returns and cancellations</p>
        </div>
      </div>

      <section className="section">
        <div className="container container-sm">
          <div className="text-content">
            <h2>Cancellation and Refund Policy</h2>
            <p>
              Due to the perishable nature of our products, Sweet Cake has specific policies regarding cancellations and refunds to ensure 
              the best quality for all our customers.
            </p>

            <h3>Order Cancellation</h3>
            <p>
              Standard orders can be cancelled up to 24 hours before the scheduled delivery/pickup time for a full refund. 
              Cancellations made less than 24 hours in advance will not be eligible for a refund.
            </p>

            <h3>Custom Order Cancellation</h3>
            <p>
              Cancellations for custom orders must be made at least 48 hours before the scheduled delivery/pickup time. 
              If a custom order is cancelled with less than 48 hours notice, we may retain the deposit or full payment to cover 
              the cost of ingredients and preparation.
            </p>

            <h3>Quality Issues</h3>
            <p>
              We take great pride in the quality of our cakes. If you are unsatisfied with the quality of your order, 
              please contact us within 4 hours of receipt. We will investigate the issue and may offer a partial or full refund, 
              or a replacement cake, at our discretion.
            </p>

            <h3>Non-Refundable Items</h3>
            <p>
              Delivery fees are generally non-refundable unless the delivery was delayed by more than 2 hours without prior notice.
            </p>

            <h3>Processing Refunds</h3>
            <p>
              Approved refunds will be processed within 5-7 business days via the original payment method. 
              For bank transfers, please provide your account details for the refund.
            </p>

            <h3>Contact Us</h3>
            <p>
              For any refund requests or questions, please reach out to our team at 
              <strong> hello@sweetcake.lk</strong> or call us at <strong>+94 11 234 5678</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;

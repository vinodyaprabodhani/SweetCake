import './SpecialOffers.css';

const SpecialOffers = () => {

  return (
    <div className="offers-page page-enter">
      <div className="offers-hero">
        <div className="offers-hero-overlay"></div>
        <div className="container offers-hero-content">
          <span className="hero-label-about">🎉 Limited Time</span>
          <h1>Special Offers</h1>
          <p>Don't miss out on these sweet deals!</p>
        </div>
      </div>

      {/* Promo Banner */}
      <section className="section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-text">
              <h2>🎊 Avurudu Special — 15% Off!</h2>
              <p>Celebrate the Sinhala & Tamil New Year with our exclusive festive collection. Use code <strong>AVURUDU15</strong> at checkout.</p>
            </div>
            <div className="promo-code-box">
              <span className="promo-code">AVURUDU15</span>
              <span className="promo-expires">Valid until April 30, 2026</span>
            </div>
          </div>
        </div>
      </section>


      {/* Extra offers */}
      <section className="section" style={{background:'var(--color-white)'}}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">More Savings</span>
            <h2 className="section-title">Bundle Deals & Perks</h2>
          </div>
          <div className="deals-grid">
            {[
              { icon:'🎂', title:'Birthday Club', desc:'Sign up and get 20% off your birthday cake every year! Free membership.', tag:'FREE' },
              { icon:'💍', title:'Wedding Package', desc:'Book a wedding cake consultation and get complimentary cupcakes for the bridal party.', tag:'BONUS' },
              { icon:'🚚', title:'Free Delivery', desc:'All orders above LKR 5,000 qualify for free island-wide delivery.', tag:'LKR 5K+' },
              { icon:'👨‍👩‍👧‍👦', title:'Family Pack', desc:'Order 3+ cakes and get 10% off your entire order. Perfect for celebrations!', tag:'10% OFF' },
            ].map((deal, i) => (
              <div key={i} className="deal-card">
                <span className="deal-tag">{deal.tag}</span>
                <span className="deal-icon">{deal.icon}</span>
                <h3>{deal.title}</h3>
                <p>{deal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialOffers;

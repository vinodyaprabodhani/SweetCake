import './About.css';

const About = () => {
  return (
    <div className="about-page page-enter">
      {/* Hero Banner */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">
          <span className="hero-label-about">Our Story</span>
          <h1>About Sweet Cake</h1>
          <p>Where Sri Lankan traditions meet modern artistry</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-image">
              <img src="/images/chef-about-us.jpg" alt="Our Chef" />
              <div className="about-experience-badge">
                <span className="exp-number">8+</span>
                <span className="exp-text">Years of Excellence</span>
              </div>
            </div>
            <div className="about-story-content">
              <span className="section-label">Our Journey</span>
              <h2 className="section-title" style={{textAlign: 'left'}}>A Sweet Beginning in the Pearl of the Indian Ocean</h2>
              <p>Founded in 2016 in the heart of Colombo, Sweet Cake began as a small home bakery with a big dream — to create the most beautiful and delicious cakes in Sri Lanka.</p>
              <p>What started as a passion project by our founder, has grown into one of Sri Lanka's most beloved bakeries. We blend the rich culinary heritage of our island with modern cake artistry to create edible masterpieces.</p>
              <p>Every cake that leaves our kitchen is a testament to our commitment to quality, creativity, and the joy of baking. We use only the finest ingredients — from premium New Zealand butter to the finest Ceylon cinnamon — because we believe your celebrations deserve nothing but the best.</p>
              <div className="about-values">
                <div className="value-item">
                  <span className="value-icon">🌿</span>
                  <div>
                    <h4>Fresh & Natural</h4>
                    <p>No preservatives, no artificial flavors</p>
                  </div>
                </div>
                <div className="value-item">
                  <span className="value-icon">🇱🇰</span>
                  <div>
                    <h4>Proudly Sri Lankan</h4>
                    <p>Supporting local farmers and producers</p>
                  </div>
                </div>
                <div className="value-item">
                  <span className="value-icon">♻️</span>
                  <div>
                    <h4>Eco-Friendly</h4>
                    <p>Sustainable packaging and practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section about-team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Team</span>
            <h2 className="section-title">Meet Our Master Bakers</h2>
          </div>
          <div className="team-grid">
            {[
              { name: 'Ayesha Wickramasinghe', role: 'Head Pastry Chef & Founder', emoji: '👩‍🍳' },
              { name: 'Chaminda Rajapaksa', role: 'Senior Cake Designer', emoji: '👨‍🍳' },
              { name: 'Nethmi Jayawardena', role: 'Custom Orders Specialist', emoji: '👩‍🎨' },
              { name: 'Roshan De Silva', role: 'Production Manager', emoji: '👨‍💼' },
            ].map((member, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{member.emoji}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section">
        <div className="container">
          <div className="milestones-grid">
            {[
              { number: '2000+', label: 'Happy Customers' },
              { number: '5000+', label: 'Cakes Delivered' },
              { number: '500+', label: 'Unique Designs' },
              { number: '15+', label: 'Awards Won' },
            ].map((m, i) => (
              <div key={i} className="milestone-card">
                <span className="milestone-number">{m.number}</span>
                <span className="milestone-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

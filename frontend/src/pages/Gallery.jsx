import { useState } from 'react';
import './Gallery.css';

const galleryImages = [
  { src: '/images/gallery/sri_lankan_themed_cake.png', caption: 'Premium Sri Lankan Floral' },
  { src: '/images/gallery/luxury_wedding_cake.png', caption: 'Imperial 5-Tier Wedding' },
  { src: '/images/gallery/rainbow_children_cake.png', caption: 'Whimsical Unicorn Magic' },
  { src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', caption: 'Chocolate Dream' },
  { src: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600', caption: 'Wedding Elegance' },
  { src: 'https://images.unsplash.com/photo-1557979619-445218f326b9?w=600', caption: 'Rainbow Birthday' },
  { src: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600', caption: 'Rose Cupcakes' },
  { src: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600', caption: 'Custom Fondant Art' },
  { src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600', caption: 'Tropical Fruit Cake' },
  { src: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600', caption: 'Dark Chocolate Truffle' },
  { src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600', caption: 'Rustic Wedding' },
  { src: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600', caption: 'Golden Anniversary' },
  { src: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600', caption: 'Red Velvet Cupcakes' },
  { src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', caption: 'Strawberry Garden' },
  { src: 'https://images.unsplash.com/photo-1519654793190-2e8a4806f1f2?w=600', caption: 'Gold Luxury Wedding' },
  { src: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600', caption: 'Hearts & Roses' },
  { src: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600', caption: 'Berry Cheesecake' },
  { src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600', caption: 'Mocha Coffee Cake' },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="gallery-page page-enter">
      <div className="gallery-hero">
        <div className="gallery-hero-overlay"></div>
        <div className="container gallery-hero-content">
          <span className="hero-label-about">📸 Our Creations</span>
          <h1>Cake Gallery</h1>
          <p>A visual feast of our finest creations</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="masonry-grid">
            {galleryImages.map((img, i) => (
              <div key={i} className={`gallery-item ${i % 5 === 0 ? 'tall' : ''} ${i % 7 === 0 ? 'wide' : ''}`}
                onClick={() => setLightbox(i)}>
                <img 
                  src={img.src.startsWith('/images/') ? `${import.meta.env.BASE_URL}${img.src.slice(1)}` : img.src} 
                  alt={img.caption} 
                  loading="lazy" 
                />
                <div className="gallery-item-overlay">
                  <span className="gallery-caption">{img.caption}</span>
                  <span className="gallery-zoom">🔍</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + galleryImages.length) % galleryImages.length); }}>‹</button>
          <img 
            src={galleryImages[lightbox].src.startsWith('/images/') 
              ? `${import.meta.env.BASE_URL}${galleryImages[lightbox].src.slice(1)}` 
              : galleryImages[lightbox].src.replace('w=600', 'w=1200')
            } 
            alt={galleryImages[lightbox].caption} 
          />
          <p className="lightbox-caption">{galleryImages[lightbox].caption}</p>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % galleryImages.length); }}>›</button>
        </div>
      )}
    </div>
  );
};

export default Gallery;

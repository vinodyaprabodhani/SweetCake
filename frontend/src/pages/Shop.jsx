import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import CakeCard from '../components/CakeCard';
import './Shop.css';

const Shop = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const observerRef = useRef();

  // Intersection Observer for scroll animations
  useEffect(() => {
    const timer = setTimeout(() => {
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '50px' }
      );

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('visible');
        } else {
          observerRef.current.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [products]);

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 12, page: searchParams.get('page') || 1 };
        if (category) params.category = category;
        if (search) params.search = search;
        if (sort) params.sort = sort;
        if (priceRange) {
          const [min, max] = priceRange.split('-');
          if (min) params.min_price = min;
          if (max) params.max_price = max;
        }
        const { data } = await productAPI.getAll(params);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, searchParams, sort, priceRange]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
  };

  const currentCategory = categories.find(c => c.slug === category);

  return (
    <div className="shop-page page-enter">
      {/* Header */}
      <section className="shop-hero">
        <div className="shop-hero-overlay"></div>
        <div className="container shop-hero-content">
          <span className="hero-label-about">🍰 Our Collection</span>
          <h1>{currentCategory ? currentCategory.name : 'All Cakes'}</h1>
          <p>{currentCategory ? currentCategory.description : 'Explore our complete collection of handcrafted cakes'}</p>
        </div>
      </section>

      <section className="section shop-content">
        <div className="container">
          <div className="shop-layout">
            {/* Sidebar Filters */}
            <aside className="shop-sidebar">
              {/* Search */}
              <div className="filter-group">
                <h4 className="filter-title">Search</h4>
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    placeholder="Search cakes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">🔍</button>
                </form>
              </div>

              {/* Categories */}
              <div className="filter-group">
                <h4 className="filter-title">Categories</h4>
                <ul className="category-filter-list">
                  <li>
                    <a href="/shop" className={!category ? 'active' : ''}>
                      <div className="cat-link-content">
                        <div className="cat-sidebar-img all-cakes-img">🍰</div>
                        <span>All Cakes</span>
                      </div>
                    </a>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <a href={`/shop/${cat.slug}`} className={category === cat.slug ? 'active' : ''}>
                        <div className="cat-link-content">
                          <img src={cat.image} alt={cat.name} className="cat-sidebar-img" loading="lazy" />
                          <span>{cat.name}</span>
                        </div>
                        <span className="cat-count">{cat.product_count}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <h4 className="filter-title">Price Range</h4>
                <ul className="price-filter-list">
                  {[
                    { label: 'All Prices', value: '' },
                    { label: 'Under LKR 2,000', value: '0-2000' },
                    { label: 'LKR 2,000 - 5,000', value: '2000-5000' },
                    { label: 'LKR 5,000 - 10,000', value: '5000-10000' },
                    { label: 'LKR 10,000 - 25,000', value: '10000-25000' },
                    { label: 'Above LKR 25,000', value: '25000-' },
                  ].map(option => (
                    <li key={option.value}>
                      <button
                        className={priceRange === option.value ? 'active' : ''}
                        onClick={() => setPriceRange(option.value)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Products */}
            <div className="shop-products">
              {/* Toolbar */}
              <div className="shop-toolbar">
                <span className="product-count">
                  {pagination.total || 0} cakes found
                </span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                  <option value="">Sort By: Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="loading-page">
                  <div className="spinner"></div>
                  <p>Loading delicious cakes...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="no-products">
                  <span style={{fontSize: '4rem'}}>🍰</span>
                  <h3>No cakes found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="shop-grid">
                  {products.map((product, index) => (
                    <CakeCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-btn ${page === pagination.page ? 'active' : ''}`}
                      onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page })}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

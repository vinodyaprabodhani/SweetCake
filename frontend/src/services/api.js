import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sweetcake_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getById: (id) => api.get(`/products/id/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Cart APIs
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  updateItem: (id, data) => api.put(`/cart/item/${id}`, data),
  removeItem: (id) => api.delete(`/cart/item/${id}`),
  clear: () => api.delete('/cart/clear'),
};

// Order APIs
export const orderAPI = {
  place: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders/all', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Custom Order APIs
export const customOrderAPI = {
  submit: (data) => api.post('/custom-orders', data),
  getMyOrders: () => api.get('/custom-orders/my-orders'),
  getAll: () => api.get('/custom-orders/all'),
  update: (id, data) => api.put(`/custom-orders/${id}`, data),
};

// Review APIs
export const reviewAPI = {
  getForProduct: (productId) => api.get(`/reviews/product/${productId}`),
  add: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Contact APIs
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.put(`/contact/${id}/read`),
  reply: (id, data) => api.put(`/contact/${id}/reply`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;

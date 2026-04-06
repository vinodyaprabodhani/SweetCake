# 🍰 Sweet Cake — Premium Sri Lankan Bakery

A full-stack e-commerce website for a modern Sri Lankan cake business. Built with React, Node.js, Express, and MySQL.

![Sweet Cake](https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800)

## ✨ Features

### 🎯 Frontend (React + Vite)
- **13 Premium Pages**: Home, About, Shop, Product Detail, Custom Orders, Special Offers, Gallery, Contact, Login, Register, Cart, Checkout, My Orders, Admin Dashboard
- **Premium UI/UX**: Glassmorphism, 3D card effects, smooth animations, parallax scrolling
- **Sri Lankan Identity**: Colors, fonts, and content reflecting Sri Lankan culture
- **Fully Responsive**: Desktop, tablet, and mobile friendly
- **Interactive Elements**: Floating animations, hover effects, scroll animations

### 🔧 Backend (Node.js + Express)
- JWT Authentication (Login/Register)
- RESTful API with proper error handling
- Admin-protected routes
- Product management with search, filter, pagination
- Cart management
- Order placement and tracking
- Custom cake order system
- Contact form with admin reply

### 🗄️ Database (MySQL)
- 10+ relational tables
- 30 sample cakes with LKR prices
- 8 categories
- Sample users and reviews

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **XAMPP** (MySQL running on port 3306)

### 1. Setup Database
Make sure MySQL is running in XAMPP, then:
```bash
# Import database
mysql -u root < database/schema.sql
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:5000

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## 📁 Project Structure
```
sweetcake/
├── database/
│   └── schema.sql            # MySQL schema + seed data
├── backend/
│   ├── config/db.js          # Database connection
│   ├── middleware/auth.js     # JWT authentication
│   ├── controllers/          # Business logic
│   ├── routes/               # API endpoints
│   ├── server.js             # Express server
│   └── .env                  # Environment config
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, CakeCard
│   │   ├── pages/            # All 13 pages
│   │   ├── context/          # Auth & Cart state
│   │   ├── services/         # API layer
│   │   └── styles/           # Design system
│   └── index.html
└── README.md
```

## 🔑 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sweetcake.lk | admin123 |
| Customer | kavinda@gmail.com | customer123 |

## 🎨 Design System
- **Fonts**: Playfair Display (headings), Poppins (body), Dancing Script (accents)
- **Colors**: Cream (#FFF8F0), Rose Pink (#E8848E), Gold (#D4A574), Chocolate (#4A2C2A)
- **Effects**: Glassmorphism, 3D hover transforms, scroll animations

## 📱 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/products | Get products (with filters) |
| GET | /api/products/:slug | Get single product |
| GET | /api/categories | Get all categories |
| POST | /api/cart/add | Add to cart |
| POST | /api/orders | Place order |
| POST | /api/custom-orders | Submit custom order |
| POST | /api/contact | Submit contact message |
| GET | /api/admin/dashboard | Admin analytics |

## 🇱🇰 Sri Lankan Touch
- Prices in Sri Lankan Rupees (LKR)
- Delivery areas across Sri Lanka
- Traditional cakes like Bibikkan, Love Cake, Watalappan Fusion
- Avurudu (New Year) special offers
- Local phone numbers and addresses

---
Made with 💝 in Sri Lanka

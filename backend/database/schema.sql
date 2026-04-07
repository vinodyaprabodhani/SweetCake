-- ============================================
-- Sweet Cake - MySQL Database Schema
-- Sri Lankan Premium Bakery E-Commerce
-- ============================================

-- --------------------------------------------

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    category_id INT,
    image VARCHAR(500),
    images JSON,
    ingredients TEXT,
    weight VARCHAR(50),
    serves VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    stock INT DEFAULT 100,
    rating DECIMAL(2, 1) DEFAULT 0,
    review_count INT DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================
-- Cart Table
-- ============================================
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Cart Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- Orders Table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'processing', 'baking', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cod', 'card', 'bank_transfer') DEFAULT 'cod',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    notes TEXT,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Order Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- Custom Orders Table
-- ============================================
CREATE TABLE IF NOT EXISTS custom_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    cake_type VARCHAR(100) NOT NULL,
    cake_size VARCHAR(50),
    cake_flavor VARCHAR(100),
    cake_layers INT DEFAULT 1,
    decoration_details TEXT,
    message_on_cake VARCHAR(255),
    delivery_date DATE NOT NULL,
    delivery_address TEXT,
    budget_range VARCHAR(50),
    reference_image VARCHAR(500),
    additional_notes TEXT,
    status ENUM('pending', 'reviewed', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    quoted_price DECIMAL(10, 2),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- Reviews Table
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- Contact Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    admin_reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_bestseller ON products(is_bestseller);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- ============================================
-- SEED DATA
-- ============================================

-- Admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('Admin', 'Sweet Cake', 'admin@sweetcake.lk', '$2b$10$8Kx5z5z5z5z5z5z5z5z5zOQZ5z5z5z5z5z5z5z5z5z5z5z5z5z5', '+94 77 123 4567', 'admin');

-- Sample customer (password: customer123)
INSERT INTO users (first_name, last_name, email, password, phone, address, city, role) VALUES
('Kavinda', 'Perera', 'kavinda@gmail.com', '$2b$10$8Kx5z5z5z5z5z5z5z5z5zOQZ5z5z5z5z5z5z5z5z5z5z5z5z5z5', '+94 71 234 5678', '42 Galle Road', 'Colombo', 'customer'),
('Sachini', 'Fernando', 'sachini@gmail.com', '$2b$10$8Kx5z5z5z5z5z5z5z5z5zOQZ5z5z5z5z5z5z5z5z5z5z5z5z5z5', '+94 76 345 6789', '15 Temple Lane', 'Kandy', 'customer');

-- Categories
INSERT INTO categories (name, slug, description, image, display_order) VALUES
('Birthday Cakes', 'birthday-cakes', 'Make every birthday magical with our beautifully crafted cakes, designed to bring joy and sweetness to your special day.', 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600', 1),
('Wedding Cakes', 'wedding-cakes', 'Elegant multi-tiered wedding cakes crafted with love for your dream celebration. Each cake is a masterpiece.', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600', 2),
('Cupcakes', 'cupcakes', 'Delightful mini treats perfect for any occasion. Our cupcakes are baked fresh daily with premium ingredients.', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600', 3),
('Anniversary Cakes', 'anniversary-cakes', 'Celebrate your love story with our romantic anniversary cakes, beautifully decorated and delicious.', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600', 4),
('Sri Lankan Special', 'sri-lankan-special', 'Traditional Sri Lankan sweet treats with a modern twist. Taste the authentic flavors of our island paradise.', 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600', 5),
('Chocolate Cakes', 'chocolate-cakes', 'Rich, decadent chocolate cakes for true chocolate lovers. Made with the finest Belgian chocolate.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', 6),
('Fruit Cakes', 'fruit-cakes', 'Fresh fruit cakes bursting with natural flavors. Light, refreshing, and beautifully decorated.', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600', 7),
('Custom Cakes', 'custom-cakes', 'Your imagination, our creation. Order a fully customized cake designed just for you.', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600', 8);

-- Products (30 sample cakes with LKR prices)
INSERT INTO products (name, slug, description, short_description, price, sale_price, category_id, image, ingredients, weight, serves, is_featured, is_bestseller, rating, review_count, tags) VALUES

-- Birthday Cakes
('Rainbow Dream Birthday Cake', 'rainbow-dream-birthday-cake',
'A spectacular multi-layered rainbow cake with vibrant colors and smooth vanilla buttercream. Each layer is a different color, creating a stunning visual effect when sliced. Perfect for making any birthday celebration truly magical and memorable.',
'Vibrant multi-layered rainbow cake with vanilla buttercream',
4500.00, NULL, 1,
'https://images.unsplash.com/photo-1557979619-445218f326b9?w=600',
'Flour, Sugar, Butter, Eggs, Vanilla, Food coloring, Buttercream frosting',
'1.5 kg', '12-15 people', TRUE, TRUE, 4.8, 24,
'["birthday", "colorful", "kids", "vanilla"]'),

('Golden Unicorn Cake', 'golden-unicorn-cake',
'A magical unicorn-themed cake adorned with golden horn, pastel colors, and edible flowers. This enchanting cake features layers of moist vanilla sponge filled with strawberry cream, covered in smooth fondant with hand-crafted unicorn details.',
'Magical unicorn cake with golden accents',
5500.00, 4800.00, 1,
'/images/golden-unicorn-cake.jpg',
'Vanilla sponge, Strawberry cream, Fondant, Edible gold, Sugar flowers',
'2 kg', '15-20 people', TRUE, FALSE, 4.9, 18,
'["birthday", "unicorn", "kids", "fantasy"]'),

('Classic Chocolate Birthday', 'classic-chocolate-birthday',
'A timeless chocolate birthday cake with rich cocoa layers and smooth chocolate ganache. Decorated with chocolate curls and a birthday message of your choice.',
'Rich chocolate cake with ganache topping',
3800.00, NULL, 1,
'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
'Dark chocolate, Cocoa powder, Butter, Eggs, Cream, Sugar',
'1.5 kg', '12-15 people', FALSE, TRUE, 4.7, 32,
'["birthday", "chocolate", "classic"]'),

-- Wedding Cakes
('Elegant White Rose Wedding Cake', 'elegant-white-rose-wedding',
'A breathtaking 3-tier white wedding cake adorned with delicate sugar roses and pearl accents. Each tier features different flavors - vanilla, lemon, and almond - covered in smooth white fondant with hand-crafted rose details.',
'Stunning 3-tier white wedding cake with sugar roses',
28000.00, NULL, 2,
'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600',
'Vanilla sponge, Lemon cake, Almond cake, Fondant, Sugar roses, Pearl dragees',
'8 kg', '80-100 people', TRUE, TRUE, 5.0, 15,
'["wedding", "elegant", "white", "roses"]'),

('Gold & Ivory Luxury Wedding', 'gold-ivory-luxury-wedding',
'An opulent 4-tier wedding cake featuring ivory fondant with hand-painted gold leaf details. This showstopper cake combines rich chocolate and vanilla layers with Swiss meringue buttercream.',
'Luxurious 4-tier ivory wedding cake with gold leaf',
45000.00, NULL, 2,
'https://images.unsplash.com/photo-1519654793190-2e8a4806f1f2?w=600',
'Chocolate cake, Vanilla cake, Swiss meringue, Gold leaf, Fondant, Ivory coloring',
'12 kg', '120-150 people', TRUE, FALSE, 4.9, 8,
'["wedding", "luxury", "gold", "premium"]'),

('Rustic Naked Wedding Cake', 'rustic-naked-wedding-cake',
'A charming semi-naked wedding cake with exposed layers, fresh berries, and eucalyptus garnish. This rustic beauty features layers of vanilla sponge with lemon curd and cream cheese frosting.',
'Semi-naked rustic cake with fresh berries',
22000.00, 19500.00, 2,
'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600',
'Vanilla sponge, Lemon curd, Cream cheese, Fresh berries, Eucalyptus',
'6 kg', '60-80 people', FALSE, TRUE, 4.8, 21,
'["wedding", "rustic", "naked", "berries"]'),

-- Cupcakes
('Vanilla Rose Cupcakes (Box of 12)', 'vanilla-rose-cupcakes',
'A beautiful box of 12 vanilla cupcakes topped with delicate rose-swirl buttercream in pastel pink. Each cupcake is topped with an edible rose petal.',
'Elegant vanilla cupcakes with rose buttercream',
2800.00, NULL, 3,
'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600',
'Flour, Sugar, Butter, Vanilla, Rose water, Pink food coloring',
'1 kg', '12 cupcakes', TRUE, TRUE, 4.6, 28,
'["cupcakes", "vanilla", "rose", "pink"]'),

('Red Velvet Cupcakes (Box of 6)', 'red-velvet-cupcakes',
'Six luxurious red velvet cupcakes with cream cheese frosting and red velvet crumble topping. Rich, moist, and absolutely irresistible.',
'Rich red velvet with cream cheese frosting',
1800.00, 1500.00, 3,
'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600',
'Red velvet mix, Cream cheese, Butter, Cocoa, Red food coloring',
'500g', '6 cupcakes', FALSE, TRUE, 4.7, 35,
'["cupcakes", "red velvet", "cream cheese"]'),

('Chocolate Truffle Cupcakes (Box of 12)', 'chocolate-truffle-cupcakes',
'A dozen rich chocolate cupcakes with Belgian chocolate ganache and a truffle on top. For the ultimate chocolate experience.',
'Decadent chocolate cupcakes with truffle topping',
3200.00, NULL, 3,
'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600',
'Belgian chocolate, Cocoa, Butter, Heavy cream, Chocolate truffles',
'1.2 kg', '12 cupcakes', FALSE, FALSE, 4.5, 19,
'["cupcakes", "chocolate", "truffle", "premium"]'),

-- Anniversary Cakes
('Hearts & Roses Anniversary Cake', 'hearts-roses-anniversary',
'A romantic two-tier cake decorated with hand-piped roses, fondant hearts, and edible gold accents. Available in red velvet with cream cheese or vanilla with strawberry.',
'Romantic 2-tier cake with roses and hearts',
8500.00, NULL, 4,
'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600',
'Red velvet/Vanilla sponge, Cream cheese/Strawberry filling, Fondant, Edible gold',
'3 kg', '25-30 people', TRUE, TRUE, 4.9, 16,
'["anniversary", "romantic", "hearts", "roses"]'),

('Golden Anniversary Cake', 'golden-anniversary-cake',
'Celebrate 50 golden years with this stunning gold-themed cake. Features smooth champagne-flavored sponge with gold fondant and elegant detailing.',
'Champagne-flavored cake with gold theme',
12000.00, NULL, 4,
'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600',
'Champagne, Vanilla sponge, Gold fondant, Edible gold leaf, White chocolate',
'4 kg', '35-40 people', FALSE, FALSE, 4.8, 9,
'["anniversary", "gold", "champagne", "50th"]'),

-- Sri Lankan Special
('Traditional Bibikkan', 'traditional-bibikkan',
'A rich and aromatic traditional Sri Lankan coconut cake made with treacle, semolina, cashews, and exotic spices. A beloved treat from our island heritage, perfect with a cup of Ceylon tea.',
'Traditional Sri Lankan coconut cake with treacle',
1800.00, NULL, 5,
'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600',
'Coconut, Treacle, Semolina, Cashews, Cardamom, Nutmeg, Cloves',
'1 kg', '10-12 people', TRUE, TRUE, 4.7, 42,
'["sri lankan", "traditional", "coconut", "treacle"]'),

('Watalappan Cake Fusion', 'watalappan-cake-fusion',
'A modern cake inspired by the beloved Sri Lankan Watalappan pudding. Layers of spiced jaggery sponge with coconut cream and cardamom buttercream.',
'Modern cake with Watalappan-inspired flavors',
3500.00, 2900.00, 5,
'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600',
'Jaggery, Coconut milk, Cardamom, Eggs, Cashews, Nutmeg',
'1.5 kg', '12-15 people', TRUE, FALSE, 4.6, 27,
'["sri lankan", "watalappan", "fusion", "jaggery"]'),

('Love Cake (Bolo de Amor)', 'love-cake-bolo-de-amor',
'The iconic Sri Lankan Love Cake with its distinctive semolina base, cashew nuts, honey, and aromatic spices. A Burgher heritage recipe passed down through generations.',
'Classic Sri Lankan Love Cake with cashews and honey',
2500.00, NULL, 5,
'https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=600',
'Semolina, Cashews, Honey, Rose water, Lime zest, Cinnamon, Cardamom',
'1 kg', '10-12 people', FALSE, TRUE, 4.9, 38,
'["sri lankan", "love cake", "traditional", "cashew"]'),

('Kokis & Cake Platter', 'kokis-cake-platter',
'A festive platter combining traditional Sri Lankan kokis (crispy oil cakes) with modern mini cakes. Perfect for Avurudu celebrations and family gatherings.',
'Festive platter with kokis and mini cakes',
4200.00, NULL, 5,
'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600',
'Rice flour, Coconut milk, Eggs, Turmeric, Mini cake assortment',
'2 kg', '15-20 people', FALSE, FALSE, 4.5, 15,
'["sri lankan", "avurudu", "kokis", "festive"]'),

-- Chocolate Cakes
('Belgian Dark Chocolate Truffle', 'belgian-dark-chocolate-truffle',
'An intensely rich dark chocolate cake made with 70% Belgian chocolate. Features layers of dark chocolate ganache, chocolate mousse, and a mirror glaze finish.',
'Intense dark chocolate cake with mirror glaze',
5200.00, NULL, 6,
'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600',
'Belgian dark chocolate 70%, Cocoa, Heavy cream, Eggs, Butter, Mirror glaze',
'1.5 kg', '12-15 people', TRUE, TRUE, 4.9, 44,
'["chocolate", "belgian", "dark", "truffle"]'),

('Death by Chocolate', 'death-by-chocolate',
'For the ultimate chocolate lover. Triple chocolate layers with chocolate chips, chocolate fudge sauce, and topped with chocolate shavings and berries.',
'Triple chocolate indulgence cake',
4800.00, 4200.00, 6,
'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
'Dark chocolate, Milk chocolate, White chocolate, Chocolate chips, Fudge sauce',
'2 kg', '15-20 people', FALSE, TRUE, 4.8, 37,
'["chocolate", "fudge", "triple", "indulgent"]'),

('White Chocolate Raspberry', 'white-chocolate-raspberry',
'Elegant white chocolate cake with layers of raspberry compote and white chocolate ganache. A perfect balance of sweet and tart.',
'White chocolate cake with raspberry filling',
4500.00, NULL, 6,
'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600',
'White chocolate, Raspberries, Cream, Vanilla, Butter, Sugar',
'1.5 kg', '12-15 people', FALSE, FALSE, 4.6, 22,
'["chocolate", "white chocolate", "raspberry", "elegant"]'),

-- Fruit Cakes
('Tropical Mango Passion Cake', 'tropical-mango-passion',
'A tropical delight featuring layers of mango sponge with passion fruit curd and coconut cream. Topped with fresh mango slices and toasted coconut.',
'Tropical mango cake with passion fruit curd',
4200.00, NULL, 7,
'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600',
'Mango puree, Passion fruit, Coconut cream, Sponge cake, Fresh mango',
'1.5 kg', '12-15 people', TRUE, FALSE, 4.7, 19,
'["fruit", "mango", "tropical", "passion fruit"]'),

('Fresh Strawberry Garden Cake', 'fresh-strawberry-garden',
'A light and airy vanilla sponge cake layered with fresh strawberries, whipped cream, and strawberry jelly. Decorated with whole strawberries and mint leaves.',
'Light vanilla cake with fresh strawberries',
3800.00, 3200.00, 7,
'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
'Vanilla sponge, Fresh strawberries, Whipped cream, Strawberry jelly, Mint',
'1.5 kg', '12-15 people', FALSE, TRUE, 4.8, 29,
'["fruit", "strawberry", "fresh", "light"]'),

('Mixed Berry Cheesecake', 'mixed-berry-cheesecake',
'A creamy New York-style cheesecake topped with a generous mixed berry compote. Features blueberries, raspberries, and blackberries on a buttery biscuit base.',
'Creamy cheesecake with mixed berry compote',
4000.00, NULL, 7,
'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600',
'Cream cheese, Digestive biscuits, Mixed berries, Sugar, Eggs, Vanilla',
'1.2 kg', '10-12 people', TRUE, TRUE, 4.9, 33,
'["fruit", "cheesecake", "berries", "creamy"]'),

('Lemon Drizzle Delight', 'lemon-drizzle-delight',
'A zesty lemon cake with a tangy lemon drizzle, lemon curd filling, and lemon buttercream. Finished with candied lemon slices.',
'Tangy lemon cake with lemon drizzle',
3200.00, NULL, 7,
'/images/lemon-drizzle-delight.jpg',
'Lemons, Butter, Sugar, Eggs, Flour, Lemon curd, Buttercream',
'1 kg', '8-10 people', FALSE, FALSE, 4.5, 14,
'["fruit", "lemon", "tangy", "drizzle"]'),

-- Custom Cakes category samples
('Fondant Art Masterpiece', 'fondant-art-masterpiece',
'Commission a fully custom fondant cake designed to your exact specifications. Our master cake artists will create a one-of-a-kind edible masterpiece for your event.',
'Fully custom fondant cake to your design',
15000.00, NULL, 8,
'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600',
'Custom ingredients based on design, Premium fondant, Edible colors',
'Custom', 'Custom', TRUE, FALSE, 5.0, 11,
'["custom", "fondant", "art", "premium"]'),

('Photo Print Cake', 'photo-print-cake',
'Have any photo printed on a delicious cake with edible ink. Choose your base flavor and size, and we will print your favorite photo right on top!',
'Cake with edible photo printing',
3800.00, NULL, 8,
'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600',
'Vanilla/Chocolate sponge, Edible ink, Edible paper, Buttercream',
'1.5 kg', '12-15 people', FALSE, TRUE, 4.6, 26,
'["custom", "photo", "personalized"]'),

-- Additional popular items
('Butter Cake Premium', 'butter-cake-premium',
'Our signature Sri Lankan-style butter cake, rich and moist. Made with the finest New Zealand butter and free-range eggs. A timeless classic.',
'Classic Sri Lankan butter cake',
2200.00, NULL, 5,
'https://images.unsplash.com/photo-1621955511667-e2c316e4575d?w=600',
'NZ Butter, Free-range eggs, Vanilla, Sugar, Flour, Baking powder',
'1 kg', '8-10 people', FALSE, TRUE, 4.8, 55,
'["sri lankan", "butter cake", "classic", "traditional"]'),

('Mocha Coffee Cake', 'mocha-coffee-cake',
'A sophisticated coffee-chocolate fusion cake made with premium Ceylon coffee. Features layers of coffee sponge, chocolate ganache, and coffee buttercream.',
'Ceylon coffee-chocolate fusion cake',
4000.00, NULL, 6,
'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600',
'Ceylon coffee, Dark chocolate, Cocoa, Coffee liqueur, Buttercream',
'1.5 kg', '12-15 people', TRUE, FALSE, 4.7, 20,
'["coffee", "mocha", "chocolate", "ceylon"]'),

('Tres Leches Tropical', 'tres-leches-tropical',
'A Sri Lankan twist on the classic tres leches, soaked in coconut milk, condensed milk, and evaporated milk, topped with tropical fruits.',
'Tropical tres leches with coconut milk',
3600.00, 3000.00, 5,
'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600',
'Coconut milk, Condensed milk, Evaporated milk, Sponge cake, Tropical fruits',
'1.5 kg', '12-15 people', FALSE, FALSE, 4.6, 17,
'["sri lankan", "tres leches", "tropical", "coconut"]'),

('Mini Cupcake Tower (24 pieces)', 'mini-cupcake-tower',
'An impressive tower of 24 mini cupcakes in assorted flavors - vanilla, chocolate, red velvet, and lemon. Perfect for parties and events.',
'Tower of 24 assorted mini cupcakes',
4500.00, 3900.00, 3,
'https://images.unsplash.com/photo-1519869325930-281384f7f025?w=600',
'Assorted flavors, Buttercream, Fondant decorations, Sprinkles',
'1.5 kg', '24 mini cupcakes', FALSE, FALSE, 4.5, 12,
'["cupcakes", "mini", "assorted", "tower"]'),

('Cinnamon Swirl Cake', 'cinnamon-swirl-cake',
'A warm, comforting cake with Ceylon cinnamon swirls throughout. Features a cream cheese frosting with a caramel cinnamon drizzle.',
'Ceylon cinnamon swirl cake with cream cheese',
3400.00, NULL, 5,
'https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=600',
'Ceylon cinnamon, Cream cheese, Brown sugar, Butter, Caramel',
'1 kg', '8-10 people', FALSE, FALSE, 4.7, 23,
'["sri lankan", "cinnamon", "ceylon", "swirl"]');

-- Sample reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Absolutely stunning cake! The colors were vibrant and the taste was divine. My daughter loved it for her birthday! Will definitely order again.'),
(3, 1, 5, 'Best birthday cake we have ever ordered. The rainbow layers were so beautiful and the vanilla flavor was perfect.'),
(2, 4, 5, 'Our wedding cake was a dream come true! The roses were so realistic and each tier had a wonderful flavor. Thank you Sweet Cake!'),
(3, 7, 4, 'Beautiful cupcakes with the perfect rose swirl. The rose water flavor is subtle and elegant. Great for our tea party.'),
(2, 12, 5, 'The Bibikkan was authentic and delicious. Reminded me of my grandmother''s recipe. True Sri Lankan flavors!'),
(3, 13, 5, 'The Watalappan Cake Fusion is genius! Traditional flavors in a modern cake format. Absolutely loved it.'),
(2, 17, 5, 'The Belgian Dark Chocolate Truffle is the best chocolate cake I have ever had. The mirror glaze was stunning!'),
(3, 21, 5, 'Tropical Mango Passion Cake was perfect for our summer party. Fresh, light, and incredibly delicious.');

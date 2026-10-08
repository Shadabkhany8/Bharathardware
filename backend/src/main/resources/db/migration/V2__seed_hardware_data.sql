-- Seed Wholesale Hardware Categories
INSERT INTO categories (id, name, description, image_url, active) VALUES
(1, 'Abrasive Sponges & Blocks', 'Industrial grade flexible sanding and abrasive sponge blocks for wood, metal, and drywall.', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop', TRUE),
(2, 'Polishing & Buffing Pads', 'High density foam buffing pads and compounding sponges for automotive and metal finishing.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop', TRUE),
(3, 'Industrial Scouring Pads', 'Heavy-duty nylon mesh scouring pads for industrial machinery cleaning, rust prep, and degreasing.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop', TRUE),
(4, 'Metal & Rust Prep Sponges', 'Silicon carbide abrasive sponges designed for weld blending, rust removal, and contour sanding.', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop', TRUE),
(5, 'Hardware & Finishing Accessories', 'Specialty sponge holders, interface backing pads, and bulk wholesale rolls.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop', TRUE);

-- Seed Wholesale Hardware Products
INSERT INTO products (id, category_id, sku, name, description, image_url, unit, wholesale_price, minimum_order_quantity, stock_quantity, active) VALUES
(1, 1, 'BS-SP-101', 'Bharat SuperGrit Sanding Sponge (Medium 120)', 'Four-sided abrasive foam sponge for profiled woodwork and metal surfaces. Washable and reusable.', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop', 'Box of 24', 480.00, 5, 250, TRUE),
(2, 1, 'BS-SP-102', 'Bharat UltraFine Flexible Foam Pad (Grit 320)', 'High-flexibility thin foam abrasive pad ideal for curved auto body panels and primer scuffing.', 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop', 'Box of 50', 850.00, 3, 180, TRUE),
(3, 1, 'BS-SP-103', 'Bharat Dual-Density Sanding Block (Coarse 60)', 'Rigid dense core with coarse aluminum oxide coating for rapid material removal on hardwoods and iron.', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop', 'Pack of 12', 360.00, 10, 400, TRUE),
(4, 2, 'BS-POL-201', 'ProBuff Waffle Foam Polishing Pad (6-Inch)', 'Precision cut waffle face prevents swirl marks and distributes cutting compound evenly across panels.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop', 'Pack of 5', 650.00, 4, 120, TRUE),
(5, 2, 'BS-POL-202', 'Microfiber Finishing Sponge Applicator', 'Dense polyurethane sponge wrapped in scratch-free microfiber for ceramic coatings and sealant wax.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop', 'Pack of 10', 420.00, 8, 300, TRUE),
(6, 3, 'BS-IND-301', 'Heavy Duty Industrial Green Scourer (Extra Coarse)', 'Industrial web scouring pad for commercial equipment, foundry cleaning, and heavy rust preparation.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop', 'Carton of 60', 1200.00, 2, 85, TRUE),
(7, 3, 'BS-IND-302', 'Non-Scratch Blue Industrial Degreasing Sponge', 'Tough cellulose core combined with non-woven scrubbing surface for factory maintenance and tooling.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop', 'Carton of 48', 960.00, 3, 140, TRUE),
(8, 4, 'BS-RST-401', 'Diamond Hand Polishing Sponge (Grit 200)', 'Electroplated diamond abrasive surface on ergonomic EVA foam base. Cuts through granite, glass, and hardened steel.', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop', 'Piece', 290.00, 10, 320, TRUE),
(9, 4, 'BS-RST-402', 'Silicon Carbide Contoured Rust Stripper Block', 'Beveled edge sanding sponge engineered to access grooves, welded seams, and pipe perimeters.', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop', 'Box of 20', 580.00, 5, 210, TRUE),
(10, 5, 'BS-ACC-501', 'Hook & Loop Sponge Interface Cushion Pad (5-Inch)', 'Soft density foam interface pad to minimize burn-through on orbital disc sanders.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop', 'Pack of 4', 380.00, 5, 160, TRUE),
(11, 5, 'BS-ACC-502', 'Continuous Abrasive Foam Roll (115mm x 25M, Grit 180)', 'Perforated sponge roll in dispensing box. Tear off exact length needed for workshops and fabrication lines.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop', 'Roll', 1450.00, 2, 75, TRUE);

-- Seed Default Wholesale Customer & Admin (Password: Password@123)
-- BCrypt for 'Password@123' -> $2a$10$Kq2o2E8oP2Y9vW9aE0P2uO8q8XfW1f4k5c6d7e8f9a0b1c2d3e4f5
INSERT INTO customers (id, customer_code, name, business_name, phone, email, password_hash, address, city, state, pincode, role, active) VALUES
(1, 'CUST-BS-1001', 'Rajesh Sharma', 'Sharma Hardware & Tools Mart', '9876543210', 'customer@bharatsponge.com', '$2a$10$w8m8zU5c1GgN2q/g7mDqOe6wA6N.rW11Z6Z8M2f0B4q0QzK5b2y2W', 'Shop No. 42, Iron & Hardware Market, G.T. Road', 'Kanpur', 'Uttar Pradesh', '208001', 'ROLE_CUSTOMER', TRUE),
(2, 'ADMIN-BS-0001', 'Vikram Patel', 'Bharat Sponge Enterprises Admin', '9876500000', 'admin@bharatsponge.com', '$2a$10$w8m8zU5c1GgN2q/g7mDqOe6wA6N.rW11Z6Z8M2f0B4q0QzK5b2y2W', 'Headquarters, Industrial Area Phase II', 'Faridabad', 'Haryana', '121004', 'ROLE_ADMIN', TRUE);

-- Advance Identity Sequences past seed rows
ALTER TABLE customers ALTER COLUMN id RESTART WITH 10;
ALTER TABLE categories ALTER COLUMN id RESTART WITH 10;
ALTER TABLE products ALTER COLUMN id RESTART WITH 30;


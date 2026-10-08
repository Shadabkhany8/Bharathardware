/**
 * BHARAT SPONGE — B2B Wholesale Website Application Logic
 * Factory Hub: Sanwer Road Industrial Area, Indore, MP
 * Owner / WhatsApp: Shadab Khan (+91 83052 88431)
 */

// ============================================================================
// Catalog Data (Synchronized with Bharat Sponge Backend & Seed Data)
// ============================================================================
const CONFIG = {
  appName: 'Bharat Sponge',
  hub: 'Sanwer Road Industrial Area, Indore, MP',
  ownerName: 'Shadab Khan',
  ownerPhone: '8305288431',
  supportPhone: '+91 83052 88431',
  whatsappNumber: '918305288431',
  outsideIndoreSurcharge: 250,
  localIndoreSurcharge: 0,
};

const CATEGORIES = [
  { id: 1, name: 'Abrasive Sponges & Blocks', icon: '🟫' },
  { id: 2, name: 'Polishing & Buffing Pads', icon: '🟡' },
  { id: 3, name: 'Industrial Scouring Pads', icon: '🟩' },
  { id: 4, name: 'Metal & Rust Prep Sponges', icon: '⬛' },
  { id: 5, name: 'Hardware & Finishing Accessories', icon: '🔧' },
];

const PRODUCTS = [
  {
    id: 1,
    categoryId: 1,
    categoryName: 'Abrasive Sponges & Blocks',
    sku: 'BS-SP-101',
    name: 'Bharat SuperGrit Sanding Sponge (Medium 120)',
    description: 'Four-sided abrasive foam sponge for profiled woodwork, metal surfaces, and drywall sanding. Washable and reusable.',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
    unit: 'Box of 24',
    wholesalePrice: 480.0,
    minimumOrderQuantity: 5,
    stockQuantity: 250,
    active: true,
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: 'Abrasive Sponges & Blocks',
    sku: 'BS-SP-102',
    name: 'Bharat UltraFine Flexible Foam Pad (Grit 320)',
    description: 'High-flexibility thin foam abrasive pad ideal for curved auto body panels, wood contours, and primer scuffing.',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
    unit: 'Box of 50',
    wholesalePrice: 850.0,
    minimumOrderQuantity: 3,
    stockQuantity: 180,
    active: true,
  },
  {
    id: 3,
    categoryId: 1,
    categoryName: 'Abrasive Sponges & Blocks',
    sku: 'BS-SP-103',
    name: 'Bharat Dual-Density Sanding Block (Coarse 60)',
    description: 'Rigid dense core with coarse aluminum oxide coating for rapid material removal on hardwoods, iron, and weld seams.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
    unit: 'Pack of 12',
    wholesalePrice: 360.0,
    minimumOrderQuantity: 10,
    stockQuantity: 400,
    active: true,
  },
  {
    id: 4,
    categoryId: 2,
    categoryName: 'Polishing & Buffing Pads',
    sku: 'BS-POL-201',
    name: 'ProBuff Waffle Foam Polishing Pad (6-Inch)',
    description: 'Precision cut waffle face prevents swirl marks and distributes cutting compound evenly across panels. Velcro hook & loop backing.',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop',
    unit: 'Pack of 5',
    wholesalePrice: 650.0,
    minimumOrderQuantity: 4,
    stockQuantity: 120,
    active: true,
  },
  {
    id: 5,
    categoryId: 2,
    categoryName: 'Polishing & Buffing Pads',
    sku: 'BS-POL-202',
    name: 'Microfiber Finishing Sponge Applicator',
    description: 'Dense polyurethane sponge wrapped in scratch-free microfiber for ceramic coatings, liquid wax, and paint sealant.',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop',
    unit: 'Pack of 10',
    wholesalePrice: 420.0,
    minimumOrderQuantity: 8,
    stockQuantity: 300,
    active: true,
  },
  {
    id: 6,
    categoryId: 3,
    categoryName: 'Industrial Scouring Pads',
    sku: 'BS-IND-301',
    name: 'Heavy Duty Industrial Green Scourer (Extra Coarse)',
    description: 'Industrial nylon web scouring pad for commercial equipment, foundry cleaning, heavy rust preparation, and degreasing.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop',
    unit: 'Carton of 60',
    wholesalePrice: 1200.0,
    minimumOrderQuantity: 2,
    stockQuantity: 85,
    active: true,
  },
  {
    id: 7,
    categoryId: 3,
    categoryName: 'Industrial Scouring Pads',
    sku: 'BS-IND-302',
    name: 'Non-Scratch Blue Industrial Degreasing Sponge',
    description: 'Tough cellulose core combined with non-woven scrubbing surface for factory maintenance, food machinery, and tooling.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop',
    unit: 'Carton of 48',
    wholesalePrice: 960.0,
    minimumOrderQuantity: 3,
    stockQuantity: 140,
    active: true,
  },
  {
    id: 8,
    categoryId: 4,
    categoryName: 'Metal & Rust Prep Sponges',
    sku: 'BS-RST-401',
    name: 'Diamond Hand Polishing Sponge (Grit 200)',
    description: 'Electroplated diamond abrasive surface on ergonomic EVA foam base. Cuts through granite, marble, glass, tiles, and hardened steel.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
    unit: 'Piece',
    wholesalePrice: 290.0,
    minimumOrderQuantity: 10,
    stockQuantity: 320,
    active: true,
  },
  {
    id: 9,
    categoryId: 4,
    categoryName: 'Metal & Rust Prep Sponges',
    sku: 'BS-RST-402',
    name: 'Silicon Carbide Contoured Rust Stripper Block',
    description: 'Beveled edge sanding sponge engineered to access angled grooves, welded seams, and pipe perimeters before primer.',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
    unit: 'Box of 20',
    wholesalePrice: 580.0,
    minimumOrderQuantity: 5,
    stockQuantity: 210,
    active: true,
  },
  {
    id: 10,
    categoryId: 5,
    categoryName: 'Hardware & Finishing Accessories',
    sku: 'BS-ACC-501',
    name: 'Hook & Loop Sponge Interface Cushion Pad (5-Inch)',
    description: 'Soft density foam interface pad to minimize burn-through and provide cushioning on random orbital disc sanders.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop',
    unit: 'Pack of 4',
    wholesalePrice: 380.0,
    minimumOrderQuantity: 5,
    stockQuantity: 160,
    active: true,
  },
  {
    id: 11,
    categoryId: 5,
    categoryName: 'Hardware & Finishing Accessories',
    sku: 'BS-ACC-502',
    name: 'Continuous Abrasive Foam Roll (115mm x 25M, Grit 180)',
    description: 'Perforated sponge roll in dispensing box. Tear off exact length needed for workshops, fabrication lines, and paint shops.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop',
    unit: 'Roll',
    wholesalePrice: 1450.0,
    minimumOrderQuantity: 2,
    stockQuantity: 75,
    active: true,
  },
];

// ============================================================================
// State Management
// ============================================================================
let cart = loadCart();
let activeCategoryId = 0; // 0 = all
let currentSearch = '';
let selectedZone = 'INDORE'; // 'INDORE' or 'OUTSIDE'
let lastPlacedOrder = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initFromUrlParams();
  renderProducts();
  updateCartUI();
  setupStoredCustomerData();
});

// ============================================================================
// Storage Utilities
// ============================================================================
function loadCart() {
  try {
    const raw = localStorage.getItem('bharat_sponge_web_cart');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse cart:', e);
  }
  return [];
}

function saveCart() {
  try {
    localStorage.setItem('bharat_sponge_web_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

function setupStoredCustomerData() {
  try {
    const saved = localStorage.getItem('bharat_sponge_customer_info');
    if (saved) {
      const info = JSON.parse(saved);
      if (info.name) document.getElementById('buyerName').value = info.name;
      if (info.phone) document.getElementById('buyerPhone').value = info.phone;
      if (info.business) document.getElementById('businessName').value = info.business;
      if (info.address) document.getElementById('deliveryAddress').value = info.address;
      if (info.city) document.getElementById('deliveryCity').value = info.city;
      if (info.pincode) document.getElementById('deliveryPincode').value = info.pincode;
      autoDetectIndore();
    }
  } catch (e) {
    // ignore
  }
}

// ============================================================================
// Product Grid Rendering
// ============================================================================
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const emptyNotice = document.getElementById('noProductsNotice');
  const countBadge = document.getElementById('productCountBadge');

  if (!grid) return;

  let filtered = PRODUCTS.filter((p) => p.active !== false);

  // Category filter
  if (activeCategoryId > 0) {
    filtered = filtered.filter((p) => p.categoryId === activeCategoryId);
  }

  // Search filter
  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Update count badge
  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} Product${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyNotice) emptyNotice.style.display = 'block';
    return;
  }

  if (emptyNotice) emptyNotice.style.display = 'none';

  grid.innerHTML = filtered
    .map((product) => {
      const inCartItem = cart.find((i) => i.productId === product.id);
      const currentQty = inCartItem ? inCartItem.quantity : product.minimumOrderQuantity;

      return `
      <div class="product-card" id="product-${product.id}">
        <div class="product-image-container" onclick="openProductModal(${product.id})">
          <img src="${product.imageUrl}" alt="${escapeHtml(product.name)}" class="product-image" loading="lazy" />
          <div class="card-top-badges">
            <span class="sku-badge">${product.sku}</span>
            <span class="moq-badge">MOQ: ${product.minimumOrderQuantity}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="product-category-tag">${escapeHtml(product.categoryName)}</div>
          <h3 class="product-title" onclick="openProductModal(${product.id})">${escapeHtml(product.name)}</h3>
          <p class="product-desc">${escapeHtml(product.description)}</p>

          <div class="pricing-box">
            <div class="unit-label">Wholesale Price (Per ${escapeHtml(product.unit)}):</div>
            <div class="price-row">
              <span class="wholesale-price">₹${product.wholesalePrice.toLocaleString('en-IN')}</span>
              <span class="stock-status">🟢 In Stock (${product.stockQuantity})</span>
            </div>
          </div>

          <div class="card-actions">
            <div class="stepper-row">
              <span class="stepper-label">Qty (Min: ${product.minimumOrderQuantity}):</span>
              <div class="stepper-control">
                <button class="stepper-btn" onclick="stepCardQuantity(${product.id}, -1)">-</button>
                <input type="number" id="card-qty-${product.id}" class="stepper-input" value="${currentQty}" min="${product.minimumOrderQuantity}" onchange="setCardQuantity(${product.id}, this.value)" />
                <button class="stepper-btn" onclick="stepCardQuantity(${product.id}, 1)">+</button>
              </div>
            </div>

            <button class="btn-add-cart" onclick="addCardToCart(${product.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-5Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span>${inCartItem ? 'Update in Cart' : 'Add to Wholesale Cart'}</span>
            </button>

            <button class="btn-quick-whatsapp" onclick="quickWhatsAppOrder(${product.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              <span>Direct WhatsApp Order</span>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

// Stepper helpers for cards
function stepCardQuantity(productId, delta) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;

  const input = document.getElementById(`card-qty-${productId}`);
  if (!input) return;

  let current = parseInt(input.value, 10) || prod.minimumOrderQuantity;
  let next = current + delta;
  if (next < prod.minimumOrderQuantity) {
    showToast(`Minimum order quantity for this item is ${prod.minimumOrderQuantity}`);
    next = prod.minimumOrderQuantity;
  }
  input.value = next;
}

function setCardQuantity(productId, val) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;
  const input = document.getElementById(`card-qty-${productId}`);
  let num = parseInt(val, 10);
  if (isNaN(num) || num < prod.minimumOrderQuantity) {
    num = prod.minimumOrderQuantity;
    showToast(`Quantity set to minimum order quantity: ${prod.minimumOrderQuantity}`);
  }
  if (input) input.value = num;
}

function addCardToCart(productId) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;

  const input = document.getElementById(`card-qty-${productId}`);
  let qty = input ? parseInt(input.value, 10) : prod.minimumOrderQuantity;
  if (isNaN(qty) || qty < prod.minimumOrderQuantity) {
    qty = prod.minimumOrderQuantity;
  }

  addToCart(prod, qty);
}

// ============================================================================
// Cart Operations
// ============================================================================
function addToCart(product, quantity) {
  const existingIndex = cart.findIndex((item) => item.productId === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity = quantity;
    showToast(`Updated "${product.name}" quantity to ${quantity}`);
  } else {
    cart.push({
      productId: product.id,
      quantity: quantity,
    });
    showToast(`Added ${quantity}x "${product.name}" to cart`);
  }

  saveCart();
  updateCartUI();
  renderProducts(); // Refresh button text
}

function updateCartItemQty(productId, delta) {
  const itemIndex = cart.findIndex((i) => i.productId === productId);
  if (itemIndex === -1) return;

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  let newQty = cart[itemIndex].quantity + delta;

  if (newQty < product.minimumOrderQuantity) {
    const confirmRemove = confirm(
      `Quantity cannot be less than MOQ (${product.minimumOrderQuantity}). Do you want to remove this item from your cart?`
    );
    if (confirmRemove) {
      removeFromCart(productId);
    }
    return;
  }

  cart[itemIndex].quantity = newQty;
  saveCart();
  updateCartUI();
  renderProducts();
}

function removeFromCart(productId) {
  const item = cart.find((i) => i.productId === productId);
  const prod = PRODUCTS.find((p) => p.id === productId);
  cart = cart.filter((i) => i.productId !== productId);
  saveCart();
  updateCartUI();
  renderProducts();
  showToast(`Removed "${prod ? prod.name : 'Item'}" from cart`);
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Are you sure you want to clear your wholesale cart?')) {
    cart = [];
    saveCart();
    updateCartUI();
    renderProducts();
    showToast('Wholesale cart cleared');
  }
}

// ============================================================================
// Cart UI Updates (Drawer, Badges, Mobile Bar)
// ============================================================================
function updateCartUI() {
  const totalCount = cart.length;
  let totalUnits = 0;
  let subtotal = 0;

  cart.forEach((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.productId);
    if (p) {
      totalUnits += item.quantity;
      subtotal += p.wholesalePrice * item.quantity;
    }
  });

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

  // Update header badges
  const countBadge = document.getElementById('cartCountBadge');
  const headerTotal = document.getElementById('cartTotalHeader');
  if (countBadge) countBadge.textContent = totalCount;
  if (headerTotal) headerTotal.textContent = formattedSubtotal;

  // Update mobile sticky bar
  const mobileBar = document.getElementById('mobileStickyCart');
  const mobileCount = document.getElementById('mobileCartCount');
  const mobileTotal = document.getElementById('mobileCartTotal');
  if (mobileCount) mobileCount.textContent = totalCount;
  if (mobileTotal) mobileTotal.textContent = formattedSubtotal;
  if (mobileBar) {
    // Only show sticky bar on mobile if items > 0
    if (window.innerWidth <= 768 && totalCount > 0) {
      mobileBar.style.display = 'flex';
    } else if (window.innerWidth <= 768 && totalCount === 0) {
      mobileBar.style.display = 'none';
    }
  }

  // Update cart drawer
  const drawerCount = document.getElementById('drawerItemCount');
  const drawerUnits = document.getElementById('cartTotalUnits');
  const drawerTotal = document.getElementById('cartDrawerTotal');
  const itemsContainer = document.getElementById('cartItemsList');
  const proceedBtn = document.getElementById('btnProceedCheckout');

  if (drawerCount) drawerCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
  if (drawerUnits) drawerUnits.textContent = `${totalUnits} wholesale unit${totalUnits === 1 ? '' : 's'}`;
  if (drawerTotal) drawerTotal.textContent = formattedSubtotal;

  if (proceedBtn) {
    proceedBtn.disabled = totalCount === 0;
  }

  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-box">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <h4>Your Wholesale Cart is Empty</h4>
          <p>Add products with required Minimum Order Quantities (MOQ) to proceed.</p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cart
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          if (!product) return '';
          const lineTotal = product.wholesalePrice * item.quantity;

          return `
          <div class="cart-item-card">
            <button class="btn-remove-item" onclick="removeFromCart(${product.id})" title="Remove item">&times;</button>
            <img src="${product.imageUrl}" alt="${escapeHtml(product.name)}" class="cart-item-thumb" />
            <div class="cart-item-info">
              <h4 class="cart-item-title">${escapeHtml(product.name)}</h4>
              <div class="cart-item-unit-price">
                ₹${product.wholesalePrice.toLocaleString('en-IN')} / ${escapeHtml(product.unit)}
              </div>
              <div class="cart-item-bottom-row">
                <div class="stepper-control">
                  <button class="stepper-btn" onclick="updateCartItemQty(${product.id}, -1)">-</button>
                  <input type="number" class="stepper-input" value="${item.quantity}" readonly />
                  <button class="stepper-btn" onclick="updateCartItemQty(${product.id}, 1)">+</button>
                </div>
                <div class="cart-item-subtotal">₹${lineTotal.toLocaleString('en-IN')}</div>
              </div>
              <div class="moq-warning-hint">MOQ: ${product.minimumOrderQuantity} ${escapeHtml(product.unit)}</div>
            </div>
          </div>
        `;
        })
        .join('');
    }
  }
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;

  if (open) {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================================================
// Categories & Search Filtering
// ============================================================================
function filterByCategory(categoryId) {
  activeCategoryId = categoryId;
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach((p) => {
    const id = parseInt(p.getAttribute('data-id'), 10);
    if (id === categoryId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
  renderProducts();
}

function handleSearch(val) {
  currentSearch = val;
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.style.display = val.trim() ? 'block' : 'none';
  }
  renderProducts();
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  handleSearch('');
}

function resetFilter() {
  clearSearch();
  filterByCategory(0);
}

// ============================================================================
// Product Detail Modal
// ============================================================================
function openProductModal(productId) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('productModalBackdrop');
  const content = document.getElementById('productModalContent');
  if (!modal || !content) return;

  const inCart = cart.find((i) => i.productId === prod.id);
  const currentQty = inCart ? inCart.quantity : prod.minimumOrderQuantity;

  content.innerHTML = `
    <div class="modal-prod-img-wrap">
      <img src="${prod.imageUrl}" alt="${escapeHtml(prod.name)}" class="modal-prod-img" />
    </div>
    <div class="modal-prod-details">
      <div class="modal-cat-tag">${escapeHtml(prod.categoryName)}</div>
      <h2 class="modal-prod-title">${escapeHtml(prod.name)}</h2>
      <div class="modal-sku-bar">
        <span class="modal-sku">SKU: ${prod.sku}</span>
        <span class="modal-stock">🟢 Factory Stock: ${prod.stockQuantity} units available</span>
      </div>
      <p class="modal-prod-desc">${escapeHtml(prod.description)}</p>

      <div class="modal-price-box">
        <div class="modal-price-val">₹${prod.wholesalePrice.toLocaleString('en-IN')}</div>
        <div class="modal-unit">Unit: ${escapeHtml(prod.unit)}</div>
        <div class="modal-moq-info">⚡ Wholesale Minimum Order Quantity (MOQ): ${prod.minimumOrderQuantity} ${escapeHtml(prod.unit)}</div>
      </div>

      <div class="card-actions" style="margin-top: auto;">
        <div class="stepper-row">
          <span class="stepper-label">Select Quantity:</span>
          <div class="stepper-control">
            <button class="stepper-btn" onclick="stepModalQty(${prod.id}, -1)">-</button>
            <input type="number" id="modal-qty-${prod.id}" class="stepper-input" value="${currentQty}" min="${prod.minimumOrderQuantity}" />
            <button class="stepper-btn" onclick="stepModalQty(${prod.id}, 1)">+</button>
          </div>
        </div>

        <button class="btn-add-cart" onclick="addModalToCart(${prod.id})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-5Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span>${inCart ? 'Update in Cart' : 'Add to Wholesale Cart'}</span>
        </button>

        <button class="btn-quick-whatsapp" onclick="quickWhatsAppOrder(${prod.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
          <span>Order This Item on WhatsApp</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function stepModalQty(productId, delta) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;
  const input = document.getElementById(`modal-qty-${productId}`);
  if (!input) return;
  let cur = parseInt(input.value, 10) || prod.minimumOrderQuantity;
  let next = cur + delta;
  if (next < prod.minimumOrderQuantity) {
    showToast(`MOQ is ${prod.minimumOrderQuantity}`);
    next = prod.minimumOrderQuantity;
  }
  input.value = next;
}

function addModalToCart(productId) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;
  const input = document.getElementById(`modal-qty-${productId}`);
  const qty = input ? parseInt(input.value, 10) : prod.minimumOrderQuantity;
  addToCart(prod, qty);
  closeProductModal();
}

function closeProductModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('btn-modal-close')) {
    return;
  }
  const modal = document.getElementById('productModalBackdrop');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================================
// Checkout Flow & Delivery Zone Intelligence
// ============================================================================
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your wholesale cart is empty. Please add products first.');
    return;
  }

  toggleCartDrawer(false); // close drawer

  const modal = document.getElementById('checkoutModalBackdrop');
  if (!modal) return;

  renderCheckoutReview();
  autoDetectIndore();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('btn-modal-close')) {
    return;
  }
  const modal = document.getElementById('checkoutModalBackdrop');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function autoDetectIndore() {
  const addr = (document.getElementById('deliveryAddress')?.value || '').toLowerCase();
  const city = (document.getElementById('deliveryCity')?.value || '').toLowerCase();
  const pin = (document.getElementById('deliveryPincode')?.value || '').trim();

  // Check Indore keyword or Indore pincode 452xxx
  const isIndore =
    addr.includes('indore') ||
    city.includes('indore') ||
    pin.startsWith('452');

  if (isIndore) {
    updateDeliveryFee('INDORE');
  } else if (city.trim() && !city.includes('indore')) {
    updateDeliveryFee('OUTSIDE');
  }
}

function updateDeliveryFee(zone) {
  selectedZone = zone;
  const indoreRadio = document.getElementById('zoneIndoreRadio');
  const outsideRadio = document.getElementById('zoneOutsideRadio');

  if (zone === 'INDORE') {
    if (indoreRadio) indoreRadio.checked = true;
  } else {
    if (outsideRadio) outsideRadio.checked = true;
  }

  renderCheckoutReview();
}

function renderCheckoutReview() {
  const container = document.getElementById('checkoutItemsPreview');
  const reviewSubtotal = document.getElementById('reviewSubtotal');
  const reviewZoneName = document.getElementById('reviewZoneName');
  const reviewDeliveryFee = document.getElementById('reviewDeliveryFee');
  const reviewGrandTotal = document.getElementById('reviewGrandTotal');

  let subtotal = 0;
  let itemsHtml = '';

  cart.forEach((item) => {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    if (!prod) return;
    const lineTotal = prod.wholesalePrice * item.quantity;
    subtotal += lineTotal;

    itemsHtml += `
      <div class="preview-item-row">
        <div>
          <div class="preview-item-name">${escapeHtml(prod.name)}</div>
          <div class="preview-item-qty">${item.quantity} ${escapeHtml(prod.unit)} @ ₹${prod.wholesalePrice}</div>
        </div>
        <div class="preview-item-subtotal">₹${lineTotal.toLocaleString('en-IN')}</div>
      </div>
    `;
  });

  if (container) container.innerHTML = itemsHtml;

  const isLocal = selectedZone === 'INDORE';
  const deliveryCharge = isLocal ? CONFIG.localIndoreSurcharge : CONFIG.outsideIndoreSurcharge;
  const grandTotal = subtotal + deliveryCharge;

  if (reviewSubtotal) reviewSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (reviewZoneName) reviewZoneName.textContent = isLocal ? 'Indore Local' : 'Outside Indore';
  if (reviewDeliveryFee) {
    reviewDeliveryFee.textContent = isLocal
      ? 'FREE (₹0)'
      : `+₹${deliveryCharge.toLocaleString('en-IN')} (Courier Surcharge)`;
    reviewDeliveryFee.className = isLocal ? 'free-text' : '';
  }
  if (reviewGrandTotal) reviewGrandTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

// ============================================================================
// Order Submission & WhatsApp Message Generator
// ============================================================================
function handleCheckoutSubmit(e) {
  if (e) e.preventDefault();
  processOrderPlacement(true); // true = redirect to WhatsApp
}

function submitWithoutWhatsapp() {
  const form = document.getElementById('checkoutForm');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  processOrderPlacement(false); // false = view receipt only
}

function processOrderPlacement(openWhatsApp) {
  if (cart.length === 0) {
    showToast('Your cart is empty.');
    return;
  }

  const buyerName = document.getElementById('buyerName')?.value.trim();
  const buyerPhone = document.getElementById('buyerPhone')?.value.trim();
  const businessName = document.getElementById('businessName')?.value.trim();
  const deliveryAddress = document.getElementById('deliveryAddress')?.value.trim();
  const deliveryCity = document.getElementById('deliveryCity')?.value.trim();
  const deliveryPincode = document.getElementById('deliveryPincode')?.value.trim();
  const orderNotes = document.getElementById('orderNotes')?.value.trim();

  // Selected payment method
  const payRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = payRadio ? payRadio.value : 'CASH';

  if (!buyerName || !buyerPhone || !businessName || !deliveryAddress) {
    showToast('Please fill all required buyer and delivery fields.');
    return;
  }

  // Save customer info in localStorage for future convenience
  try {
    localStorage.setItem(
      'bharat_sponge_customer_info',
      JSON.stringify({
        name: buyerName,
        phone: buyerPhone,
        business: businessName,
        address: deliveryAddress,
        city: deliveryCity,
        pincode: deliveryPincode,
      })
    );
  } catch (e) {
    // ignore
  }

  // Generate Unique Sequential Order Number: BS-2026-XXXXXX
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `BS-2026-${randomSuffix}`;

  // Calculate totals
  let totalUnits = 0;
  let subtotal = 0;
  const orderItems = [];

  cart.forEach((item) => {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    if (prod) {
      const lineTotal = prod.wholesalePrice * item.quantity;
      totalUnits += item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        id: prod.id,
        name: prod.name,
        sku: prod.sku,
        unit: prod.unit,
        price: prod.wholesalePrice,
        quantity: item.quantity,
        subtotal: lineTotal,
      });
    }
  });

  const isLocal = selectedZone === 'INDORE';
  const deliveryCharge = isLocal ? CONFIG.localIndoreSurcharge : CONFIG.outsideIndoreSurcharge;
  const grandTotal = subtotal + deliveryCharge;

  lastPlacedOrder = {
    orderNumber,
    buyerName,
    buyerPhone,
    businessName,
    fullAddress: `${deliveryAddress}, ${deliveryCity} - ${deliveryPincode}`,
    isLocal,
    deliveryZoneLabel: isLocal ? 'Indore Local Dispatch' : 'Outside Indore Dispatch',
    deliveryCharge,
    paymentMethod,
    orderNotes,
    items: orderItems,
    totalUnits,
    subtotal,
    grandTotal,
    timestamp: new Date().toISOString(),
  };

  // Save to orders history in localStorage
  try {
    const existingOrders = JSON.parse(localStorage.getItem('bharat_sponge_orders') || '[]');
    existingOrders.unshift(lastPlacedOrder);
    localStorage.setItem('bharat_sponge_orders', JSON.stringify(existingOrders));
  } catch (e) {
    // ignore
  }

  // Clear active cart
  cart = [];
  saveCart();
  updateCartUI();
  renderProducts();

  // Close checkout modal & show receipt modal
  closeCheckoutModal();
  showOrderReceipt(lastPlacedOrder);

  // If requested, open WhatsApp with the formatted order text
  if (openWhatsApp) {
    const whatsappUrl = buildWhatsAppOrderUrl(lastPlacedOrder);
    window.open(whatsappUrl, '_blank');
  }
}

// Format the WhatsApp Order Message beautifully
function buildWhatsAppOrderUrl(order) {
  const lines = [
    `🛒 *NEW WHOLESALE ORDER: ${order.orderNumber}*`,
    `🏢 *Bharat Sponge Enterprises (Indore Hub)*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Buyer:* ${order.buyerName}`,
    `🏪 *Business:* ${order.businessName}`,
    `📞 *Phone:* ${order.buyerPhone}`,
    `📍 *Delivery Address:* ${order.fullAddress}`,
    `🚚 *Dispatch Zone:* ${order.deliveryZoneLabel}`,
    `💳 *Payment Mode:* ${order.paymentMethod} (Offline Settlement)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *WHOLESALE ORDER ITEMS:*`,
  ];

  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.name}* (SKU: ${item.sku})`
    );
    lines.push(
      `   └ Qty: *${item.quantity} ${item.unit}* @ ₹${item.price.toLocaleString('en-IN')} = ₹${item.subtotal.toLocaleString('en-IN')}`
    );
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📦 *Total Units:* ${order.totalUnits} items`);
  lines.push(`💰 *Subtotal:* ₹${order.subtotal.toLocaleString('en-IN')}`);
  lines.push(
    `🚚 *Delivery Surcharge:* ${
      order.deliveryCharge === 0 ? '₹0 (FREE Indore Dispatch)' : `+₹${order.deliveryCharge.toLocaleString('en-IN')}`
    }`
  );
  lines.push(`🏷️ *GRAND TOTAL:* *₹${order.grandTotal.toLocaleString('en-IN')}*`);

  if (order.orderNotes) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📝 *Dispatch Note:* ${order.orderNotes}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🙏 *Please confirm order & dispatch schedule.*`);

  const fullText = lines.join('\n');
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(fullText)}`;
}

// Quick 1-Click WhatsApp Order for a Single Product
function quickWhatsAppOrder(productId) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;

  const cardInput = document.getElementById(`card-qty-${productId}`);
  const qty = cardInput ? parseInt(cardInput.value, 10) : prod.minimumOrderQuantity;
  const lineTotal = prod.wholesalePrice * qty;

  const message = [
    `👋 *Hello Bharat Sponge (Indore Hub)*,`,
    `I want to place a wholesale order for:`,
    ``,
    `📦 *Product:* ${prod.name}`,
    `🏷️ *SKU:* ${prod.sku}`,
    `📊 *Quantity:* ${qty} ${prod.unit} (MOQ: ${prod.minimumOrderQuantity})`,
    `💰 *Rate:* ₹${prod.wholesalePrice} / ${prod.unit}`,
    `💵 *Approx Subtotal:* ₹${lineTotal.toLocaleString('en-IN')}`,
    ``,
    `Please confirm stock availability and dispatch schedule.`,
  ].join('\n');

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ============================================================================
// Order Receipt Modal (Challan / Invoice)
// ============================================================================
function showOrderReceipt(order) {
  const modal = document.getElementById('receiptModalBackdrop');
  if (!modal) return;

  document.getElementById('receiptOrderNumber').textContent = order.orderNumber;
  document.getElementById('receiptCustomerName').textContent = order.buyerName;
  document.getElementById('receiptBusinessName').textContent = order.businessName;
  document.getElementById('receiptPhone').textContent = order.buyerPhone;
  document.getElementById('receiptAddress').textContent = order.fullAddress;
  document.getElementById('receiptPaymentMethod').textContent = order.paymentMethod;

  const zoneEl = document.getElementById('receiptZone');
  if (zoneEl) {
    zoneEl.textContent = order.deliveryZoneLabel;
    zoneEl.className = order.isLocal ? 'status-pill green' : 'status-pill orange';
  }

  // Items table
  const tbody = document.getElementById('receiptItemsBody');
  if (tbody) {
    tbody.innerHTML = order.items
      .map(
        (i) => `
        <tr>
          <td>
            <strong>${escapeHtml(i.name)}</strong><br />
            <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #64748b;">${i.sku}</span>
          </td>
          <td class="text-center">${escapeHtml(i.unit)}</td>
          <td class="text-center"><strong>${i.quantity}</strong></td>
          <td class="text-right">₹${i.price.toLocaleString('en-IN')}</td>
          <td class="text-right"><strong>₹${i.subtotal.toLocaleString('en-IN')}</strong></td>
        </tr>
      `
      )
      .join('');
  }

  document.getElementById('receiptSubtotal').textContent = `₹${order.subtotal.toLocaleString('en-IN')}`;
  document.getElementById('receiptDeliveryCharge').textContent =
    order.deliveryCharge === 0 ? '₹0 (Free Local Dispatch)' : `+₹${order.deliveryCharge.toLocaleString('en-IN')}`;
  document.getElementById('receiptGrandTotal').textContent = `₹${order.grandTotal.toLocaleString('en-IN')}`;
  document.getElementById('receiptBarcodeText').textContent = `*${order.orderNumber}*`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function resendReceiptToWhatsApp() {
  if (!lastPlacedOrder) return;
  const url = buildWhatsAppOrderUrl(lastPlacedOrder);
  window.open(url, '_blank');
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptModalBackdrop');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================================
// Sharing and URL Param Navigation
// ============================================================================
function shareCatalogLink() {
  const url = window.location.href.split('?')[0];
  if (navigator.share) {
    navigator
      .share({
        title: 'Bharat Sponge — Wholesale Catalog',
        text: 'Direct Factory Wholesale Rates on Abrasive Sponges & Finishing Pads from Indore, MP:',
        url: url,
      })
      .catch(() => copyToClipboard(url));
  } else {
    copyToClipboard(url);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Catalog link copied to clipboard! You can paste and send it on WhatsApp.');
  });
}

function initFromUrlParams() {
  const params = new URLSearchParams(window.location.search);

  // Direct Product Link: ?product=2
  const prodId = params.get('product');
  if (prodId) {
    setTimeout(() => {
      openProductModal(parseInt(prodId, 10));
    }, 300);
  }

  // Category filter: ?category=1 or ?cat=2
  const cat = params.get('category') || params.get('cat');
  if (cat) {
    const catId = parseInt(cat, 10);
    if (!isNaN(catId)) {
      activeCategoryId = catId;
      filterByCategory(catId);
    }
  }

  // Open Cart: ?cart=1
  if (params.get('cart') === '1' || params.get('cart') === 'open') {
    setTimeout(() => {
      toggleCartDrawer(true);
    }, 400);
  }
}

// ============================================================================
// Notification Toasts & Utility
// ============================================================================
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    <span>${escapeHtml(msg)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

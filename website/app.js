/**
 * BHARAT HARDWARE — B2B Wholesale Website Application Logic
 * Factory Hub: Sanwer Road Industrial Area, Indore, MP
 * WhatsApp / Phone: Bharat Hardware (+91 7869385515)
 */

// ============================================================================
// Catalog Data (Synchronized with Bharat Hardware Backend & Seed Data)
// ============================================================================
const CONFIG = {
  appName: 'Bharat Hardware',
  hub: 'Sanwer Road Industrial Area, Indore, MP',
  ownerName: 'Bharat Hardware',
  ownerPhone: '7869385515',
  supportPhone: '+91 7869385515',
  whatsappNumber: '917869385515',
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

            <div class="card-btn-group">
              <button class="btn-add-cart" onclick="addCardToCart(${product.id})" title="${inCartItem ? 'Update in Cart' : 'Add to Wholesale Cart'}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-5Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span class="btn-text-full">${inCartItem ? 'Update in Cart' : 'Add to Wholesale Cart'}</span>
                <span class="btn-text-compact">${inCartItem ? '✓ Cart' : '+ Cart'}</span>
              </button>

              <button class="btn-quick-whatsapp" onclick="quickWhatsAppOrder(${product.id})" title="Generate Bill & Send to WhatsApp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                <span class="btn-text-full">Generate Bill &amp; WhatsApp</span>
                <span class="btn-text-compact">⚡ WhatsApp</span>
              </button>
            </div>
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
  const directWaBtn = document.getElementById('btnCartDirectWhatsapp');
  const pdfOnlyBtn = document.getElementById('btnCartPdfOnly');

  if (drawerCount) drawerCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
  if (drawerUnits) drawerUnits.textContent = `${totalUnits} wholesale unit${totalUnits === 1 ? '' : 's'}`;
  if (drawerTotal) drawerTotal.textContent = formattedSubtotal;

  if (proceedBtn) proceedBtn.disabled = totalCount === 0;
  if (directWaBtn) directWaBtn.disabled = totalCount === 0;
  if (pdfOnlyBtn) pdfOnlyBtn.disabled = totalCount === 0;

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
  const searchInput = document.getElementById('searchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const clearMobileBtn = document.getElementById('clearMobileSearchBtn');

  if (searchInput && searchInput.value !== val) searchInput.value = val;
  if (mobileSearchInput && mobileSearchInput.value !== val) mobileSearchInput.value = val;

  const showClear = val.trim() ? 'block' : 'none';
  if (clearBtn) clearBtn.style.display = showClear;
  if (clearMobileBtn) clearMobileBtn.style.display = showClear;

  renderProducts();
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  if (searchInput) searchInput.value = '';
  if (mobileSearchInput) mobileSearchInput.value = '';
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
          <span>Generate Bill &amp; WhatsApp</span>
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
  directCartWhatsAppOrder();
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
// Order Placement, PDF Invoice Engine & WhatsApp Dispatch (No Required Details!)
// ============================================================================

let lastGeneratedPdfDoc = null;

function generateOrderNumber() {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `BS-2026-${randomSuffix}`;
}

// ============================================================================
// PDF Engine: Constructs Full A4 Wholesale Tax Invoice
// ============================================================================
function createInvoiceDoc(order) {
  if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
    console.warn('jsPDF engine not available on window.');
    return null;
  }

  const { jsPDF } = window.jspdf;
  if (typeof window.applyPlugin === 'function') {
    try { window.applyPlugin(jsPDF); } catch (e) {}
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36; // 0.5 inch margin

  // Top Brand Accent (Industrial Orange)
  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Header Navy Box (#0F172A)
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, 18, pageWidth - margin * 2, 72, 6, 6, 'F');

  // Left Header Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('BHARAT HARDWARE', margin + 16, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('INDUSTRIAL HARDWARE, ABRASIVES & FINISHING TOOLS', margin + 16, 58);
  doc.text('Factory Hub: Sanwer Road Industrial Area, Sector B, Indore, MP 452015', margin + 16, 70);
  doc.text('WhatsApp / Support: Bharat Hardware | Mobile: +91 7869385515', margin + 16, 82);

  // Right Header Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(251, 146, 60);
  doc.text('WHOLESALE TAX INVOICE', pageWidth - margin - 16, 44, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  doc.text(`Bill No: ${order.orderNumber}`, pageWidth - margin - 16, 58, { align: 'right' });
  doc.text(`Date: ${order.dateStr}`, pageWidth - margin - 16, 70, { align: 'right' });
  doc.text('Channel: Direct WhatsApp Order', pageWidth - margin - 16, 82, { align: 'right' });

  // Order Info Card
  const infoY = 100;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, infoY, pageWidth - margin * 2, 54, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('ORDER & FACTORY DISPATCH INFORMATION', margin + 12, infoY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Customer / Dealer: ', margin + 12, infoY + 28);
  doc.setFont('helvetica', 'bold');
  doc.text(order.buyerName || 'Direct Wholesale Buyer', margin + 105, infoY + 28);

  doc.setFont('helvetica', 'normal');
  doc.text('Delivery Zone: ', margin + 12, infoY + 42);
  doc.setFont('helvetica', 'bold');
  doc.text(order.deliveryZoneLabel || 'Indore Local Dispatch (FREE)', margin + 105, infoY + 42);

  const rightColX = pageWidth / 2 + 15;
  doc.setFont('helvetica', 'normal');
  doc.text('Settlement Mode: ', rightColX, infoY + 28);
  doc.setFont('helvetica', 'bold');
  doc.text(order.paymentMethod || 'Cash / UPI on Delivery', rightColX + 85, infoY + 28);

  doc.setFont('helvetica', 'normal');
  doc.text('Dispatch Hub: ', rightColX, infoY + 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Sanwer Road Hub, Indore (M.P.)', rightColX + 85, infoY + 42);

  // Table Data
  const tableRows = order.items.map((item, index) => [
    index + 1,
    item.name,
    item.sku,
    item.unit,
    `Rs. ${Number(item.price).toLocaleString('en-IN')}`,
    item.quantity,
    `Rs. ${Number(item.subtotal).toLocaleString('en-IN')}`,
  ]);

  const autoTableFn = doc.autoTable || (typeof window.autoTable === 'function' ? window.autoTable : null);

  if (autoTableFn) {
    autoTableFn.call(doc, {
      startY: infoY + 62,
      margin: { left: margin, right: margin },
      head: [['#', 'Item Description', 'SKU', 'Packaging Unit', 'Wholesale Rate', 'Qty', 'Amount']],
      body: tableRows,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 5,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 24, halign: 'center' },
        1: { cellWidth: 'auto', fontStyle: 'bold' },
        2: { cellWidth: 64, textColor: [100, 116, 139] },
        3: { cellWidth: 68 },
        4: { cellWidth: 70, halign: 'right' },
        5: { cellWidth: 36, halign: 'center', fontStyle: 'bold' },
        6: { cellWidth: 74, halign: 'right', fontStyle: 'bold' },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });
  }

  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : infoY + 160) + 12;

  // Totals Box
  const summaryBoxWidth = 220;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryBoxX, finalY, summaryBoxWidth, 78, 4, 4, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Total Items / Units:', summaryBoxX + 12, finalY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${order.totalUnits} Units`, summaryBoxX + summaryBoxWidth - 12, finalY + 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Wholesale Subtotal:', summaryBoxX + 12, finalY + 34);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Rs. ${Number(order.subtotal).toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 12, finalY + 34, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Delivery Charge:', summaryBoxX + 12, finalY + 50);
  doc.setFont('helvetica', 'bold');
  const delCharge = Number(order.deliveryCharge) || 0;
  doc.setTextColor(delCharge === 0 ? 22 : 15, delCharge === 0 ? 101 : 23, delCharge === 0 ? 52 : 42);
  doc.text(delCharge === 0 ? 'FREE (Indore Hub)' : `+Rs. ${delCharge.toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 12, finalY + 50, { align: 'right' });

  // Grand Total Highlight Card
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(summaryBoxX, finalY + 58, summaryBoxWidth, 24, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL AMOUNT:', summaryBoxX + 10, finalY + 74);
  doc.setTextColor(251, 146, 60);
  doc.text(`Rs. ${Number(order.grandTotal).toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 10, finalY + 74, { align: 'right' });

  // Terms & Guarantee
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TERMS & DISPATCH GUARANTEE:', margin, finalY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('• Direct factory dispatch from Sanwer Road Industrial Area, Indore, M.P.', margin, finalY + 30);
  doc.text('• Wholesale B2B supply: 100% Genuine industrial grade abrasive foam.', margin, finalY + 42);
  doc.text('• For dispatch tracking & transport receipts, WhatsApp/Call +91 7869385515.', margin, finalY + 54);
  doc.text('• This bill has been automatically recorded and forwarded to factory dispatch.', margin, finalY + 66);

  // Footer
  const footerY = Math.max(finalY + 96, pageHeight - 50);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Bharat Hardware Wholesale Hub • Computer-generated commercial order bill', margin, footerY + 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('For BHARAT HARDWARE (Authorized Dispatch Desk)', pageWidth - margin, footerY + 2, { align: 'right' });

  return doc;
}

// Client-side PDF generator & downloader (jsPDF + autoTable)
function generateAndDownloadInvoicePDF(order) {
  try {
    const doc = createInvoiceDoc(order);
    if (!doc) return false;

    const filename = `BharatHardware_Invoice_${order.orderNumber}.pdf`;
    try {
      doc.save(filename);
    } catch (saveErr) {
      console.warn('doc.save failed, using blob link fallback:', saveErr);
      if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        const blob = doc.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          if (downloadLink.parentNode) downloadLink.parentNode.removeChild(downloadLink);
          URL.revokeObjectURL(blobUrl);
        }, 300);
      }
    }
    lastGeneratedPdfDoc = doc;
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    return false;
  }
}

function downloadCurrentOrderPDF() {
  if (lastPlacedOrder) {
    generateAndDownloadInvoicePDF(lastPlacedOrder);
    showToast('Invoice PDF downloaded!');
  } else {
    showToast('No recent invoice found.');
  }
}

// Universal Synchronous WhatsApp Redirect (Cross-Platform Mobile App & Desktop Web)
function redirectToWhatsApp(url) {
  if (!url) return;

  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // Direct location change invokes WhatsApp native application immediately
    window.location.href = url;
  } else {
    // On desktop, window.open in new tab opens WhatsApp Web or prompts Desktop App
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
  }
}

// Generates 1-Click Online Bill View Link for WhatsApp Chat
function createBillShareUrl(order) {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const base = isLocalhost
    ? window.location.origin + window.location.pathname
    : 'https://shadabkhany8.github.io/Bharathardware/';
  const compactItems = (order.items || [])
    .map((item) => `${item.productId}:${item.quantity}`)
    .join(',');
  return `${base}?invoice=${encodeURIComponent(order.orderNumber)}&items=${encodeURIComponent(compactItems)}`;
}

// Professional WhatsApp Message Formatter
function buildWhatsAppOrderUrl(order) {
  const dateStr = order.dateStr || new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const lines = [
    `🧾 *BHARAT HARDWARE — WHOLESALE INVOICE BILL*`,
    `🏭 *Sanwer Road Industrial Area, Indore (M.P.)*`,
    `👤 *Store:* Bharat Hardware (📞 +91 ${CONFIG.ownerPhone})`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 *Invoice / Bill No:* *${order.orderNumber}*`,
    `📅 *Date & Time:* ${dateStr}`,
    `👤 *Customer / Dealer:* ${order.buyerName || 'Direct Wholesale Buyer'}`,
    `🏪 *Firm / Shop:* ${order.businessName || 'Wholesale Order'}`,
    `📍 *Factory Dispatch:* Indore Hub (Sanwer Road)`,
    `💳 *Payment Terms:* Cash on Delivery / UPI Settlement`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *ORDERED ITEMS (WHOLESALE MOQ):*`,
  ];

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}️⃣ *${item.name}*`);
    lines.push(`   • SKU: \`${item.sku}\``);
    lines.push(`   • Rate: ₹${Number(item.price).toLocaleString('en-IN')} / ${item.unit}`);
    lines.push(`   • Qty: *${item.quantity} ${item.unit}*`);
    lines.push(`   • Line Total: *₹${Number(item.subtotal).toLocaleString('en-IN')}*`);
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📊 *BILL TOTAL SUMMARY:*`);
  lines.push(`🔹 *Total Wholesale Units:* ${order.totalUnits} Units`);
  lines.push(`💰 *Wholesale Subtotal:* ₹${Number(order.subtotal).toLocaleString('en-IN')}`);
  lines.push(`🚚 *Indore Local Delivery:* FREE (₹0 Surcharge)`);
  lines.push(`🏷️ *NET AMOUNT PAYABLE:* *₹${Number(order.grandTotal).toLocaleString('en-IN')}*`);

  if (order.orderNotes) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📝 *Note / Transport:* ${order.orderNotes}`);
  }

  const billShareUrl = createBillShareUrl(order);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📄 *OFFICIAL WHOLESALE PDF BILL:*`);
  lines.push(`🔗 *View & Download Official PDF Online:*`);
  lines.push(`${billShareUrl}`);
  lines.push(`📁 *Saved on device:* \`BharatHardware_Invoice_${order.orderNumber}.pdf\``);
  lines.push(`📎 *(To send actual PDF in chat: tap 📎 Document & select file)*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🙏 *Bharat Hardware team, please confirm wholesale stock & dispatch schedule.*`);

  const fullText = lines.join('\n');
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(fullText)}`;
}

// Native Mobile Web Share API with File Attachment or Desktop WhatsApp Redirect
async function shareOrderNativeOrWhatsApp(order) {
  if (!order) return;

  // 1. Ensure PDF is generated and downloaded to device
  const doc = createInvoiceDoc(order);
  const filename = `BharatHardware_Invoice_${order.orderNumber}.pdf`;
  if (doc) {
    try {
      doc.save(filename);
      lastGeneratedPdfDoc = doc;
    } catch (e) {
      console.warn('Auto PDF save error:', e);
    }
  }

  const billUrl = createBillShareUrl(order);
  const waSummary = `🧾 *Bharat Hardware Wholesale Bill #${order.orderNumber}*\n🏭 Sanwer Road Industrial Area, Indore (M.P.)\n👤 Store: Bharat Hardware (+91 7869385515)\n💰 Net Total: ₹${Number(order.grandTotal).toLocaleString('en-IN')}\n📄 View / Download Online PDF Bill:\n${billUrl}`;

  // 2. Check if browser supports sharing native files (Android Chrome, iOS Safari)
  if (doc && typeof File !== 'undefined' && navigator.canShare) {
    try {
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      if (navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: `Bharat Hardware - Bill #${order.orderNumber}`,
            text: waSummary,
          });
          showToast(`PDF Bill #${order.orderNumber} shared successfully!`);
          return;
        } catch (shareErr) {
          if (shareErr.name === 'AbortError') {
            // User cancelled share dialog; keep receipt modal active
            return;
          }
          console.warn('Native share cancelled or failed:', shareErr);
        }
      }
    } catch (fileErr) {
      console.warn('File share check failed:', fileErr);
    }
  }

  // 3. Desktop browser or unsupported share: Redirect to WhatsApp with bill details & online link
  const waUrl = buildWhatsAppOrderUrl(order);
  showToast(`Bill PDF downloaded! WhatsApp opening for Bill #${order.orderNumber}...`);
  redirectToWhatsApp(waUrl);
}

// Standalone Share PDF button on Receipt Modal
async function shareCurrentOrderPdf() {
  if (!lastPlacedOrder) {
    showToast('No active bill found to share.');
    return;
  }
  await shareOrderNativeOrWhatsApp(lastPlacedOrder);
}

// 1-Click WhatsApp Order for a Single Product (Generates PDF + Native Share / WhatsApp Dispatch)
async function quickWhatsAppOrder(productId) {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return;

  const cardInput = document.getElementById(`card-qty-${productId}`);
  const qty = cardInput ? parseInt(cardInput.value, 10) : prod.minimumOrderQuantity;
  const lineTotal = prod.wholesalePrice * qty;
  const orderNumber = generateOrderNumber();
  const dateStr = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const singleItemOrder = {
    orderNumber,
    dateStr,
    buyerName: 'Direct Wholesale Buyer',
    buyerPhone: 'Direct via WhatsApp',
    businessName: 'Hardware Store / Retailer',
    fullAddress: 'Indore Local Dispatch (Factory Hub)',
    isLocal: true,
    deliveryZoneLabel: 'Indore Local Dispatch (FREE)',
    deliveryCharge: 0,
    paymentMethod: 'Cash / UPI on Delivery',
    orderNotes: 'Direct Single-Product Wholesale Order',
    items: [
      {
        productId: prod.id,
        name: prod.name,
        sku: prod.sku,
        unit: prod.unit,
        price: prod.wholesalePrice,
        quantity: qty,
        subtotal: lineTotal,
      },
    ],
    totalUnits: qty,
    subtotal: lineTotal,
    grandTotal: lineTotal,
    timestamp: new Date().toISOString(),
  };

  lastPlacedOrder = singleItemOrder;

  // Show order receipt on screen
  showOrderReceipt(singleItemOrder);

  // Trigger PDF file share / download & WhatsApp
  await shareOrderNativeOrWhatsApp(singleItemOrder);
}

// Direct 1-Click WhatsApp Order from Wholesale Cart (Generates PDF + Native Share / WhatsApp, Zero Form Filling!)
async function directCartWhatsAppOrder() {
  if (cart.length === 0) {
    showToast('Your wholesale cart is empty. Please add products first.');
    return;
  }

  let subtotal = 0;
  let totalUnits = 0;
  const orderItems = [];

  for (const item of cart) {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    if (!prod) continue;
    const itemSubtotal = prod.wholesalePrice * item.quantity;
    subtotal += itemSubtotal;
    totalUnits += item.quantity;
    orderItems.push({
      productId: prod.id,
      name: prod.name,
      sku: prod.sku,
      unit: prod.unit,
      price: prod.wholesalePrice,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  if (orderItems.length === 0) {
    showToast('No valid products in cart.');
    return;
  }

  // Pull optional note if customer typed one
  const noteInput = document.getElementById('cartOptionalNote');
  const optionalNote = noteInput ? noteInput.value.trim() : '';

  const orderNumber = generateOrderNumber();
  const dateStr = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const cartOrder = {
    orderNumber,
    dateStr,
    buyerName: 'Direct Wholesale Buyer',
    buyerPhone: 'Direct via WhatsApp',
    businessName: 'Hardware Store / Retailer',
    fullAddress: 'Indore Local Dispatch (Factory Hub)',
    isLocal: true,
    deliveryZoneLabel: 'Indore Local Dispatch (FREE)',
    deliveryCharge: 0,
    paymentMethod: 'Cash / UPI on Delivery',
    orderNotes: optionalNote,
    items: orderItems,
    totalUnits,
    subtotal,
    grandTotal: subtotal,
    timestamp: new Date().toISOString(),
  };

  lastPlacedOrder = cartOrder;

  // 1. Close cart drawer & display on-screen invoice receipt
  toggleCartDrawer(false);
  showOrderReceipt(cartOrder);

  // 2. Reset Cart
  cart = [];
  saveCart();
  updateCartUI();
  renderProducts();

  // 3. Trigger PDF file share / download & WhatsApp
  await shareOrderNativeOrWhatsApp(cartOrder);
}

// Generate & Download PDF Bill Only (Without navigating to WhatsApp)
function directCartGenerateBillOnly() {
  if (cart.length === 0) {
    showToast('Your wholesale cart is empty.');
    return;
  }

  let subtotal = 0;
  let totalUnits = 0;
  const orderItems = [];

  for (const item of cart) {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    if (!prod) continue;
    const itemSubtotal = prod.wholesalePrice * item.quantity;
    subtotal += itemSubtotal;
    totalUnits += item.quantity;
    orderItems.push({
      productId: prod.id,
      name: prod.name,
      sku: prod.sku,
      unit: prod.unit,
      price: prod.wholesalePrice,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  const noteInput = document.getElementById('cartOptionalNote');
  const optionalNote = noteInput ? noteInput.value.trim() : '';

  const orderNumber = generateOrderNumber();
  const dateStr = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const cartOrder = {
    orderNumber,
    dateStr,
    buyerName: 'Direct Wholesale Buyer',
    buyerPhone: 'Direct via WhatsApp',
    businessName: 'Hardware Store / Retailer',
    fullAddress: 'Indore Local Dispatch (Factory Hub)',
    isLocal: true,
    deliveryZoneLabel: 'Indore Local Dispatch (FREE)',
    deliveryCharge: 0,
    paymentMethod: 'Cash / UPI on Delivery',
    orderNotes: optionalNote,
    items: orderItems,
    totalUnits,
    subtotal,
    grandTotal: subtotal,
    timestamp: new Date().toISOString(),
  };

  lastPlacedOrder = cartOrder;
  generateAndDownloadInvoicePDF(cartOrder);
  toggleCartDrawer(false);
  showOrderReceipt(cartOrder);

  cart = [];
  saveCart();
  updateCartUI();
  renderProducts();

  showToast(`Bill PDF downloaded (${orderNumber})!`);
}

function handleCheckoutSubmit(e) {
  if (e) e.preventDefault();
  directCartWhatsAppOrder();
}

function submitWithoutWhatsapp() {
  directCartGenerateBillOnly();
}

// Order Receipt Modal
function showOrderReceipt(order) {
  const modal = document.getElementById('receiptModalBackdrop');
  if (!modal) return;

  const orderNumEl = document.getElementById('receiptOrderNumber');
  const customerNameEl = document.getElementById('receiptCustomerName');
  const businessNameEl = document.getElementById('receiptBusinessName');
  const phoneEl = document.getElementById('receiptPhone');
  const addressEl = document.getElementById('receiptAddress');
  const payMethodEl = document.getElementById('receiptPaymentMethod');

  if (orderNumEl) orderNumEl.textContent = order.orderNumber;
  if (customerNameEl) customerNameEl.textContent = order.buyerName || 'Direct Wholesale Buyer';
  if (businessNameEl) businessNameEl.textContent = order.businessName || 'Wholesale Order';
  if (phoneEl) phoneEl.textContent = order.buyerPhone || 'Direct via WhatsApp';
  if (addressEl) addressEl.textContent = order.fullAddress || 'Indore Local Dispatch (Factory Hub)';
  if (payMethodEl) payMethodEl.textContent = order.paymentMethod || 'Cash / UPI on Delivery';

  const zoneEl = document.getElementById('receiptZone');
  if (zoneEl) {
    zoneEl.textContent = order.deliveryZoneLabel || 'Indore Local Dispatch';
    zoneEl.className = order.isLocal ? 'status-pill green' : 'status-pill orange';
  }

  // Items table (Compact 3-column format)
  const tbody = document.getElementById('receiptItemsBody');
  if (tbody) {
    tbody.innerHTML = order.items
      .map(
        (i) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 0.45rem 0.5rem;">
            <strong style="color: #0f172a; font-size: 0.8rem;">${escapeHtml(i.name)}</strong><br />
            <span style="font-family: var(--font-mono); font-size: 0.68rem; color: #64748b;">${i.sku}</span>
          </td>
          <td class="text-center" style="padding: 0.45rem 0.3rem; white-space: nowrap;">
            <strong>${i.quantity}</strong> <span style="font-size: 0.68rem; color: #64748b;">${escapeHtml(i.unit)}</span>
          </td>
          <td class="text-right" style="padding: 0.45rem 0.5rem; font-weight: 700; color: #0f172a; white-space: nowrap;">
            ₹${Number(i.subtotal).toLocaleString('en-IN')}
          </td>
        </tr>
      `
      )
      .join('');
  }

  const subtotalEl = document.getElementById('receiptSubtotal');
  const deliveryChargeEl = document.getElementById('receiptDeliveryCharge');
  const grandTotalEl = document.getElementById('receiptGrandTotal');
  const barcodeTextEl = document.getElementById('receiptBarcodeText');

  if (subtotalEl) subtotalEl.textContent = `₹${Number(order.subtotal).toLocaleString('en-IN')}`;
  if (deliveryChargeEl) {
    deliveryChargeEl.textContent =
      order.deliveryCharge === 0 ? '₹0 (Free Local Dispatch)' : `+₹${Number(order.deliveryCharge).toLocaleString('en-IN')}`;
  }
  if (grandTotalEl) grandTotalEl.textContent = `₹${Number(order.grandTotal).toLocaleString('en-IN')}`;
  if (barcodeTextEl) barcodeTextEl.textContent = `*${order.orderNumber}*`;

  const whatsappUrl = buildWhatsAppOrderUrl(order);

  // Link for direct WhatsApp button in receipt actions
  const resendBtn = document.getElementById('btnReceiptWhatsApp');
  if (resendBtn) {
    resendBtn.href = whatsappUrl;
    resendBtn.onclick = function (e) {
      redirectToWhatsApp(whatsappUrl);
    };
  }

  // Link for top banner alert
  const alertLink = document.getElementById('waDirectAlertLink');
  if (alertLink) {
    alertLink.href = whatsappUrl;
    alertLink.onclick = function (e) {
      redirectToWhatsApp(whatsappUrl);
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function resendReceiptToWhatsApp() {
  if (!lastPlacedOrder) return;
  const url = buildWhatsAppOrderUrl(lastPlacedOrder);
  redirectToWhatsApp(url);
}

function closeReceiptModal(e) {
  if (
    e &&
    e.target &&
    e.target !== e.currentTarget &&
    !e.target.closest('.btn-modal-close') &&
    !e.target.closest('.btn-close-receipt') &&
    !e.target.closest('.btn-secondary')
  ) {
    return;
  }
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
        title: 'Bharat Hardware — Wholesale Catalog',
        text: 'Direct Factory Wholesale Rates on Industrial Hardware & Abrasives from Indore, MP:',
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

  // Direct Invoice Bill Link: ?invoice=BS-2026-123456&items=1:5,3:10
  const invoiceNum = params.get('invoice');
  const itemsParam = params.get('items');
  if (invoiceNum) {
    let reconstructedItems = [];
    if (itemsParam) {
      const parts = itemsParam.split(',');
      parts.forEach((part) => {
        const [pIdStr, qtyStr] = part.split(':');
        const pId = parseInt(pIdStr, 10);
        const qty = parseInt(qtyStr, 10);
        const prod = PRODUCTS.find((p) => p.id === pId);
        if (prod && qty > 0) {
          reconstructedItems.push({
            productId: prod.id,
            name: prod.name,
            sku: prod.sku,
            unit: prod.unit,
            price: prod.wholesalePrice,
            quantity: qty,
            subtotal: prod.wholesalePrice * qty,
          });
        }
      });
    }

    if (reconstructedItems.length > 0) {
      const subtotal = reconstructedItems.reduce((acc, i) => acc + i.subtotal, 0);
      const totalUnits = reconstructedItems.reduce((acc, i) => acc + i.quantity, 0);
      const loadedOrder = {
        orderNumber: invoiceNum,
        dateStr: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        buyerName: 'Direct Wholesale Buyer',
        buyerPhone: 'Direct via WhatsApp',
        businessName: 'Wholesale Order',
        fullAddress: 'Indore Local Dispatch (Factory Hub)',
        isLocal: true,
        deliveryZoneLabel: 'Indore Local Dispatch (FREE)',
        deliveryCharge: 0,
        paymentMethod: 'Cash / UPI on Delivery',
        orderNotes: 'Online Verified WhatsApp Invoice',
        items: reconstructedItems,
        totalUnits,
        subtotal,
        grandTotal: subtotal,
        timestamp: new Date().toISOString(),
      };

      lastPlacedOrder = loadedOrder;
      setTimeout(() => {
        showOrderReceipt(loadedOrder);
        showToast(`Official Bill #${invoiceNum} loaded on screen!`);
      }, 400);
      return;
    }
  }

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

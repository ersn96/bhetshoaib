// ==================== STATE MANAGEMENT ====================
let appState = {
  products: [],
  cart: [],
  wishlist: [],
  comparison: [],
  orders: [],
  addresses: [],
  recentlyViewed: [],
  currentUser: null,
  isGuest: false,
  users: [],
  sellers: [],
  filters: {
    category: '',
    priceMin: 0,
    priceMax: 50000,
    brands: [],
    rating: 0,
    inStockOnly: false,
    discount: [],
    search: ''
  },
  sortBy: 'relevance',
  currentPage: 1,
  itemsPerPage: 12,
  selectedAddress: null,
  selectedPayment: null,
  appliedCoupon: null,
  currentImageIndex: 0,
  currentProductImages: [],
  editingProductId: null,
  stockFilter: 'all',
  adminView: 'dashboard'
};

// Coupon codes
const COUPONS = {
  'SAVE10': { discount: 10, type: 'percentage', minOrder: 1000 },
  'FIRSTBUY': { discount: 200, type: 'flat', minOrder: 2000 },
  'BHARAT50': { discount: 50, type: 'flat', minOrder: 500 }
};

// Payment methods
const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', providers: ['Visa', 'Mastercard', 'RuPay'] },
  { id: 'upi', name: 'UPI', icon: '📱', providers: ['Google Pay', 'PhonePe', 'Paytm'] },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', providers: [] },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', providers: [] },
  { id: 'emi', name: 'EMI Options', icon: '💰', providers: [] }
];

// Order tracking stages
const TRACKING_STAGES = [
  { stage: 'Order Placed', icon: '✓', description: 'Your order has been confirmed' },
  { stage: 'Packed', icon: '📦', description: 'Your order is being packed' },
  { stage: 'Shipped', icon: '🚚', description: 'Your order is on the way' },
  { stage: 'Out for Delivery', icon: '🏃', description: 'Delivery person is nearby' },
  { stage: 'Delivered', icon: '🎉', description: 'Order delivered successfully' }
];

// ==================== USER DATA ====================
function initializeUsers() {
  // Admin user
  appState.users.push({
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@bh.com',
    role: 'admin',
    name: 'Admin User'
  });
  
  // Sellers
  appState.sellers = [
    {
      id: 4,
      username: 'seller1',
      password: 'seller123',
      name: 'Amit Patel',
      shopName: 'Patel Tools',
      email: 'seller1@gmail.com',
      contact: '9876543210',
      approved: true,
      sellerId: 4
    },
    {
      id: 5,
      username: 'seller2',
      password: 'seller123',
      name: 'Suresh Reddy',
      shopName: 'Reddy Hardware',
      email: 'seller2@gmail.com',
      contact: '9876543211',
      approved: true,
      sellerId: 5
    }
  ];
  
  appState.users.push(...appState.sellers.map(s => ({
    id: s.id,
    username: s.username,
    password: s.password,
    email: s.email,
    role: 'seller',
    name: s.name,
    sellerId: s.sellerId,
    shopName: s.shopName
  })));
  
  // Customers
  appState.users.push(
    {
      id: 2,
      username: 'customer1',
      password: 'pass123',
      email: 'customer1@example.com',
      role: 'customer',
      name: 'Customer One'
    },
    {
      id: 3,
      username: 'customer2',
      password: 'pass123',
      email: 'customer2@example.com',
      role: 'customer',
      name: 'Customer Two'
    }
  );
}

// ==================== PRODUCT DATA ====================
function initializeProducts() {
  const brands = ['Bosch', 'DeWalt', 'Makita', 'Stanley', 'Black & Decker', 'Hitachi', 'Milwaukee', 'Ryobi'];
  const categories = [
    'Power Tools',
    'Hand Tools',
    'Electrical Appliances',
    'Hardware & Fasteners',
    'Spare Parts',
    'Plumbing',
    'Painting Supplies',
    'Safety Equipment'
  ];
  
  const productNames = {
    'Power Tools': [
      'Drill Machine', 'Angle Grinder', 'Circular Saw', 'Impact Driver', 'Rotary Hammer',
      'Jigsaw', 'Belt Sander', 'Orbital Sander', 'Demolition Hammer', 'Planer',
      'Router', 'Chain Saw', 'Heat Gun', 'Polisher', 'Tile Cutter'
    ],
    'Hand Tools': [
      'Hammer Set', 'Screwdriver Set', 'Wrench Set', 'Pliers Set', 'Tool Kit',
      'Hacksaw', 'Chisel Set', 'Measuring Tape', 'Spirit Level', 'File Set',
      'Utility Knife', 'Wire Cutter', 'Pipe Wrench', 'Monkey Wrench', 'Allen Key Set'
    ],
    'Electrical Appliances': [
      'LED Bulb', 'Ceiling Fan', 'Exhaust Fan', 'MCB', 'Extension Cord',
      'Switch Board', 'Voltage Stabilizer', 'Electric Kettle', 'Room Heater', 'Geyser',
      'LED Tube Light', 'Emergency Light', 'Table Fan', 'Immersion Rod', 'Energy Meter'
    ],
    'Hardware & Fasteners': [
      'Screw Set', 'Bolt & Nut Set', 'Anchor Set', 'Nail Set', 'Hinge Set',
      'Door Lock', 'Padlock', 'Cabinet Handle', 'Tower Bolt', 'Latch Set',
      'Rivet Set', 'Washer Set', 'Clamp Set', 'Hook Set', 'Bracket Set'
    ],
    'Spare Parts': [
      'Carbon Brush Set', 'Drill Bit Set', 'Saw Blade', 'Grinding Wheel', 'Sanding Disc',
      'Chuck Key', 'Bearing Set', 'Belt Set', 'Spring Set', 'Gasket Set',
      'O-Ring Set', 'Filter Set', 'Valve Set', 'Gear Set', 'Motor Assembly'
    ],
    'Plumbing': [
      'PVC Pipe', 'Pipe Fitting Set', 'Tap', 'Shower Head', 'Sink',
      'Drain Pipe', 'Water Tank', 'Ball Valve', 'Gate Valve', 'Elbow Joint',
      'T-Joint', 'Coupling', 'Faucet', 'Flush Tank', 'Sanitary Ware'
    ],
    'Painting Supplies': [
      'Paint Brush Set', 'Paint Roller Set', 'Spray Gun', 'Putty Knife', 'Sandpaper Set',
      'Masking Tape', 'Paint Tray', 'Primer', 'Thinner', 'Scraper',
      'Drop Cloth', 'Paint Mixer', 'Caulking Gun', 'Wire Brush', 'Sponge Set'
    ],
    'Safety Equipment': [
      'Safety Helmet', 'Safety Goggles', 'Gloves Set', 'Ear Plugs', 'Face Mask',
      'Safety Shoes', 'Knee Pads', 'Reflective Jacket', 'First Aid Kit', 'Fire Extinguisher',
      'Safety Belt', 'Dust Mask', 'Welding Mask', 'Apron', 'Safety Cone'
    ]
  };

  const products = [];
  let id = 1;

  categories.forEach(category => {
    const items = productNames[category];
    items.forEach((item, index) => {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const basePrice = Math.floor(Math.random() * 10000) + 500;
      const discount = [10, 15, 20, 25, 30, 35, 40, 50][Math.floor(Math.random() * 8)];
      const price = Math.floor(basePrice * (1 - discount/100));
      const rating = (Math.random() * 2 + 3).toFixed(1);
      const stock = Math.floor(Math.random() * 50);
      const sellerId = [4, 5][Math.floor(Math.random() * 2)];
      
      products.push({
        id: id++,
        name: `${brand} ${item}`,
        brand: brand,
        price: price,
        originalPrice: basePrice,
        category: category,
        rating: parseFloat(rating),
        reviewCount: Math.floor(Math.random() * 500) + 50,
        stock: stock,
        sellerId: sellerId,
        description: `High-quality ${item.toLowerCase()} from ${brand}. Perfect for professional and home use. Durable construction and reliable performance.`,
        images: [['🔧', '🔨', '⚡', '🔩'][Math.floor(Math.random() * 4)]],
        features: [
          'Premium Quality',
          'Durable Construction',
          'Easy to Use',
          'Long Lasting'
        ],
        isNew: index < 3,
        discount: discount,
        visible: true
      });
    });
  });

  appState.products = products;
}

// ==================== INITIALIZATION ====================
function init() {
  initializeUsers();
  initializeProducts();
  loadState();
  renderFeaturedProducts();
  renderCategories();
  updateCartCount();
  updateWishlistCount();
  setupSearchAutocomplete();
  setupPriceRangeFilters();
  updateHeaderForUser();
  
  // Show homepage by default
  showPage('home');
}

// ==================== STORAGE MANAGEMENT ====================
function loadState() {
  // Using in-memory state only (no localStorage due to sandbox restrictions)
  // State persists only during the session
}

function saveState() {
  // Using in-memory state only
}

// ==================== PAGE NAVIGATION ====================
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const page = document.getElementById(`page-${pageName}`);
  if (page) {
    page.classList.add('active');
  }
  
  // Render page content
  switch(pageName) {
    case 'home':
      renderFeaturedProducts();
      renderRecentlyViewed();
      break;
    case 'products':
      renderBreadcrumb();
      renderBrandFilters();
      applyFilters();
      break;
    case 'wishlist':
      renderWishlist();
      break;
    case 'cart':
      renderCart();
      break;
    case 'orders':
      renderOrders();
      break;
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// ==================== SEARCH FUNCTIONALITY ====================
function setupSearchAutocomplete() {
  const searchInput = document.getElementById('search-input');
  const suggestions = document.getElementById('search-suggestions');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      suggestions.classList.remove('show');
      return;
    }
    
    const results = [];
    
    // Search in products
    appState.products.forEach(product => {
      if (product.name.toLowerCase().includes(query) || 
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)) {
        results.push({
          type: 'product',
          text: product.name,
          category: product.category,
          id: product.id
        });
      }
    });
    
    // Limit results
    const limitedResults = results.slice(0, 8);
    
    if (limitedResults.length > 0) {
      renderSearchSuggestions(limitedResults, query);
      suggestions.classList.add('show');
    } else {
      suggestions.classList.remove('show');
    }
  });
  
  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
      suggestions.classList.remove('show');
    }
  });
}

function renderSearchSuggestions(results, query) {
  const suggestions = document.getElementById('search-suggestions');
  
  const html = results.map(result => {
    const highlightedText = result.text.replace(
      new RegExp(query, 'gi'),
      match => `<strong>${match}</strong>`
    );
    
    return `
      <div class="suggestion-item" onclick="selectSuggestion(${result.id})">
        <span class="suggestion-icon">🔍</span>
        <div class="suggestion-text">
          <div>${highlightedText}</div>
          <div class="suggestion-category">${result.category}</div>
        </div>
      </div>
    `;
  }).join('');
  
  suggestions.innerHTML = html;
}

function selectSuggestion(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (product) {
    showProductDetail(productId);
  }
  document.getElementById('search-suggestions').classList.remove('show');
}

function performSearch() {
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    appState.filters.search = query;
    showPage('products');
  }
}

// ==================== FILTERS ====================
function setupPriceRangeFilters() {
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const minLabel = document.getElementById('price-min-label');
  const maxLabel = document.getElementById('price-max-label');
  
  if (minInput) {
    minInput.addEventListener('input', (e) => {
      minLabel.textContent = e.target.value;
      appState.filters.priceMin = parseInt(e.target.value);
      applyFilters();
    });
  }
  
  if (maxInput) {
    maxInput.addEventListener('input', (e) => {
      maxLabel.textContent = e.target.value;
      appState.filters.priceMax = parseInt(e.target.value);
      applyFilters();
    });
  }
}

function renderBrandFilters() {
  const brandsSet = new Set();
  appState.products.forEach(p => brandsSet.add(p.brand));
  const brands = Array.from(brandsSet).sort();
  
  const container = document.getElementById('brand-filters');
  if (!container) return;
  
  container.innerHTML = brands.map(brand => `
    <label>
      <input type="checkbox" value="${brand}" class="brand-filter" onchange="applyFilters()">
      ${brand}
    </label>
  `).join('');
}

function applyFilters() {
  // Get filter values
  const rating = parseInt(document.querySelector('input[name="rating"]:checked')?.value || 0);
  const inStockOnly = document.getElementById('in-stock-only')?.checked || false;
  const sortBy = document.getElementById('sort-select')?.value || 'relevance';
  
  const brandCheckboxes = document.querySelectorAll('.brand-filter:checked');
  const brands = Array.from(brandCheckboxes).map(cb => cb.value);
  
  const discountCheckboxes = document.querySelectorAll('.discount-filter:checked');
  const discounts = Array.from(discountCheckboxes).map(cb => parseInt(cb.value));
  
  // Update state
  appState.filters.rating = rating;
  appState.filters.inStockOnly = inStockOnly;
  appState.filters.brands = brands;
  appState.filters.discount = discounts;
  appState.sortBy = sortBy;
  appState.currentPage = 1;
  
  // Filter products
  let filtered = appState.products.filter(product => {
    // Category filter
    if (appState.filters.category && product.category !== appState.filters.category) {
      return false;
    }
    
    // Search filter
    if (appState.filters.search) {
      const query = appState.filters.search.toLowerCase();
      if (!product.name.toLowerCase().includes(query) && 
          !product.category.toLowerCase().includes(query) &&
          !product.brand.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Price filter
    if (product.price < appState.filters.priceMin || product.price > appState.filters.priceMax) {
      return false;
    }
    
    // Brand filter
    if (brands.length > 0 && !brands.includes(product.brand)) {
      return false;
    }
    
    // Rating filter
    if (product.rating < rating) {
      return false;
    }
    
    // Stock filter
    if (inStockOnly && product.stock === 0) {
      return false;
    }
    
    // Discount filter
    if (discounts.length > 0) {
      const maxDiscount = Math.max(...discounts);
      if (product.discount < maxDiscount) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort products
  filtered = sortProducts(filtered, sortBy);
  
  // Render
  renderProductsList(filtered);
}

function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch(sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'discount':
      sorted.sort((a, b) => b.discount - a.discount);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  
  return sorted;
}

function clearAllFilters() {
  appState.filters = {
    category: '',
    priceMin: 0,
    priceMax: 50000,
    brands: [],
    rating: 0,
    inStockOnly: false,
    discount: [],
    search: ''
  };
  
  // Reset UI
  document.getElementById('price-min').value = 0;
  document.getElementById('price-max').value = 50000;
  document.getElementById('price-min-label').textContent = '0';
  document.getElementById('price-max-label').textContent = '50000';
  document.getElementById('search-input').value = '';
  document.querySelectorAll('.brand-filter').forEach(cb => cb.checked = false);
  document.querySelectorAll('.discount-filter').forEach(cb => cb.checked = false);
  document.querySelector('input[name="rating"][value="0"]').checked = true;
  document.getElementById('in-stock-only').checked = false;
  
  applyFilters();
}

function filterByCategory(category) {
  appState.filters.category = category;
  showPage('products');
}

// ==================== RENDER FUNCTIONS ====================
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  const featured = appState.products
    .filter(p => p.isNew || p.discount >= 30)
    .slice(0, 8);
  
  container.innerHTML = featured.map(product => renderProductCard(product)).join('');
}

function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;
  
  const categories = [
    { name: 'Power Tools', icon: '⚡' },
    { name: 'Hand Tools', icon: '🔨' },
    { name: 'Electrical Appliances', icon: '💡' },
    { name: 'Hardware & Fasteners', icon: '🔩' },
    { name: 'Spare Parts', icon: '⚙️' },
    { name: 'Plumbing', icon: '🚰' },
    { name: 'Painting Supplies', icon: '🎨' },
    { name: 'Safety Equipment', icon: '🦺' }
  ];
  
  container.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="filterByCategory('${cat.name}')">
      <div class="icon">${cat.icon}</div>
      <div class="name">${cat.name}</div>
    </div>
  `).join('');
}

function renderProductsList(products) {
  const container = document.getElementById('products-list');
  const resultsCount = document.getElementById('results-count');
  
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="icon">🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search query</p>
        <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
      </div>
    `;
    if (resultsCount) resultsCount.textContent = '';
    return;
  }
  
  // Pagination
  const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
  const endIndex = startIndex + appState.itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  container.innerHTML = paginatedProducts.map(product => renderProductCard(product)).join('');
  
  if (resultsCount) {
    resultsCount.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, products.length)} of ${products.length} products`;
  }
  
  renderPagination(products.length);
}

function renderPagination(totalProducts) {
  const container = document.getElementById('pagination');
  if (!container) return;
  
  const totalPages = Math.ceil(totalProducts / appState.itemsPerPage);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = `
    <button onclick="changePage(${appState.currentPage - 1})" ${appState.currentPage === 1 ? 'disabled' : ''}>Previous</button>
  `;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= appState.currentPage - 1 && i <= appState.currentPage + 1)) {
      html += `<button class="${i === appState.currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === appState.currentPage - 2 || i === appState.currentPage + 2) {
      html += '<button disabled>...</button>';
    }
  }
  
  html += `
    <button onclick="changePage(${appState.currentPage + 1})" ${appState.currentPage === totalPages ? 'disabled' : ''}>Next</button>
  `;
  
  container.innerHTML = html;
}

function changePage(page) {
  appState.currentPage = page;
  applyFilters();
  window.scrollTo(0, 0);
}

function renderProductCard(product) {
  const inWishlist = appState.wishlist.includes(product.id);
  const inComparison = appState.comparison.find(p => p.id === product.id);
  const productImage = Array.isArray(product.images) ? product.images[0] : product.images;
  
  return `
    <div class="product-card">
      <div class="product-image" onclick="showProductDetail(${product.id})">
        <div class="icon">${productImage}</div>
        ${product.isNew || product.discount >= 30 ? `
          <div class="product-badges">
            ${product.isNew ? '<span class="badge-item new">NEW</span>' : ''}
            ${product.discount >= 30 ? '<span class="badge-item sale">SALE</span>' : ''}
          </div>
        ` : ''}
        <div class="product-actions">
          <button class="action-btn ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Add to Wishlist">
            ${inWishlist ? '❤️' : '🤍'}
          </button>
          <button class="action-btn" onclick="event.stopPropagation(); showQuickView(${product.id})" title="Quick View">👁️</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="review-count">(${product.reviewCount})</span>
        </div>
        <div class="product-price">
          <span class="current-price">₹${product.price}</span>
          <span class="original-price">₹${product.originalPrice}</span>
          <span class="discount">${product.discount}% OFF</span>
        </div>
        <div class="product-stock ${product.stock === 0 ? 'out-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}">
          ${product.stock === 0 ? '❌ Out of Stock' : product.stock < 10 ? `⚠️ Only ${product.stock} left` : '✓ In Stock'}
        </div>
      </div>
      <div class="product-footer">
        <button class="btn btn-primary" style="flex: 1;" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
          ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <label class="compare-checkbox" onclick="event.stopPropagation();">
          <input type="checkbox" ${inComparison ? 'checked' : ''} onchange="toggleComparison(${product.id})">
          Compare
        </label>
      </div>
    </div>
  `;
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (halfStar ? '⯨' : '') + '☆'.repeat(emptyStars);
}

function renderBreadcrumb() {
  const container = document.getElementById('breadcrumb');
  if (!container) return;
  
  let html = '<a href="#" onclick="showPage(\'home\')">Home</a>';
  
  if (appState.filters.category) {
    html += ` > <a href="#" onclick="showPage(\'products\')">Products</a> > ${appState.filters.category}`;
  } else if (appState.filters.search) {
    html += ` > Search: "${appState.filters.search}"`;
  } else {
    html += ' > All Products';
  }
  
  container.innerHTML = html;
}

// ==================== PRODUCT DETAIL ====================
function showProductDetail(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;
  
  // Add to recently viewed
  if (!appState.recentlyViewed.includes(productId)) {
    appState.recentlyViewed.unshift(productId);
    if (appState.recentlyViewed.length > 10) {
      appState.recentlyViewed.pop();
    }
  }
  
  const container = document.getElementById('product-detail-content');
  const breadcrumb = document.getElementById('product-breadcrumb');
  const inWishlist = appState.wishlist.includes(productId);
  
  // Update breadcrumb
  breadcrumb.innerHTML = `
    <a href="#" onclick="showPage('home')">Home</a> >
    <a href="#" onclick="filterByCategory('${product.category}')">Products</a> >
    <a href="#" onclick="filterByCategory('${product.category}')">${product.category}</a> >
    ${product.name}
  `;
  
  // Create multiple images for gallery
  const productImages = Array.isArray(product.images) ? product.images : [product.images];
  const images = productImages.length > 1 ? productImages : [productImages[0], productImages[0], productImages[0], productImages[0]];
  appState.currentProductImages = images;
  
  container.innerHTML = `
    <div class="detail-layout">
      <div class="image-gallery">
        <div class="main-image" onclick="openImageModal(0)">
          <div class="icon" id="main-product-image">${images[0]}</div>
        </div>
        <div class="image-thumbnails">
          ${images.map((img, i) => `
            <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeMainImage(${i})">
              ${img}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="detail-info">
        <h1>${product.name}</h1>
        <div class="detail-brand">Brand: <strong>${product.brand}</strong></div>
        <div class="detail-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="review-count">${product.rating} (${product.reviewCount} reviews)</span>
        </div>
        
        <div class="detail-price">
          <span class="current-price">₹${product.price}</span>
          <span class="original-price">₹${product.originalPrice}</span>
          <span class="discount">${product.discount}% OFF</span>
        </div>
        
        <div class="product-stock ${product.stock === 0 ? 'out-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}">
          ${product.stock === 0 ? '❌ Out of Stock' : product.stock < 10 ? `⚠️ Only ${product.stock} left - Order Soon!` : '✓ In Stock'}
        </div>
        
        <div class="detail-actions">
          <button class="btn btn-primary" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
            🛒 Add to Cart
          </button>
          <button class="btn btn-outline" onclick="toggleWishlist(${product.id})">
            ${inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
          </button>
        </div>
        
        <div class="share-buttons">
          <button class="share-btn" onclick="shareProduct('whatsapp', ${product.id})">📱 WhatsApp</button>
          <button class="share-btn" onclick="shareProduct('facebook', ${product.id})">👍 Facebook</button>
          <button class="share-btn" onclick="shareProduct('twitter', ${product.id})">🐦 Twitter</button>
          <button class="share-btn" onclick="shareProduct('copy', ${product.id})">🔗 Copy Link</button>
        </div>
        
        <div class="detail-description">
          <h3>Description</h3>
          <p>${product.description}</p>
        </div>
        
        <div class="detail-description">
          <h3>Key Features</h3>
          <ul>
            ${product.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    
    <div class="recommendations">
      <h3>You May Also Like</h3>
      <div class="products-grid" id="recommendations"></div>
    </div>
  `;
  
  // Render recommendations
  const recommendations = appState.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  document.getElementById('recommendations').innerHTML = 
    recommendations.map(p => renderProductCard(p)).join('');
  
  showPage('product-detail');
}

function changeMainImage(index) {
  const mainImage = document.getElementById('main-product-image');
  mainImage.textContent = appState.currentProductImages[index];
  
  document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
  
  appState.currentImageIndex = index;
}

function openImageModal(index) {
  appState.currentImageIndex = index;
  const modal = document.getElementById('image-modal');
  const img = document.getElementById('modal-image');
  
  // For emoji icons, we'll create a styled div
  img.style.display = 'none';
  const emojiDiv = document.createElement('div');
  emojiDiv.style.fontSize = '300px';
  emojiDiv.style.textAlign = 'center';
  emojiDiv.style.padding = '40px';
  emojiDiv.textContent = appState.currentProductImages[index];
  
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = '';
  modalBody.appendChild(emojiDiv);
  
  // Add navigation
  modalBody.innerHTML += `
    <button class="image-nav prev" onclick="navigateImage(-1)">‹</button>
    <button class="image-nav next" onclick="navigateImage(1)">›</button>
  `;
  
  modal.classList.add('show');
}

function navigateImage(direction) {
  const newIndex = appState.currentImageIndex + direction;
  if (newIndex >= 0 && newIndex < appState.currentProductImages.length) {
    openImageModal(newIndex);
  }
}

function shareProduct(platform, productId) {
  const product = appState.products.find(p => p.id === productId);
  const url = `https://bharathardware.com/product/${productId}`;
  const text = `Check out ${product.name} at Bharat Hardware!`;
  
  switch(platform) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'copy':
      showToast('Link copied to clipboard!', 'success');
      break;
  }
}

// ==================== WISHLIST ====================
function toggleWishlist(productId) {
  const index = appState.wishlist.indexOf(productId);
  
  if (index > -1) {
    appState.wishlist.splice(index, 1);
    showToast('Removed from wishlist', 'info');
  } else {
    appState.wishlist.push(productId);
    showToast('Added to wishlist', 'success');
  }
  
  updateWishlistCount();
  saveState();
  
  // Re-render current page
  const currentPage = document.querySelector('.page.active');
  if (currentPage) {
    const pageId = currentPage.id.replace('page-', '');
    if (pageId === 'products' || pageId === 'home') {
      applyFilters();
    } else if (pageId === 'wishlist') {
      renderWishlist();
    }
  }
}

function toggleWishlistPage() {
  showPage('wishlist');
}

function renderWishlist() {
  const container = document.getElementById('wishlist-products');
  if (!container) return;
  
  if (appState.wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="icon">❤️</div>
        <h3>Your wishlist is empty</h3>
        <p>Add products to your wishlist to save them for later</p>
        <button class="btn btn-primary" onclick="showPage('products')">Start Shopping</button>
      </div>
    `;
    return;
  }
  
  const products = appState.wishlist
    .map(id => appState.products.find(p => p.id === id))
    .filter(p => p);
  
  container.innerHTML = products.map(p => renderProductCard(p)).join('');
}

function updateWishlistCount() {
  const badge = document.getElementById('wishlist-count');
  if (badge) {
    badge.textContent = appState.wishlist.length;
    badge.style.display = appState.wishlist.length > 0 ? 'block' : 'none';
  }
}

// ==================== COMPARISON ====================
function toggleComparison(productId) {
  const product = appState.products.find(p => p.id === productId);
  const index = appState.comparison.findIndex(p => p.id === productId);
  
  if (index > -1) {
    appState.comparison.splice(index, 1);
    showToast('Removed from comparison', 'info');
  } else {
    if (appState.comparison.length >= 3) {
      showToast('You can compare maximum 3 products', 'error');
      return;
    }
    appState.comparison.push(product);
    showToast('Added to comparison', 'success');
  }
  
  updateComparisonBar();
  saveState();
}

function updateComparisonBar() {
  const bar = document.getElementById('comparison-bar');
  const count = document.getElementById('comparison-count');
  
  if (!bar || !count) return;
  
  if (appState.comparison.length > 0) {
    bar.style.display = 'flex';
    count.textContent = appState.comparison.length;
  } else {
    bar.style.display = 'none';
  }
}

function clearComparison() {
  appState.comparison = [];
  updateComparisonBar();
  applyFilters();
  showToast('Comparison cleared', 'info');
}

function showComparisonModal() {
  if (appState.comparison.length < 2) {
    showToast('Please select at least 2 products to compare', 'error');
    return;
  }
  
  const modal = document.getElementById('comparison-modal');
  const content = document.getElementById('comparison-content');
  
  const attributes = [
    { key: 'name', label: 'Product Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'price', label: 'Price', format: (v) => `₹${v}` },
    { key: 'originalPrice', label: 'Original Price', format: (v) => `₹${v}` },
    { key: 'discount', label: 'Discount', format: (v) => `${v}%` },
    { key: 'rating', label: 'Rating', format: (v) => renderStars(v) + ` ${v}` },
    { key: 'reviewCount', label: 'Reviews' },
    { key: 'stock', label: 'Stock', format: (v) => v > 0 ? `${v} units` : 'Out of Stock' },
    { key: 'category', label: 'Category' }
  ];
  
  let html = '<table class="comparison-table"><thead><tr><th>Specification</th>';
  
  appState.comparison.forEach(product => {
    html += `
      <th>
        <div class="comparison-product">
          <div class="comparison-image">${product.images}</div>
          <div class="comparison-name">${product.name}</div>
          <div class="comparison-price">₹${product.price}</div>
          <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="btn btn-outline btn-small" onclick="removeFromComparison(${product.id})">Remove</button>
        </div>
      </th>
    `;
  });
  
  html += '</tr></thead><tbody>';
  
  attributes.forEach(attr => {
    html += `<tr><td><strong>${attr.label}</strong></td>`;
    
    const values = appState.comparison.map(p => {
      const val = p[attr.key];
      return attr.format ? attr.format(val) : val;
    });
    
    // Check if values differ
    const allSame = values.every(v => v === values[0]);
    
    values.forEach(val => {
      html += `<td class="${!allSame ? 'difference' : ''}">${val}</td>`;
    });
    
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  
  content.innerHTML = html;
  modal.classList.add('show');
}

function removeFromComparison(productId) {
  toggleComparison(productId);
  if (appState.comparison.length < 2) {
    closeModal('comparison-modal');
  } else {
    showComparisonModal();
  }
}

// ==================== CART ====================
function addToCart(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  
  const cartItem = appState.cart.find(item => item.productId === productId);
  
  if (cartItem) {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity++;
      showToast('Cart updated', 'success');
    } else {
      showToast('Maximum stock reached', 'error');
      return;
    }
  } else {
    appState.cart.push({ productId, quantity: 1 });
    showToast('Added to cart', 'success');
  }
  
  updateCartCount();
  saveState();
}

function updateCartQuantity(productId, delta) {
  const cartItem = appState.cart.find(item => item.productId === productId);
  const product = appState.products.find(p => p.id === productId);
  
  if (!cartItem || !product) return;
  
  const newQuantity = cartItem.quantity + delta;
  
  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else if (newQuantity <= product.stock) {
    cartItem.quantity = newQuantity;
    updateCartCount();
    renderCart();
    saveState();
  } else {
    showToast('Maximum stock reached', 'error');
  }
}

function removeFromCart(productId) {
  appState.cart = appState.cart.filter(item => item.productId !== productId);
  updateCartCount();
  renderCart();
  saveState();
  showToast('Item removed from cart', 'info');
}

function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const total = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'block' : 'none';
  }
}

function toggleCart() {
  showPage('cart');
}

function renderCart() {
  const container = document.getElementById('cart-content');
  if (!container) return;
  
  if (appState.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <button class="btn btn-primary" onclick="showPage('products')">Start Shopping</button>
      </div>
    `;
    return;
  }
  
  const cartProducts = appState.cart.map(item => {
    const product = appState.products.find(p => p.id === item.productId);
    return { ...product, quantity: item.quantity };
  });
  
  const subtotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const originalTotal = cartProducts.reduce((sum, p) => sum + (p.originalPrice * p.quantity), 0);
  const discount = originalTotal - subtotal;
  
  let couponDiscount = 0;
  if (appState.appliedCoupon) {
    const coupon = COUPONS[appState.appliedCoupon];
    if (coupon.type === 'percentage') {
      couponDiscount = (subtotal * coupon.discount) / 100;
    } else {
      couponDiscount = coupon.discount;
    }
  }
  
  const total = subtotal - couponDiscount;
  const totalSavings = discount + couponDiscount;
  
  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        <h3>Cart Items (${appState.cart.length})</h3>
        ${cartProducts.map(p => {
          const cartImage = Array.isArray(p.images) ? p.images[0] : p.images;
          return `
          <div class="cart-item">
            <div class="cart-item-image">${cartImage}</div>
            <div class="cart-item-info">
              <h4>${p.name}</h4>
              <div class="cart-item-brand">${p.brand}</div>
              <div class="cart-item-price">₹${p.price} × ${p.quantity} = ₹${p.price * p.quantity}</div>
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${p.id}, -1)">-</button>
                <span class="quantity-value">${p.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${p.id}, 1)">+</button>
              </div>
              <div class="cart-item-remove" onclick="removeFromCart(${p.id})">Remove</div>
            </div>
            <div class="cart-item-total">
              <strong>₹${p.price * p.quantity}</strong>
            </div>
          </div>
        `;
        }).join('')}
      </div>
      
      <div class="cart-summary">
        <h3>Order Summary</h3>
        
        <div class="coupon-section">
          <div class="coupon-input">
            <input type="text" id="coupon-code" placeholder="Enter coupon code" value="${appState.appliedCoupon || ''}">
            <button class="btn btn-primary btn-small" onclick="applyCoupon()">
              ${appState.appliedCoupon ? 'Remove' : 'Apply'}
            </button>
          </div>
          
          <div class="available-coupons">
            <h4>Available Coupons:</h4>
            ${Object.keys(COUPONS).map(code => {
              const coupon = COUPONS[code];
              return `
                <div class="coupon-item">
                  <div>
                    <span class="coupon-code">${code}</span>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                      ${coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                      on orders above ₹${coupon.minOrder}
                    </div>
                  </div>
                  <button class="btn btn-outline btn-small" onclick="document.getElementById('coupon-code').value='${code}'; applyCoupon();">Apply</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₹${subtotal}</span>
        </div>
        <div class="summary-row">
          <span>Discount:</span>
          <span class="savings">-₹${discount}</span>
        </div>
        ${couponDiscount > 0 ? `
          <div class="summary-row">
            <span>Coupon (${appState.appliedCoupon}):</span>
            <span class="savings">-₹${couponDiscount}</span>
          </div>
        ` : ''}
        <div class="summary-row total">
          <span>Total:</span>
          <span>₹${total}</span>
        </div>
        ${totalSavings > 0 ? `
          <div class="summary-row savings">
            <span>You Save:</span>
            <span>₹${totalSavings}</span>
          </div>
        ` : ''}
        
        <button class="btn btn-primary btn-block" onclick="proceedToCheckout()">Proceed to Checkout</button>
      </div>
    </div>
  `;
}

function applyCoupon() {
  const input = document.getElementById('coupon-code');
  const code = input.value.trim().toUpperCase();
  
  if (appState.appliedCoupon) {
    appState.appliedCoupon = null;
    input.value = '';
    showToast('Coupon removed', 'info');
    renderCart();
    return;
  }
  
  if (!code) {
    showToast('Please enter a coupon code', 'error');
    return;
  }
  
  const coupon = COUPONS[code];
  if (!coupon) {
    showToast('Invalid coupon code', 'error');
    return;
  }
  
  const subtotal = appState.cart.reduce((sum, item) => {
    const product = appState.products.find(p => p.id === item.productId);
    return sum + (product.price * item.quantity);
  }, 0);
  
  if (subtotal < coupon.minOrder) {
    showToast(`Minimum order value should be ₹${coupon.minOrder}`, 'error');
    return;
  }
  
  appState.appliedCoupon = code;
  showToast('Coupon applied successfully!', 'success');
  renderCart();
}

// ==================== CHECKOUT ====================
function proceedToCheckout() {
  if (appState.cart.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }
  
  if (!appState.currentUser && !appState.isGuest) {
    openModal('login-modal');
    return;
  }
  
  showPage('checkout');
  renderCheckout();
}

function proceedAsGuest() {
  appState.isGuest = true;
  closeModal('login-modal');
  showPage('checkout');
  renderCheckout();
}

function handleLogin() {
  const username = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  if (!username || !password) {
    showToast('Please fill all fields', 'error');
    return;
  }
  
  const user = appState.users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    showToast('Invalid username or password', 'error');
    return;
  }
  
  appState.currentUser = user;
  closeModal('login-modal');
  updateHeaderForUser();
  
  if (user.role === 'admin') {
    showToast('Welcome Admin!', 'success');
    showAdminDashboard();
  } else if (user.role === 'seller') {
    showToast(`Welcome ${user.shopName}!`, 'success');
    showSellerDashboard();
  } else {
    showToast('Logged in successfully', 'success');
    if (appState.cart.length > 0) {
      showPage('checkout');
      renderCheckout();
    } else {
      showPage('home');
    }
  }
}

function handleRegister() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  if (!name || !email || !password) {
    showToast('Please fill all fields', 'error');
    return;
  }
  
  appState.currentUser = { email, name };
  closeModal('login-modal');
  showToast('Account created successfully', 'success');
  showPage('checkout');
  renderCheckout();
}

function renderCheckout() {
  const container = document.getElementById('checkout-content');
  if (!container) return;
  
  const cartProducts = appState.cart.map(item => {
    const product = appState.products.find(p => p.id === item.productId);
    return { ...product, quantity: item.quantity };
  });
  
  const subtotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  let couponDiscount = 0;
  if (appState.appliedCoupon) {
    const coupon = COUPONS[appState.appliedCoupon];
    if (coupon.type === 'percentage') {
      couponDiscount = (subtotal * coupon.discount) / 100;
    } else {
      couponDiscount = coupon.discount;
    }
  }
  const total = subtotal - couponDiscount;
  
  container.innerHTML = `
    <div class="checkout-layout">
      <div>
        <div class="checkout-section">
          <h3>Delivery Address</h3>
          ${appState.addresses.length > 0 ? `
            <div class="address-list">
              ${appState.addresses.map((addr, i) => `
                <div class="address-card ${appState.selectedAddress === i ? 'selected' : ''}" onclick="selectAddress(${i})">
                  <span class="address-type">${addr.type}</span>
                  ${addr.isDefault ? '<span class="address-type" style="background: var(--success-color); color: white;">Default</span>' : ''}
                  <h4>${addr.name}</h4>
                  <p>
                    ${addr.line1}<br>
                    ${addr.line2 ? addr.line2 + '<br>' : ''}
                    ${addr.city}, ${addr.state} - ${addr.pin}<br>
                    Phone: ${addr.phone}
                  </p>
                  <div class="address-actions">
                    <button class="btn btn-outline btn-small" onclick="event.stopPropagation(); editAddress(${i})">Edit</button>
                    <button class="btn btn-outline btn-small" onclick="event.stopPropagation(); deleteAddress(${i})">Delete</button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color: var(--text-secondary); margin-bottom: 16px;">No saved addresses</p>'}
          <button class="btn btn-outline" onclick="openModal('address-modal')">+ Add New Address</button>
        </div>
        
        <div class="checkout-section">
          <h3>Payment Method</h3>
          <div class="payment-methods">
            ${PAYMENT_METHODS.map((method, i) => `
              <div class="payment-card ${appState.selectedPayment === i ? 'selected' : ''}" onclick="selectPayment(${i})">
                <div class="payment-icon">${method.icon}</div>
                <div class="payment-info">
                  <h4>${method.name}</h4>
                  ${method.providers.length > 0 ? `<div class="payment-providers">${method.providers.join(', ')}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="order-items">
          ${cartProducts.map(p => {
            const orderImage = Array.isArray(p.images) ? p.images[0] : p.images;
            return `
            <div class="order-item">
              <div class="order-item-image">${orderImage}</div>
              <div class="order-item-info">
                <div class="order-item-name">${p.name}</div>
                <div class="order-item-qty">Qty: ${p.quantity}</div>
              </div>
              <div class="order-item-price">₹${p.price * p.quantity}</div>
            </div>
          `;
          }).join('')}
        </div>
        
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₹${subtotal}</span>
        </div>
        ${couponDiscount > 0 ? `
          <div class="summary-row">
            <span>Coupon Discount:</span>
            <span class="savings">-₹${couponDiscount}</span>
          </div>
        ` : ''}
        <div class="summary-row total">
          <span>Total:</span>
          <span>₹${total}</span>
        </div>
        
        <button class="btn btn-primary btn-block" onclick="placeOrder()" ${!appState.selectedAddress || appState.selectedPayment === null ? 'disabled' : ''}>
          Place Order
        </button>
      </div>
    </div>
  `;
  
  // Setup address form
  setupAddressForm();
}

function setupAddressForm() {
  const form = document.getElementById('address-form');
  if (!form) return;
  
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const address = {
      name: document.getElementById('addr-name').value,
      phone: document.getElementById('addr-phone').value,
      line1: document.getElementById('addr-line1').value,
      line2: document.getElementById('addr-line2').value,
      city: document.getElementById('addr-city').value,
      state: document.getElementById('addr-state').value,
      pin: document.getElementById('addr-pin').value,
      type: document.getElementById('addr-type').value,
      isDefault: document.getElementById('addr-default').checked
    };
    
    if (address.isDefault) {
      appState.addresses.forEach(a => a.isDefault = false);
    }
    
    appState.addresses.push(address);
    appState.selectedAddress = appState.addresses.length - 1;
    
    closeModal('address-modal');
    renderCheckout();
    showToast('Address added successfully', 'success');
    
    form.reset();
  };
}

function selectAddress(index) {
  appState.selectedAddress = index;
  renderCheckout();
}

function selectPayment(index) {
  appState.selectedPayment = index;
  renderCheckout();
}

function deleteAddress(index) {
  if (confirm('Are you sure you want to delete this address?')) {
    appState.addresses.splice(index, 1);
    if (appState.selectedAddress === index) {
      appState.selectedAddress = null;
    }
    renderCheckout();
    showToast('Address deleted', 'info');
  }
}

function editAddress(index) {
  // Simplified - just delete and add new
  showToast('Please delete and add a new address', 'info');
}

function placeOrder() {
  if (!appState.selectedAddress || appState.selectedPayment === null) {
    showToast('Please select address and payment method', 'error');
    return;
  }
  
  const cartProducts = appState.cart.map(item => {
    const product = appState.products.find(p => p.id === item.productId);
    return { ...product, quantity: item.quantity };
  });
  
  const subtotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  let couponDiscount = 0;
  if (appState.appliedCoupon) {
    const coupon = COUPONS[appState.appliedCoupon];
    if (coupon.type === 'percentage') {
      couponDiscount = (subtotal * coupon.discount) / 100;
    } else {
      couponDiscount = coupon.discount;
    }
  }
  const total = subtotal - couponDiscount;
  
  const order = {
    id: 'ORD' + Date.now(),
    date: new Date().toLocaleDateString('en-IN'),
    products: cartProducts,
    address: appState.addresses[appState.selectedAddress],
    payment: PAYMENT_METHODS[appState.selectedPayment],
    subtotal: subtotal,
    discount: couponDiscount,
    total: total,
    status: 'Pending',
    trackingId: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    currentStage: 0,
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')
  };
  
  appState.orders.unshift(order);
  
  // Update product stock
  cartProducts.forEach(cp => {
    const product = appState.products.find(p => p.id === cp.id);
    if (product) {
      product.stock -= cp.quantity;
    }
  });
  
  // Clear cart
  appState.cart = [];
  appState.appliedCoupon = null;
  updateCartCount();
  saveState();
  
  // Show order confirmation
  showOrderConfirmation(order);
}

function showOrderConfirmation(order) {
  const container = document.getElementById('checkout-content');
  
  container.innerHTML = `
    <div style="text-align: center; padding: 60px 20px;">
      <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
      <h2 style="color: var(--success-color); margin-bottom: 16px;">Order Placed Successfully!</h2>
      <p style="font-size: 18px; margin-bottom: 8px;">Order ID: <strong>${order.id}</strong></p>
      <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 24px;">Tracking ID: ${order.trackingId}</p>
      <p style="font-size: 16px; margin-bottom: 32px;">Estimated Delivery: <strong>${order.estimatedDelivery}</strong></p>
      
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="showPage('orders')">View Orders</button>
        <button class="btn btn-outline" onclick="trackOrder('${order.id}')">Track Order</button>
        <button class="btn btn-secondary" onclick="downloadInvoice('${order.id}')">Download Invoice</button>
      </div>
    </div>
  `;
  
  // Show notification
  setTimeout(() => {
    showToast('Order confirmation email sent!', 'success');
  }, 1000);
}

// ==================== ORDERS ====================
function renderOrders() {
  const container = document.getElementById('orders-list');
  if (!container) return;
  
  if (appState.orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📦</div>
        <h3>No orders yet</h3>
        <p>Start shopping to see your orders here</p>
        <button class="btn btn-primary" onclick="showPage('products')">Start Shopping</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = appState.orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">Order ID: ${order.id}</div>
          <div class="order-date">Placed on: ${order.date}</div>
        </div>
        <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
      </div>
      
      <div class="order-products">
        ${order.products.map(p => {
          const orderProdImage = Array.isArray(p.images) ? p.images[0] : p.images;
          return `
          <div class="order-product">
            <div class="order-product-image">${orderProdImage}</div>
            <div style="flex: 1;">
              <div class="order-product-name">${p.name}</div>
              <div class="order-product-qty">Quantity: ${p.quantity}</div>
            </div>
            <div style="font-weight: bold;">₹${p.price * p.quantity}</div>
          </div>
        `;
        }).join('')}
      </div>
      
      <div class="order-footer">
        <div class="order-total">Total: ₹${order.total}</div>
        <div class="order-actions">
          <button class="btn btn-primary btn-small" onclick="trackOrder('${order.id}')">Track Order</button>
          <button class="btn btn-outline btn-small" onclick="downloadInvoice('${order.id}')">Invoice</button>
          ${order.status === 'Pending' ? `<button class="btn btn-secondary btn-small" onclick="cancelOrder('${order.id}')">Cancel</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  
  const order = appState.orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'Cancelled';
    renderOrders();
    showToast('Order cancelled. Refund will be processed within 5-7 business days.', 'info');
  }
}

function trackOrder(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  const container = document.getElementById('tracking-content');
  
  // Simulate tracking stages
  if (order.status === 'Pending') order.currentStage = 0;
  else if (order.status === 'Confirmed') order.currentStage = 1;
  else if (order.status === 'Shipped') order.currentStage = 2;
  else if (order.status === 'Delivered') order.currentStage = 4;
  
  container.innerHTML = `
    <div class="tracking-container">
      <div class="tracking-header">
        <h2>Order: ${order.id}</h2>
        <div class="tracking-id">Tracking ID: ${order.trackingId}</div>
        <div class="delivery-estimate">Estimated Delivery: ${order.estimatedDelivery}</div>
      </div>
      
      <div class="tracking-timeline">
        ${TRACKING_STAGES.map((stage, i) => `
          <div class="timeline-item ${i <= order.currentStage ? 'completed' : ''} ${i === order.currentStage ? 'active' : ''}">
            <div class="timeline-icon">${stage.icon}</div>
            <div class="timeline-content">
              <h4>${stage.stage}</h4>
              <p>${stage.description}</p>
              ${i === order.currentStage ? '<div class="timeline-date">Current Status</div>' : ''}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="courier-info">
        <h4>Courier Details</h4>
        <div class="courier-detail">
          <span>Partner:</span>
          <strong>BlueDart Express</strong>
        </div>
        <div class="courier-detail">
          <span>AWB Number:</span>
          <strong>${order.trackingId}</strong>
        </div>
        <div class="courier-detail">
          <span>Contact:</span>
          <strong>1800-123-4567</strong>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button class="btn btn-outline" onclick="showPage('orders')">Back to Orders</button>
      </div>
    </div>
  `;
  
  showPage('tracking');
}

function downloadInvoice(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  showToast('Invoice download started', 'success');
  
  // In a real app, this would generate and download a PDF
  console.log('Invoice for order:', orderId);
}

// ==================== RECENTLY VIEWED ====================
function renderRecentlyViewed() {
  const container = document.getElementById('recently-viewed-products');
  const header = document.getElementById('recently-viewed-header');
  
  if (!container || !header) return;
  
  if (appState.recentlyViewed.length === 0) {
    header.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  
  header.style.display = 'flex';
  
  const products = appState.recentlyViewed
    .map(id => appState.products.find(p => p.id === id))
    .filter(p => p)
    .slice(0, 4);
  
  container.innerHTML = products.map(p => renderProductCard(p)).join('');
}

// ==================== QUICK VIEW ====================
function showQuickView(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  const inWishlist = appState.wishlist.includes(productId);
  
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="background: var(--background-color); border-radius: 8px; padding: 40px; text-align: center;">
        <div style="font-size: 120px;">${product.images}</div>
      </div>
      
      <div>
        <h3>${product.name}</h3>
        <div style="color: var(--text-secondary); margin-bottom: 12px;">${product.brand}</div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <span class="stars">${renderStars(product.rating)}</span>
          <span style="font-size: 14px; color: var(--text-secondary);">(${product.reviewCount})</span>
        </div>
        
        <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px;">
          <span style="font-size: 28px; font-weight: bold;">₹${product.price}</span>
          <span style="font-size: 16px; color: var(--text-secondary); text-decoration: line-through;">₹${product.originalPrice}</span>
          <span style="color: var(--success-color); font-weight: 500;">${product.discount}% OFF</span>
        </div>
        
        <div class="product-stock ${product.stock === 0 ? 'out-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}" style="margin-bottom: 20px;">
          ${product.stock === 0 ? '❌ Out of Stock' : product.stock < 10 ? `⚠️ Only ${product.stock} left` : '✓ In Stock'}
        </div>
        
        <p style="margin-bottom: 20px; color: var(--text-secondary);">${product.description}</p>
        
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary" style="flex: 1;" onclick="addToCart(${product.id}); closeModal('quick-view-modal');" ${product.stock === 0 ? 'disabled' : ''}>Add to Cart</button>
          <button class="btn btn-outline" onclick="toggleWishlist(${product.id}); closeModal('quick-view-modal');">
            ${inWishlist ? '❤️' : '🤍'}
          </button>
        </div>
        
        <button class="btn btn-secondary" style="width: 100%; margin-top: 12px;" onclick="showProductDetail(${product.id}); closeModal('quick-view-modal');">View Full Details</button>
      </div>
    </div>
  `;
  
  modal.classList.add('show');
}

// ==================== MODALS ====================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

function showAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
  
  if (tab === 'login') {
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.getElementById('login-form').style.display = 'flex';
  } else {
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.getElementById('register-form').style.display = 'flex';
  }
}

// Close modals on outside click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-message">${message}</div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('show');
}

function toggleAccountMenu() {
  if (appState.currentUser) {
    showPage('orders');
  } else {
    openModal('login-modal');
  }
}

// ==================== AUTHENTICATION ====================
function updateHeaderForUser() {
  const accountBtn = document.querySelector('.header-btn:last-child .label');
  if (accountBtn) {
    if (appState.currentUser) {
      accountBtn.textContent = appState.currentUser.name || appState.currentUser.username;
    } else {
      accountBtn.textContent = 'Account';
    }
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    appState.currentUser = null;
    appState.isGuest = false;
    updateHeaderForUser();
    showPage('home');
    showToast('Logged out successfully', 'info');
  }
}

function canEditProduct(productId) {
  if (!appState.currentUser) return false;
  if (appState.currentUser.role === 'admin') return true;
  
  const product = appState.products.find(p => p.id === productId);
  return product && appState.currentUser.role === 'seller' && product.sellerId === appState.currentUser.sellerId;
}

function canDeleteProduct(productId) {
  return canEditProduct(productId);
}

// ==================== ADMIN DASHBOARD ====================
function showAdminDashboard() {
  const main = document.querySelector('.main-content');
  main.innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-profile">
          <div class="admin-avatar">👤</div>
          <div class="admin-name">${appState.currentUser.name}</div>
          <div class="admin-role">Administrator</div>
        </div>
        <nav class="admin-nav">
          <a href="#" class="admin-nav-item active" onclick="setAdminView('dashboard')">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a href="#" class="admin-nav-item" onclick="setAdminView('products')">
            <span class="nav-icon">📦</span> Products
          </a>
          <a href="#" class="admin-nav-item" onclick="setAdminView('stock')">
            <span class="nav-icon">📈</span> Stock Management
          </a>
          <a href="#" class="admin-nav-item" onclick="setAdminView('orders')">
            <span class="nav-icon">🛍️</span> Orders
          </a>
          <a href="#" class="admin-nav-item" onclick="setAdminView('sellers')">
            <span class="nav-icon">🏪</span> Sellers
          </a>
          <a href="#" class="admin-nav-item" onclick="setAdminView('users')">
            <span class="nav-icon">👥</span> Users
          </a>
          <a href="#" class="admin-nav-item" onclick="setAdminView('settings')">
            <span class="nav-icon">⚙️</span> Settings
          </a>
          <a href="#" class="admin-nav-item" onclick="showPage('home')">
            <span class="nav-icon">🏠</span> Back to Store
          </a>
          <a href="#" class="admin-nav-item" onclick="logout()">
            <span class="nav-icon">🚪</span> Logout
          </a>
        </nav>
      </aside>
      <main class="admin-content" id="admin-content"></main>
    </div>
  `;
  renderAdminDashboard();
}

function setAdminView(view) {
  appState.adminView = view;
  document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
  event.target.closest('.admin-nav-item').classList.add('active');
  
  switch(view) {
    case 'dashboard': renderAdminDashboard(); break;
    case 'products': renderAdminProducts(); break;
    case 'stock': renderAdminStock(); break;
    case 'orders': renderAdminOrders(); break;
    case 'sellers': renderAdminSellers(); break;
    case 'users': renderAdminUsers(); break;
    case 'settings': renderAdminSettings(); break;
  }
}

function renderAdminDashboard() {
  const totalProducts = appState.products.length;
  const lowStock = appState.products.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStock = appState.products.filter(p => p.stock === 0).length;
  const totalOrders = appState.orders.length;
  const totalRevenue = appState.orders.reduce((sum, o) => sum + o.total, 0);
  
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-header">
      <h1>Dashboard Overview</h1>
      <p>Welcome back, ${appState.currentUser.name}!</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-1);">📦</div>
        <div class="stat-info">
          <div class="stat-value">${totalProducts}</div>
          <div class="stat-label">Total Products</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-2);">🛍️</div>
        <div class="stat-info">
          <div class="stat-value">${totalOrders}</div>
          <div class="stat-label">Total Orders</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-3);">💰</div>
        <div class="stat-info">
          <div class="stat-value">₹${totalRevenue.toLocaleString()}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-4);">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${lowStock}</div>
          <div class="stat-label">Low Stock Items</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-5);">❌</div>
        <div class="stat-info">
          <div class="stat-value">${outOfStock}</div>
          <div class="stat-label">Out of Stock</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-6);">🏪</div>
        <div class="stat-info">
          <div class="stat-value">${appState.sellers.length}</div>
          <div class="stat-label">Active Sellers</div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-section">
      <h2>Recent Orders</h2>
      <div class="table-container">
        ${appState.orders.length > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${appState.orders.slice(0, 5).map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.date}</td>
                  <td>Customer</td>
                  <td>${order.products.length}</td>
                  <td>₹${order.total}</td>
                  <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="empty-message">No orders yet</p>'}
      </div>
    </div>
    
    <div class="dashboard-section">
      <h2>Stock Alerts</h2>
      <div class="table-container">
        ${lowStock + outOfStock > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${appState.products.filter(p => p.stock < 10).slice(0, 10).map(product => `
                <tr>
                  <td><div class="table-product-image">${Array.isArray(product.images) ? product.images[0] : product.images}</div></td>
                  <td>${product.name}</td>
                  <td>${product.category}</td>
                  <td><strong>${product.stock}</strong></td>
                  <td>
                    <span class="status-badge ${product.stock === 0 ? 'out-stock' : 'low-stock'}">
                      ${product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td><button class="btn btn-primary btn-small" onclick="openEditStockModal(${product.id})">Update Stock</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="empty-message">All products are well stocked!</p>'}
      </div>
    </div>
  `;
}

function renderAdminProducts() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-header">
      <div>
        <h1>Product Management</h1>
        <p>Manage all products in your store</p>
      </div>
      <button class="btn btn-primary" onclick="openAddProductModal()">+ Add New Product</button>
    </div>
    
    <div class="admin-filters">
      <input type="text" placeholder="Search products..." id="admin-search" oninput="filterAdminProducts()">
      <select id="admin-category-filter" onchange="filterAdminProducts()">
        <option value="">All Categories</option>
        <option value="Power Tools">Power Tools</option>
        <option value="Hand Tools">Hand Tools</option>
        <option value="Electrical Appliances">Electrical Appliances</option>
        <option value="Hardware & Fasteners">Hardware &amp; Fasteners</option>
        <option value="Spare Parts">Spare Parts</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Painting Supplies">Painting Supplies</option>
        <option value="Safety Equipment">Safety Equipment</option>
      </select>
      <select id="admin-seller-filter" onchange="filterAdminProducts()">
        <option value="">All Sellers</option>
        ${appState.sellers.map(s => `<option value="${s.sellerId}">${s.shopName}</option>`).join('')}
      </select>
    </div>
    
    <div class="table-container" id="products-table-container"></div>
  `;
  
  filterAdminProducts();
}

function filterAdminProducts() {
  const search = document.getElementById('admin-search')?.value.toLowerCase() || '';
  const category = document.getElementById('admin-category-filter')?.value || '';
  const seller = document.getElementById('admin-seller-filter')?.value || '';
  
  let filtered = appState.products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search) && !p.brand.toLowerCase().includes(search)) return false;
    if (category && p.category !== category) return false;
    if (seller && p.sellerId !== parseInt(seller)) return false;
    return true;
  });
  
  const container = document.getElementById('products-table-container');
  if (!container) return;
  
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Seller</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(product => {
          const seller = appState.sellers.find(s => s.sellerId === product.sellerId);
          return `
            <tr>
              <td><div class="table-product-image">${Array.isArray(product.images) ? product.images[0] : product.images}</div></td>
              <td><strong>${product.name}</strong></td>
              <td>${product.brand}</td>
              <td>${product.category}</td>
              <td>₹${product.price}</td>
              <td>
                <span class="stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'good'}">
                  ${product.stock}
                </span>
              </td>
              <td>${seller ? seller.shopName : 'Unknown'}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-outline btn-small" onclick="openEditProductModal(${product.id})" title="Edit">✏️</button>
                  <button class="btn btn-outline btn-small" onclick="openEditStockModal(${product.id})" title="Edit Stock">📊</button>
                  <button class="btn btn-outline btn-small" onclick="deleteProduct(${product.id})" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function openAddProductModal() {
  appState.editingProductId = null;
  showProductFormModal();
}

function openEditProductModal(productId) {
  if (!canEditProduct(productId)) {
    showToast('You do not have permission to edit this product', 'error');
    return;
  }
  appState.editingProductId = productId;
  showProductFormModal();
}

function showProductFormModal() {
  const product = appState.editingProductId ? appState.products.find(p => p.id === appState.editingProductId) : null;
  const isEdit = !!product;
  
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.id = 'product-form-modal';
  
  modal.innerHTML = `
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>${isEdit ? 'Edit Product' : 'Add New Product'}</h3>
        <button class="modal-close" onclick="closeProductFormModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="product-form" class="product-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Product Name *</label>
              <input type="text" class="form-input" id="prod-name" value="${isEdit ? product.name : ''}" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Brand *</label>
              <input type="text" class="form-input" id="prod-brand" value="${isEdit ? product.brand : ''}" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-input" id="prod-category" required>
                <option value="">Select Category</option>
                <option value="Power Tools" ${isEdit && product.category === 'Power Tools' ? 'selected' : ''}>Power Tools</option>
                <option value="Hand Tools" ${isEdit && product.category === 'Hand Tools' ? 'selected' : ''}>Hand Tools</option>
                <option value="Electrical Appliances" ${isEdit && product.category === 'Electrical Appliances' ? 'selected' : ''}>Electrical Appliances</option>
                <option value="Hardware & Fasteners" ${isEdit && product.category === 'Hardware & Fasteners' ? 'selected' : ''}>Hardware &amp; Fasteners</option>
                <option value="Spare Parts" ${isEdit && product.category === 'Spare Parts' ? 'selected' : ''}>Spare Parts</option>
                <option value="Plumbing" ${isEdit && product.category === 'Plumbing' ? 'selected' : ''}>Plumbing</option>
                <option value="Painting Supplies" ${isEdit && product.category === 'Painting Supplies' ? 'selected' : ''}>Painting Supplies</option>
                <option value="Safety Equipment" ${isEdit && product.category === 'Safety Equipment' ? 'selected' : ''}>Safety Equipment</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Original Price (₹) *</label>
              <input type="number" class="form-input" id="prod-original-price" value="${isEdit ? product.originalPrice : ''}" required min="0">
            </div>
            
            <div class="form-group">
              <label class="form-label">Selling Price (₹) *</label>
              <input type="number" class="form-input" id="prod-price" value="${isEdit ? product.price : ''}" required min="0">
            </div>
            
            <div class="form-group">
              <label class="form-label">Stock Quantity *</label>
              <input type="number" class="form-input" id="prod-stock" value="${isEdit ? product.stock : ''}" required min="0">
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="prod-description" rows="3">${isEdit ? product.description : ''}</textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Product Images (Emojis/Icons)</label>
            <input type="text" class="form-input" id="prod-images" placeholder="Enter emojis separated by commas (e.g., 🔧,🔨,⚡)" value="${isEdit && Array.isArray(product.images) ? product.images.join(',') : (isEdit ? product.images : '')}">
            <small style="color: var(--text-secondary);">Enter emojis or text icons separated by commas</small>
          </div>
          
          ${appState.currentUser.role === 'admin' ? `
            <div class="form-group">
              <label class="form-label">Assign to Seller</label>
              <select class="form-input" id="prod-seller">
                ${appState.sellers.map(s => `
                  <option value="${s.sellerId}" ${isEdit && product.sellerId === s.sellerId ? 'selected' : ''}>
                    ${s.shopName}
                  </option>
                `).join('')}
              </select>
            </div>
          ` : ''}
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeProductFormModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Product' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('product-form').onsubmit = (e) => {
    e.preventDefault();
    saveProduct();
  };
}

function closeProductFormModal() {
  const modal = document.getElementById('product-form-modal');
  if (modal) modal.remove();
}

function saveProduct() {
  const name = document.getElementById('prod-name').value;
  const brand = document.getElementById('prod-brand').value;
  const category = document.getElementById('prod-category').value;
  const originalPrice = parseInt(document.getElementById('prod-original-price').value);
  const price = parseInt(document.getElementById('prod-price').value);
  const stock = parseInt(document.getElementById('prod-stock').value);
  const description = document.getElementById('prod-description').value;
  const imagesInput = document.getElementById('prod-images').value;
  const images = imagesInput ? imagesInput.split(',').map(i => i.trim()) : ['🔧'];
  
  const sellerId = appState.currentUser.role === 'admin' 
    ? parseInt(document.getElementById('prod-seller').value)
    : appState.currentUser.sellerId;
  
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  
  if (appState.editingProductId) {
    const product = appState.products.find(p => p.id === appState.editingProductId);
    if (product) {
      Object.assign(product, {
        name, brand, category, originalPrice, price, stock, description, images, sellerId, discount
      });
      showToast('Product updated successfully!', 'success');
    }
  } else {
    const newProduct = {
      id: Math.max(...appState.products.map(p => p.id)) + 1,
      name, brand, category, originalPrice, price, stock, description, images, sellerId, discount,
      rating: 4.0,
      reviewCount: 0,
      features: ['Premium Quality', 'Durable Construction', 'Easy to Use', 'Long Lasting'],
      isNew: true,
      visible: true
    };
    appState.products.push(newProduct);
    showToast('Product added successfully!', 'success');
  }
  
  closeProductFormModal();
  
  if (appState.currentUser.role === 'admin') {
    filterAdminProducts();
  } else {
    filterSellerProducts();
  }
}

function deleteProduct(productId) {
  if (!canDeleteProduct(productId)) {
    showToast('You do not have permission to delete this product', 'error');
    return;
  }
  
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
  
  appState.products = appState.products.filter(p => p.id !== productId);
  showToast('Product deleted successfully', 'success');
  
  if (appState.currentUser.role === 'admin') {
    filterAdminProducts();
  } else {
    filterSellerProducts();
  }
}

function renderAdminStock() {
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="admin-header">
      <div>
        <h1>Stock Management</h1>
        <p>Monitor and update product stock levels</p>
      </div>
      <div class="admin-filters">
        <select id="stock-filter" onchange="filterStockView()">
          <option value="all">All Products</option>
          <option value="low">Low Stock (&lt; 10)</option>
          <option value="out">Out of Stock</option>
          <option value="good">Well Stocked</option>
        </select>
      </div>
    </div>
    
    <div class="table-container" id="stock-table-container"></div>
  `;
  
  filterStockView();
}

function filterStockView() {
  const filter = document.getElementById('stock-filter')?.value || 'all';
  
  let filtered = appState.products;
  
  if (filter === 'low') {
    filtered = appState.products.filter(p => p.stock < 10 && p.stock > 0);
  } else if (filter === 'out') {
    filtered = appState.products.filter(p => p.stock === 0);
  } else if (filter === 'good') {
    filtered = appState.products.filter(p => p.stock >= 10);
  }
  
  const container = document.getElementById('stock-table-container');
  if (!container) return;
  
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>Current Stock</th>
          <th>Stock Status</th>
          <th>Seller</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(product => {
          const seller = appState.sellers.find(s => s.sellerId === product.sellerId);
          return `
            <tr>
              <td><div class="table-product-image">${Array.isArray(product.images) ? product.images[0] : product.images}</div></td>
              <td><strong>${product.name}</strong></td>
              <td>${product.category}</td>
              <td><strong class="stock-number">${product.stock}</strong></td>
              <td>
                <span class="stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'good'}">
                  ${product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
                </span>
              </td>
              <td>${seller ? seller.shopName : 'Unknown'}</td>
              <td>
                <button class="btn btn-primary btn-small" onclick="openEditStockModal(${product.id})">Update Stock</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function openEditStockModal(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.id = 'stock-modal';
  
  modal.innerHTML = `
    <div class="modal-content modal-small">
      <div class="modal-header">
        <h3>Update Stock</h3>
        <button class="modal-close" onclick="closeStockModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="stock-modal-product">
          <div class="stock-modal-image">${Array.isArray(product.images) ? product.images[0] : product.images}</div>
          <div>
            <strong>${product.name}</strong>
            <div style="color: var(--text-secondary); font-size: 14px;">Current Stock: ${product.stock}</div>
          </div>
        </div>
        
        <div class="form-group" style="margin-top: 20px;">
          <label class="form-label">New Stock Quantity</label>
          <input type="number" class="form-input" id="new-stock" value="${product.stock}" min="0">
        </div>
        
        <div class="form-actions">
          <button class="btn btn-secondary" onclick="closeStockModal()">Cancel</button>
          <button class="btn btn-primary" onclick="updateStock(${productId})">Update Stock</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function closeStockModal() {
  const modal = document.getElementById('stock-modal');
  if (modal) modal.remove();
}

function updateStock(productId) {
  const newStock = parseInt(document.getElementById('new-stock').value);
  
  if (newStock < 0) {
    showToast('Stock cannot be negative', 'error');
    return;
  }
  
  const product = appState.products.find(p => p.id === productId);
  if (product) {
    product.stock = newStock;
    showToast('Stock updated successfully!', 'success');
    closeStockModal();
    
    if (appState.adminView === 'stock') {
      filterStockView();
    } else if (appState.adminView === 'dashboard') {
      renderAdminDashboard();
    } else if (appState.currentUser.role === 'seller') {
      filterSellerStock();
    }
  }
}

function renderAdminOrders() {
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="admin-header">
      <h1>Order Management</h1>
      <p>View and manage all orders</p>
    </div>
    
    <div class="table-container">
      ${appState.orders.length > 0 ? `
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${appState.orders.map(order => `
              <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.date}</td>
                <td>${order.products.length}</td>
                <td>₹${order.total}</td>
                <td>${order.payment.name}</td>
                <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                <td>
                  <button class="btn btn-outline btn-small" onclick="viewOrderDetails('${order.id}')">View</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p class="empty-message">No orders yet</p>'}
    </div>
  `;
}

function viewOrderDetails(orderId) {
  trackOrder(orderId);
}

function renderAdminSellers() {
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="admin-header">
      <h1>Seller Management</h1>
      <p>Manage sellers and their shops</p>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Seller ID</th>
            <th>Shop Name</th>
            <th>Owner Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${appState.sellers.map(seller => {
            const productCount = appState.products.filter(p => p.sellerId === seller.sellerId).length;
            return `
              <tr>
                <td>${seller.sellerId}</td>
                <td><strong>${seller.shopName}</strong></td>
                <td>${seller.name}</td>
                <td>${seller.email}</td>
                <td>${seller.contact}</td>
                <td>${productCount}</td>
                <td><span class="status-badge ${seller.approved ? 'confirmed' : 'pending'}">${seller.approved ? 'Approved' : 'Pending'}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminUsers() {
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="admin-header">
      <h1>User Management</h1>
      <p>Manage all registered users</p>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          ${appState.users.map(user => `
            <tr>
              <td>${user.id}</td>
              <td>${user.username}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td><span class="role-badge ${user.role}">${user.role}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminSettings() {
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="admin-header">
      <h1>Admin Settings</h1>
      <p>Manage your account settings</p>
    </div>
    
    <div class="settings-container">
      <div class="settings-card">
        <h3>Change Username</h3>
        <form id="username-form">
          <div class="form-group">
            <label class="form-label">New Username</label>
            <input type="text" class="form-input" id="new-username" value="${appState.currentUser.username}">
          </div>
          <button type="submit" class="btn btn-primary">Update Username</button>
        </form>
      </div>
      
      <div class="settings-card">
        <h3>Change Password</h3>
        <form id="password-form">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <input type="password" class="form-input" id="current-password" required>
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" class="form-input" id="new-password" required>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input type="password" class="form-input" id="confirm-password" required>
          </div>
          <button type="submit" class="btn btn-primary">Change Password</button>
        </form>
      </div>
      
      <div class="settings-card">
        <h3>Account Information</h3>
        <div class="info-row">
          <span>Email:</span>
          <strong>${appState.currentUser.email}</strong>
        </div>
        <div class="info-row">
          <span>Role:</span>
          <strong>${appState.currentUser.role}</strong>
        </div>
        <div class="info-row">
          <span>User ID:</span>
          <strong>${appState.currentUser.id}</strong>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('username-form').onsubmit = (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('new-username').value.trim();
    if (newUsername) {
      appState.currentUser.username = newUsername;
      showToast('Username updated successfully!', 'success');
    }
  };
  
  document.getElementById('password-form').onsubmit = (e) => {
    e.preventDefault();
    const current = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;
    
    if (current !== appState.currentUser.password) {
      showToast('Current password is incorrect', 'error');
      return;
    }
    
    if (newPass !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (newPass.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    appState.currentUser.password = newPass;
    showToast('Password changed successfully!', 'success');
    document.getElementById('password-form').reset();
  };
}

// ==================== SELLER DASHBOARD ====================
function showSellerDashboard() {
  const main = document.querySelector('.main-content');
  main.innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar seller-sidebar">
        <div class="admin-profile">
          <div class="admin-avatar">🏪</div>
          <div class="admin-name">${appState.currentUser.shopName}</div>
          <div class="admin-role">Seller Account</div>
        </div>
        <nav class="admin-nav">
          <a href="#" class="admin-nav-item active" onclick="setSellerView('dashboard')">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a href="#" class="admin-nav-item" onclick="setSellerView('products')">
            <span class="nav-icon">📦</span> My Products
          </a>
          <a href="#" class="admin-nav-item" onclick="setSellerView('stock')">
            <span class="nav-icon">📈</span> Stock Management
          </a>
          <a href="#" class="admin-nav-item" onclick="setSellerView('orders')">
            <span class="nav-icon">🛍️</span> My Orders
          </a>
          <a href="#" class="admin-nav-item" onclick="setSellerView('settings')">
            <span class="nav-icon">⚙️</span> Settings
          </a>
          <a href="#" class="admin-nav-item" onclick="showPage('home')">
            <span class="nav-icon">🏠</span> Back to Store
          </a>
          <a href="#" class="admin-nav-item" onclick="logout()">
            <span class="nav-icon">🚪</span> Logout
          </a>
        </nav>
      </aside>
      <main class="admin-content" id="admin-content"></main>
    </div>
  `;
  renderSellerDashboard();
}

function setSellerView(view) {
  appState.adminView = view;
  document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
  event.target.closest('.admin-nav-item').classList.add('active');
  
  switch(view) {
    case 'dashboard': renderSellerDashboard(); break;
    case 'products': renderSellerProducts(); break;
    case 'stock': renderSellerStock(); break;
    case 'orders': renderSellerOrders(); break;
    case 'settings': renderSellerSettings(); break;
  }
}

function renderSellerDashboard() {
  const myProducts = appState.products.filter(p => p.sellerId === appState.currentUser.sellerId);
  const lowStock = myProducts.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStock = myProducts.filter(p => p.stock === 0).length;
  const myOrders = appState.orders.filter(o => o.products.some(p => {
    const product = appState.products.find(prod => prod.id === p.id);
    return product && product.sellerId === appState.currentUser.sellerId;
  }));
  const myRevenue = myOrders.reduce((sum, o) => sum + o.total, 0);
  
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-header">
      <h1>Seller Dashboard</h1>
      <p>Welcome back, ${appState.currentUser.shopName}!</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-1);">📦</div>
        <div class="stat-info">
          <div class="stat-value">${myProducts.length}</div>
          <div class="stat-label">My Products</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-2);">🛍️</div>
        <div class="stat-info">
          <div class="stat-value">${myOrders.length}</div>
          <div class="stat-label">My Orders</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-3);">💰</div>
        <div class="stat-info">
          <div class="stat-value">₹${myRevenue.toLocaleString()}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-bg-4);">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${lowStock}</div>
          <div class="stat-label">Low Stock Items</div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-section">
      <h2>My Products - Stock Alerts</h2>
      <div class="table-container">
        ${lowStock + outOfStock > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${myProducts.filter(p => p.stock < 10).map(product => `
                <tr>
                  <td><div class="table-product-image">${Array.isArray(product.images) ? product.images[0] : product.images}</div></td>
                  <td>${product.name}</td>
                  <td>${product.category}</td>
                  <td><strong>${product.stock}</strong></td>
                  <td>
                    <span class="status-badge ${product.stock === 0 ? 'out-stock' : 'low-stock'}">
                      ${product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td><button class="btn btn-primary btn-small" onclick="openEditStockModal(${product.id})">Update</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="empty-message">All your products are well stocked!</p>'}
      </div>
    </div>
  `;
}

function renderSellerProducts() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-header">
      <div>
        <h1>My Products</h1>
        <p>Manage your product catalog</p>
      </div>
      <button class="btn btn-primary" onclick="openAddProductModal()">+ Add New Product</button>
    </div>
    
    <div class="admin-filters">
      <input type="text" placeholder="Search my products..." id="seller-search" oninput="filterSellerProducts()">
      <select id="seller-category-filter" onchange="filterSellerProducts()">
        <option value="">All Categories</option>
        <option value="Power Tools">Power Tools</option>
        <option value="Hand Tools">Hand Tools</option>
        <option value="Electrical Appliances">Electrical Appliances</option>
        <option value="Hardware & Fasteners">Hardware &amp; Fasteners</option>
        <option value="Spare Parts">Spare Parts</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Painting Supplies">Painting Supplies</option>
        <option value="Safety Equipment">Safety Equipment</option>
      </select>
    </div>
    
    <div class="table-container" id="seller-products-table"></div>
  `;
  
  filterSellerProducts();
}

function filterSellerProducts() {
  const search = document.getElementById('seller-search')?.value.toLowerCase() || '';
  const category = document.getElementById('seller-category-filter')?.value || '';
  
  let myProducts = appState.products.filter(p => p.sellerId === appState.currentUser.sellerId);
  
  if (search) {
    myProducts = myProducts.filter(p => 
      p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search)
    );
  }
  
  if (category) {
    myProducts = myProducts.filter(p => p.category === category);
  }
  
  const container = document.getElementById('seller-products-table');
  if (!container) return;
  
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${myProducts.map(product => `
          <tr>
            <td><div class="table-product-image">${Array.isArray(product.images) ? product.images[0] : product.images}</div></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.brand}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>
              <span class="stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'good'}">
                ${product.stock}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-outline btn-small" onclick="openEditProductModal(${product.id})" title="Edit">✏️</button>
                <button class="btn btn-outline btn-small" onclick="openEditStockModal(${product.id})" title="Edit Stock">📊</button>
                <button class="btn btn-outline btn-small" onclick="deleteProduct(${product.id})" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderSellerStock() {
  const myProducts = appState.products.filter(p => p.sellerId === appState.currentUser.sellerId);
  
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-header">
      <div>
        <h1>Stock Management</h1>
        <p>Monitor and update your product stock</p>
      </div>
      <div class="admin-filters">
        <select id="seller-stock-filter" onchange="filterSellerStock()">
          <option value="all">All Products</option>
          <option value="low">Low Stock (&lt; 10)</option>
          <option value="out">Out of Stock</option>
          <option value="good">Well Stocked</option>
        </select>
      </div>
    </div>
    
    <div class="table-container" id="seller-stock-table"></div>
  `;
  
  filterSellerStock();
}

function filterSellerStock() {
  const filter = document.getElementById('seller-stock-filter')?.value || 'all';
  let myProducts = appState.products.filter(p => p.sellerId === appState.currentUser.sellerId);
  
  if (filter === 'low') {
    myProducts = myProducts.filter(p => p.stock < 10 && p.stock > 0);
  } else if (filter === 'out') {
    myProducts = myProducts.filter(p => p.stock === 0);
  } else if (filter === 'good') {
    myProducts = myProducts.filter(p => p.stock >= 10);
  }
  
  const container = document.getElementById('seller-stock-table');
  if (!container) return;
  
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>Current Stock</th>
          <th>Stock Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${myProducts.map(product => `
          <tr>
            <td><div class="table-product-image">${Array.isArray(product.images) ? product.images[0] : product.images}</div></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td><strong class="stock-number">${product.stock}</strong></td>
            <td>
              <span class="stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'good'}">
                ${product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
              </span>
            </td>
            <td>
              <button class="btn btn-primary btn-small" onclick="openEditStockModal(${product.id})">Update Stock</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderSellerOrders() {
  const myOrders = appState.orders.filter(o => o.products.some(p => {
    const product = appState.products.find(prod => prod.id === p.id);
    return product && product.sellerId === appState.currentUser.sellerId;
  }));
  
  const content = document.getElementById('admin-content');
  content.innerHTML = `
    <div class="admin-header">
      <h1>My Orders</h1>
      <p>Orders containing your products</p>
    </div>
    
    <div class="table-container">
      ${myOrders.length > 0 ? `
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>My Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${myOrders.map(order => {
              const myItems = order.products.filter(p => {
                const product = appState.products.find(prod => prod.id === p.id);
                return product && product.sellerId === appState.currentUser.sellerId;
              });
              return `
                <tr>
                  <td><strong>${order.id}</strong></td>
                  <td>${order.date}</td>
                  <td>${myItems.length}</td>
                  <td>₹${order.total}</td>
                  <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                  <td>
                    <button class="btn btn-outline btn-small" onclick="viewOrderDetails('${order.id}')">View</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      ` : '<p class="empty-message">No orders yet</p>'}
    </div>
  `;
}

function renderSellerSettings() {
  const content = document.getElementById('admin-content');
  
  content.innerHTML = `
    <div class="admin-header">
      <h1>Seller Settings</h1>
      <p>Manage your shop and account</p>
    </div>
    
    <div class="settings-container">
      <div class="settings-card">
        <h3>Shop Information</h3>
        <form id="shop-form">
          <div class="form-group">
            <label class="form-label">Shop Name</label>
            <input type="text" class="form-input" id="shop-name" value="${appState.currentUser.shopName}">
          </div>
          <div class="form-group">
            <label class="form-label">Owner Name</label>
            <input type="text" class="form-input" id="owner-name" value="${appState.currentUser.name}">
          </div>
          <button type="submit" class="btn btn-primary">Update Shop Info</button>
        </form>
      </div>
      
      <div class="settings-card">
        <h3>Change Password</h3>
        <form id="seller-password-form">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <input type="password" class="form-input" id="seller-current-password" required>
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" class="form-input" id="seller-new-password" required>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input type="password" class="form-input" id="seller-confirm-password" required>
          </div>
          <button type="submit" class="btn btn-primary">Change Password</button>
        </form>
      </div>
      
      <div class="settings-card">
        <h3>Account Information</h3>
        <div class="info-row">
          <span>Seller ID:</span>
          <strong>${appState.currentUser.sellerId}</strong>
        </div>
        <div class="info-row">
          <span>Email:</span>
          <strong>${appState.currentUser.email}</strong>
        </div>
        <div class="info-row">
          <span>Username:</span>
          <strong>${appState.currentUser.username}</strong>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('shop-form').onsubmit = (e) => {
    e.preventDefault();
    const shopName = document.getElementById('shop-name').value.trim();
    const ownerName = document.getElementById('owner-name').value.trim();
    
    if (shopName && ownerName) {
      appState.currentUser.shopName = shopName;
      appState.currentUser.name = ownerName;
      showToast('Shop information updated!', 'success');
    }
  };
  
  document.getElementById('seller-password-form').onsubmit = (e) => {
    e.preventDefault();
    const current = document.getElementById('seller-current-password').value;
    const newPass = document.getElementById('seller-new-password').value;
    const confirm = document.getElementById('seller-confirm-password').value;
    
    if (current !== appState.currentUser.password) {
      showToast('Current password is incorrect', 'error');
      return;
    }
    
    if (newPass !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (newPass.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    appState.currentUser.password = newPass;
    showToast('Password changed successfully!', 'success');
    document.getElementById('seller-password-form').reset();
  };
}

// ==================== INITIALIZE APP ====================
window.addEventListener('DOMContentLoaded', init);
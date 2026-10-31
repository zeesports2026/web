/* =========================================================
   ZEE SPORTS — MAIN JAVASCRIPT
   EASY CUSTOMIZATION:
   - Change WhatsApp number in WHATSAPP_NUMBER.
   - Edit product names, descriptions and image URLs in PRODUCTS.
   - Replace photo URLs with local files, e.g. "images/my-jersey.jpg".
   ========================================================= */

/* EDIT: International format, numbers only. Pakistan example: 923184040139 */
const WHATSAPP_NUMBER = "923184040139";

/* =========================================================
   PRODUCT DATA
   PHOTO REPLACEMENT:
   Replace each image URL below with your own product photo.
   Example: image: "images/football-jersey.jpg"
   Save your images inside an "images" folder beside these files.
   ========================================================= */
const PRODUCTS = [
  {
    id: 1,
    name: "Custom Football Jersey",
    category: "Football",
    description: "Custom team jerseys with your colours, crest, names and numbers.",
    image: "Football Jersey.png"
  },
  {
    id: 2,
    name: "School & Clg Uniform",
    category: "School & College Sportswear",
    description: "Custom School Uniforms and Team Sportswear.",
    image: "School & College Sportswear 2.png"
  },
  {
    id: 2,
    name: "Basketball Uniform Set",
    category: "Basketball",
    description: "Coordinated basketball apparel for clubs, schools and teams.",
    image: "Navy and Gold Basketball Uniform Set.png"
  },
  {
    id: 3,
    name: "Cricket Team Uniform",
    category: "Cricket",
    description: "Custom cricket apparel concepts for clubs and academies.",
    image: "Navy and Lime Cricket Uniform Set.png"
  },
  {
    id: 4,
    name: "Performance Training Shirt",
    category: "Training",
    description: "Training apparel developed around your brand and team brief.",
    image: "Neon Green Athletic Performance Jersey.png"
  },
  {
    id: 5,
    name: "Custom Team Tracksuit",
    category: "Training",
    description: "Coordinated warm-up and travel apparel for teams.",
    image: "Navy Yellow Sporty Tracksuit Set.png"
  },
  {
    id: 6,
    name: "Sportswear Hoodie",
    category: "Training",
    description: "Custom hoodies for teamwear, merchandise and lifestyle ranges.",
    image: "Dynamic Navy and Red Sports Hoodie.png"
  },
  {
    id: 7,
    name: "Baseball Jersey",
    category: "Baseball",
    description: "Custom baseball tops for teams and club collections.",
    image: "Navy Blue Baseball Jersey Mockup.png"
  },
  {
    id: 8,
    name: "Volleyball Uniform",
    category: "Volleyball",
    description: "Custom volleyball apparel for indoor and beach teams.",
    image: "Navy and Gold Volleyball Uniform Set.png"
  }
];

/* Cart is stored in this browser using localStorage. No payment system is used. */
let inquiryCart = JSON.parse(localStorage.getItem("zeeSportsInquiry") || "[]");
let selectedCategory = "All";

const productGrid = document.getElementById("productGrid");
const productSearch = document.getElementById("productSearch");

/* Build product cards from the PRODUCTS list above. */
function displayProducts() {
  const searchText = productSearch.value.trim().toLowerCase();

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = (product.name + " " + product.category + " " + product.description)
      .toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<p class="empty-message">No products found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <!-- PHOTO: This image comes from the image property in PRODUCTS above. -->
      <img src="${product.image}" alt="${product.name}" loading="lazy"
           onerror="this.src='images/photo-placeholder.jpg';">
      <div class="product-info">
        <span class="product-tag">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <button class="btn btn-red" onclick="addToInquiry(${product.id})">ADD TO INQUIRY</button>
      </div>
    </article>
  `).join("");
}

/* Add one product to the inquiry cart. */
function addToInquiry(productId) {
  const product = PRODUCTS.find(item => item.id === productId);
  const existing = inquiryCart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    inquiryCart.push({ id: product.id, name: product.name, quantity: 1 });
  }

  saveCart();
  showToast(`${product.name} added to inquiry`);
}

/* Save cart and refresh the count/drawer. */
function saveCart() {
  localStorage.setItem("zeeSportsInquiry", JSON.stringify(inquiryCart));
  document.getElementById("cartCount").textContent =
    inquiryCart.reduce((total, item) => total + item.quantity, 0);
  displayCart();
}

/* Draw cart contents. */
function displayCart() {
  const cartItems = document.getElementById("cartItems");

  if (inquiryCart.length === 0) {
    cartItems.innerHTML = '<p class="cart-help">Your inquiry bag is empty. Add a product to get started.</p>';
    return;
  }

  cartItems.innerHTML = inquiryCart.map(item => `
    <div class="cart-line">
      <strong>${item.name}</strong>
      <small>Quantity: ${item.quantity}</small><br>
      <button class="remove-item" onclick="removeFromInquiry(${item.id})">Remove</button>
    </div>
  `).join("");
}

/* Remove a product from the inquiry cart. */
function removeFromInquiry(productId) {
  inquiryCart = inquiryCart.filter(item => item.id !== productId);
  saveCart();
}

/* Open/close cart drawer. */
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartBackdrop").classList.add("open");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartBackdrop").classList.remove("open");
}

/* Create WhatsApp message from selected products. */
function sendWhatsAppInquiry() {
  if (inquiryCart.length === 0) {
    showToast("Please add a product first.");
    return;
  }

  const productLines = inquiryCart.map((item, index) =>
    `${index + 1}. ${item.name} — Quantity: ${item.quantity}`
  ).join("\n");

  const message = `Hello Zee Sports,\n\nI would like to request a quotation for:\n\n${productLines}\n\nPlease share your pricing, minimum order quantity, available customization and production details.\n\nThank you.`;

  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank", "noopener");
}

/* Small confirmation notification. */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* Connect filter buttons. */
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    selectedCategory = button.dataset.filter;
    displayProducts();
  });
});

/* Category tiles set the product filter when clicked. */
document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.categoryLink;
    document.querySelectorAll(".filter-button").forEach(button => {
      button.classList.toggle("active", button.dataset.filter === selectedCategory);
    });
    displayProducts();
  });
});

/* Search products as the visitor types. */
productSearch.addEventListener("input", displayProducts);

/* Mobile navigation. */
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"));
});

/* Cart controls. */
document.querySelector(".nav-cart").addEventListener("click", event => {
  event.preventDefault();
  openCart();
});
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);
document.getElementById("sendWhatsApp").addEventListener("click", sendWhatsAppInquiry);

/* Set copyright year and initial cart display. */
document.getElementById("year").textContent = new Date().getFullYear();
saveCart();
displayProducts();

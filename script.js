// Product Data Array
const products = [
    {
        id: 1,
        name: "27-inch Monitor",
        price: 350.0,
        desc: "4K resolution display with high refresh rate for professional design.",
        img: "images/monitor.jpg",
    },
    {
        id: 2,
        name: "Headphone",
        price: 199.99,
        desc: "Block out distractions for deep focus during study or coding sessions.",
        img: "images/headphone.jpg",
    },
    {
        id: 3,
        name: "Mechanical Keyboard",
        price: 120.0,
        desc: "Tactile, clicky keys for the ultimate coding and typing experience.",
        img: "images/keyboard.jpg",
    },
    {
        id: 4,
        name: "SSD 1TB",
        price: 89.99,
        desc: "Lightning-fast solid-state drive for quick boot times and storage.",
        img: "images/ssd.jpg",
    },
    {
        id: 5,
        name: "Webcam 1080P",
        price: 65.0,
        desc: "Full HD streaming for video conferences and online lectures.",
        img: "images/webcam.jpg",
    },
    {
        id: 6,
        name: "Wireless Mouse",
        price: 45.5,
        desc: "Ergonomic design and adjustable DPI for comfort and precision.",
        img: "images/mouse.jpg",
    },
    // NOTE: You would need to create an "images" folder and add corresponding images.
];

// State Variables
let cart = [];
const productList = document.getElementById("product-list");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalValue = document.getElementById("cart-total-value");
const sortBySelect = document.getElementById("sort-by");

// --- Helper Function: Format Price ---
const formatPrice = (price) => `$${price.toFixed(2)}`;

// --- Rendering Functions ---

/**
 * Renders the product cards in the main catalog.
 * @param {Array} productArray - The array of products to render.
 */
function renderProducts(productArray) {
    productList.innerHTML = ""; // Clear existing products

    productArray.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.img}" alt="${
            product.name
        }" onerror="this.onerror=null; this.src='https://via.placeholder.com/250x150?text=Image'">
            <h4>${product.name}</h4>
            <p>${product.desc}</p>
            <div class="product-price">${formatPrice(product.price)}</div>
            <button class="add-to-cart-btn" data-product-id="${
                product.id
            }">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });

    // Attach event listeners to all 'Add to Cart' buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
        button.addEventListener("click", handleAddToCart);
    });
}

/**
 * Renders the items in the shopping cart sidebar.
 */
function renderCart() {
    cartItemsContainer.innerHTML = ""; // Clear existing cart items
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<p class="empty-cart-message">Your cart is empty.</p>';
        cartTotalValue.textContent = formatPrice(0);
        return;
    }

    // Group items in the cart to show quantity
    const groupedCart = cart.reduce((acc, item) => {
        acc[item.id] = acc[item.id] || { ...item, quantity: 0, subtotal: 0 };
        acc[item.id].quantity++;
        acc[item.id].subtotal += item.price;
        total += item.price;
        return acc;
    }, {});

    Object.values(groupedCart).forEach((item) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name} (${
            item.quantity
        })</span>
            </div>
            <span class="cart-item-price">${formatPrice(item.subtotal)}</span>
            <button class="remove-btn" data-product-id="${
                item.id
            }">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Update Total
    cartTotalValue.textContent = formatPrice(total);

    // Attach event listeners to all 'Remove' buttons
    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", handleRemoveFromCart);
    });
}

// --- Event Handlers ---

/**
 * Handles the 'Add to Cart' button click.
 * @param {Event} event - The click event.
 */
function handleAddToCart(event) {
    const productId = parseInt(event.target.dataset.productId);
    const product = products.find((p) => p.id === productId);

    if (product) {
        cart.push(product); // Add the product object to the cart array
        renderCart();
    }
}

/**
 * Handles the 'Remove' button click in the cart.
 * Removes one instance of the product from the cart.
 * @param {Event} event - The click event.
 */
function handleRemoveFromCart(event) {
    const productId = parseInt(event.target.dataset.productId);

    // Find the index of the last item with this ID in the cart
    const indexToRemove = cart.findIndex((item) => item.id === productId);

    if (indexToRemove !== -1) {
        cart.splice(indexToRemove, 1); // Remove only one item
        renderCart();
    }
}

/**
 * Handles the sorting selection change.
 */
function handleSortProducts() {
    const sortValue = sortBySelect.value;
    let sortedProducts = [...products]; // Create a copy of the array

    if (sortValue === "descending") {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === "ascending") {
        sortedProducts.sort((a, b) => a.price - b.price);
    }
    // 'none' (default) does nothing, leaving it in original order

    renderProducts(sortedProducts);
}

// --- Initialization ---

// 1. Initial Render and Default Sort
// Set the initial sort to descending (as seen in the image) and render.
sortBySelect.value = "descending";
handleSortProducts();

// 2. Initial Cart Render
renderCart();

// 3. Attach Sort Event Listener
sortBySelect.addEventListener("change", handleSortProducts);

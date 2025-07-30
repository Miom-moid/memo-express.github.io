// قائمة الأطباق
const menuItems = [
  {
    id: 1,
    name: "برجر لحم مع البطاطس",
    price: 45,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "برجر"
  },
  {
    id: 2,
    name: "بيتزا بeperoni",
    price: 60,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "بيتزا"
  },
  {
    id: 3,
    name: "سوشي ميكس",
    price: 80,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "سوشي"
  },
  {
    id: 4,
    name: "طبق كباب مشكل",
    price: 55,
    image: "https://images.unsplash.com/photo-1544025162-d7689ab5ce26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "مشاوي"
  },
  {
    id: 5,
    name: "سلطة سيزر بالدجاج",
    price: 35,
    image: "https://images.unsplash.com/photo-1546793665-c7879a16c573?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "سلطة"
  },
  {
    id: 6,
    name: "كاساديا لحم",
    price: 50,
    image: "https://images.unsplash.com/photo-1583311590989-56370993c5dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "مكسيكي"
  }
];

// السلة
let cart = [];

// عرض الأطباق
function displayMenu() {
  const menuGrid = document.getElementById("menu-grid");
  menuGrid.innerHTML = "";

  menuItems.forEach(item => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="menu-item-content">
        <h3>${item.name}</h3>
        <p>ممتاز لعشاق النكهات القوية</p>
        <div class="price">${item.price} درهم</div>
        <button class="add-to-cart" onclick="addToCart(${item.id})">
          <i class="fas fa-shopping-cart"></i> أضف إلى السلة
        </button>
      </div>
    `;
    menuGrid.appendChild(menuItem);
  });
}

// إضافة إلى السلة
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const cartItem = cart.find(i => i.id === id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCart();
}

// حذف من السلة
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// تحديث السلة
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartItemsCount = document.getElementById("cart-items-count");
  const totalPrice = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  // تحديث العدد
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartItemsCount.textContent = totalItems;

  // حساب الإجمالي
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPrice.textContent = total;

  // عرض العناصر
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">سلتك فارغة.</p>';
    checkoutBtn.disabled = true;
  } else {
    cartItems.innerHTML = "";
    cart.forEach(item => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.name}</strong> × ${item.quantity}
          <br>
          (${item.price} × ${item.quantity} = ${(item.price * item.quantity)} درهم)
        </div>
        <div class="cart-item-actions">
          <button onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
      `;
      cartItems.appendChild(itemElement);
    });
    checkoutBtn.disabled = false;
  }

  document.getElementById("final-total").textContent = total;
}

// نموذج التوصيل
const modal = document.getElementById("checkout-modal");
const closeModal = document.getElementById("close-modal");
const orderForm = document.getElementById("order-form");
const orderMessage = document.getElementById("order-message");

document.getElementById("checkout-btn").onclick = () => {
  modal.style.display = "flex";
};

closeModal.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

  // بيانات الطلب
  const orderData = {
    id: Date.now(), // رقم فريد
    name,
    phone,
    address,
    notes,
    total,
    status: "جديد",
    timestamp: new Date().toLocaleString('ar-SA')
  };

  // حفظ في الذاكرة
  let orders = JSON.parse(localStorage.getItem("memoOrders") || "[]");
  orders.push(orderData);
  localStorage.setItem("memoOrders", JSON.stringify(orders));

  // رسالة نجاح
  orderMessage.innerHTML = `
    <p style="color: green;">
      تم تأكيد طلبك بنجاح، ${name}!<br>
      الإجمالي: ${total} درهم<br>
      شكرًا لاختيارك ميمو إكسبريس!
    </p>
  `;

  // مسح النموذج
  orderForm.reset();

  // إغلاق النافذة وإعادة السلة
  setTimeout(() => {
    document.getElementById("checkout-modal").style.display = "none";
    orderMessage.innerHTML = "";
    cart = [];
    updateCart();
  }, 2000);
};

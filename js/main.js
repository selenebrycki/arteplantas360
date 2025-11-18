/* ===============================
   ARCHIVO: main.js
   DESCRIPCIÓN: JavaScript principal para toda la aplicación
   FUNCIONES: Gestión de carrito, menú, productos, autenticación
   =============================== */

/* ===============================
   MENÚ HAMBURGUESA
   Control del menú lateral en dispositivos móviles
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del menú
  var menuToggle = document.getElementById("menu-toggle")
  var sidebar = document.getElementById("sidebar")

  // Alternar menú al hacer clic
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (sidebar) {
        sidebar.classList.toggle("active")
      }
    })
  }

  // Cerrar menú al hacer clic en un enlace
  var sidebarLinks = document.querySelectorAll(".sidebar a")
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (sidebar) {
        sidebar.classList.remove("active")
      }
    })
  })

  loadGalleryFromAPI()
  
  // Inicializar productos después de cargar DOM
  initializeProducts()
  updateCartCount()
})

/* ===============================
   GALERÍA DINÁMICA
   Carga productos desde la BD y los añade al carousel Owl
   =============================== */
function loadGalleryFromAPI() {
  fetch("api/productos.php?action=all")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.data && data.data.length > 0) {
        renderGallery(data.data)
      }
    })
    .catch((error) => {
      console.log("[v0] Error al cargar galería:", error)
    })
}

function renderGallery(productos) {
  var carousel = document.getElementById("gallery-carousel")
  if (!carousel) return

  carousel.innerHTML = ""
  productos.forEach((producto) => {
    var div = document.createElement("div")
    div.style.cursor = "pointer"
    var img = document.createElement("img")
    img.src = producto.imagen
    img.alt = producto.nombre
    img.style.width = "100%"
    img.style.height = "400px"
    img.style.objectFit = "cover"
    img.style.borderRadius = "10px"
    
    // Al hacer clic en la imagen, ir a la ficha del producto
    div.addEventListener("click", () => {
      window.location.href = "productos.html?producto=" + producto.id
    })
    
    div.appendChild(img)
    carousel.appendChild(div)
  })

  $(".owl-carousel").trigger("destroy.owl.carousel").removeClass("owl-loaded")
  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1024: { items: 3 }
    }
  })
}

/* ===============================
   GESTIÓN DE PRODUCTOS
   Funciones para cargar, mostrar y filtrar productos
   =============================== */

// Array de productos por defecto (fallback si BD no funciona)
var productsDB = [
  {
    id: 1,
    nombre: "Cattleya Violeta",
    precio: 5500,
    imagen: "assets/images/Cattleya.jpg",
    categoria: "orquideas",
    descripcion: "Hermosa orquídea Cattleya con flores violetas intensas. Requiere luz brillante e indirecta.",
  },
  {
    id: 2,
    nombre: "Cactus y Suculentas",
    precio: 2500,
    imagen: "assets/images/cactusSuculentas.jpg",
    categoria: "cactus",
    descripcion: "Variedad de cactus y suculentas para interiores. Bajo mantenimiento y muy resistentes.",
  },
  {
    id: 3,
    nombre: "Ramo Romántico",
    precio: 4200,
    imagen: "assets/images/ramoRomantico.jpg",
    categoria: "ramos",
    descripcion: "Hermoso ramo con flores variadas en tonos pastel. Ideal para ocasiones especiales.",
  },
  {
    id: 4,
    nombre: "Ramo de Rosas 1",
    precio: 3800,
    imagen: "assets/images/ramoRosas1.jpg",
    categoria: "ramos",
    descripcion: "Elegante ramo de rosas rojas. Perfecto para expresar amor y admiración.",
  },
  {
    id: 5,
    nombre: "Ramo de Rosas 2",
    precio: 4500,
    imagen: "assets/images/ramoRosas2.jpg",
    categoria: "ramos",
    descripcion: "Ramo premium de rosas en colores variados. Excelente presentación.",
  },
  {
    id: 6,
    nombre: "Bebedero de Pajaritos",
    precio: 1500,
    imagen: "assets/images/bebederoPajaritos.jpg",
    categoria: "accesorios",
    descripcion: "Bebedero decorativo para el jardín. Atrae pájaros y embellece el espacio.",
  },
  {
    id: 7,
    nombre: "Porta Panda",
    precio: 2200,
    imagen: "assets/images/portaPanda.jpg",
    categoria: "macetas",
    descripcion: "Adorable maceta con diseño de panda. Perfecta para plantas pequeñas.",
  },
  {
    id: 8,
    nombre: "Molinetes",
    precio: 800,
    imagen: "assets/images/molinetes.jpg",
    categoria: "accesorios",
    descripcion: "Molinetes decorativos para el jardín. Añaden movimiento y color.",
  },
]

function initializeProducts() {
  loadProductsFromAPI()
  updateCartCount()
}

function loadProductsFromAPI() {
  fetch("api/productos.php?action=all")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.data && data.data.length > 0) {
        localStorage.setItem("arteplantas-products", JSON.stringify(data.data))
        console.log("[v0] Productos cargados desde BD")
        displayProducts()
      } else {
        // Fallback si no hay datos de BD
        localStorage.setItem("arteplantas-products", JSON.stringify(productsDB))
        displayProducts()
      }
    })
    .catch((error) => {
      console.log("[v0] Error al cargar desde BD, usando fallback:", error)
      localStorage.setItem("arteplantas-products", JSON.stringify(productsDB))
      displayProducts()
    })
}

function displayProducts() {
  var productsGrid = document.getElementById("products-grid")
  if (!productsGrid) return

  var products = getProducts()
  productsGrid.innerHTML = ""

  products.forEach((product) => {
    var card = document.createElement("div")
    card.className = "card"
    var productName = product.nombre || product.name
    var productImage = product.imagen || product.image
    var productPrice = product.precio || product.price
    var productId = product.id

    card.innerHTML = `
      <img src="${productImage}" alt="${productName}">
      <h3><a href="productos.html?producto=${productId}">${productName}</a></h3>
      <div class="price">${formatPrice(productPrice)}</div>
      <div class="actions">
        <button class="btn primary" onclick="addToCart(${productId}, '${productName}', ${productPrice})">Agregar</button>
        <a href="productos.html?producto=${productId}" class="btn">Ver más</a>
      </div>
    `
    productsGrid.appendChild(card)
  })
}

// Obtener todos los productos desde localStorage
function getProducts() {
  var stored = localStorage.getItem("arteplantas-products")
  return stored ? JSON.parse(stored) : productsDB
}

// Formatear precio como moneda
function formatPrice(price) {
  return "$" + price.toLocaleString("es-AR")
}

/* ===============================
   GESTIÓN DEL CARRITO
   Funciones para agregar, eliminar y actualizar carrito
   =============================== */

// Obtener carrito desde localStorage
function getCart() {
  var cart = localStorage.getItem("arteplantas-cart")
  return cart ? JSON.parse(cart) : []
}

// Guardar carrito en localStorage
function saveCart(cart) {
  localStorage.setItem("arteplantas-cart", JSON.stringify(cart))
  updateCartCount()
}

function addToCart(productId, productName, productPrice) {
  var cart = getCart()
  var existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1,
    })
  }

  saveCart(cart)
  showNotification("Producto agregado al carrito")
}

// Eliminar producto del carrito
function removeFromCart(productId) {
  var cart = getCart()
  cart = cart.filter((item) => item.id !== productId)
  saveCart(cart)
  showNotification("Producto eliminado del carrito")
}

// Vaciar carrito completamente
function clearCart() {
  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    localStorage.setItem("arteplantas-cart", JSON.stringify([]))
    updateCartCount()
    var emptyMessage = document.getElementById("empty-cart-message")
    if (emptyMessage) {
      emptyMessage.style.display = "block"
    }
    var clearBtn = document.getElementById("clear-cart-btn")
    if (clearBtn) {
      clearBtn.style.display = "none"
    }
    showNotification("Carrito vaciado")
  }
}

// Actualizar contador de productos en el carrito
function updateCartCount() {
  var cart = getCart()
  var cartCount = document.getElementById("cart-count")
  if (cartCount) {
    var total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    cartCount.textContent = total
  }
}

/* ===============================
   GESTIÓN DE AUTENTICACIÓN
   Funciones para login y logout del admin
   =============================== */

// Credenciales de admin por defecto (fallback)
var ADMIN_USER = "admin"
var ADMIN_PASS = "arteplantas1988"

function adminLogin(username, password) {
  console.log("[v0] Intentando login con usuario:", username)

  fetch("api/auth.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario: username,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        localStorage.setItem("arteplantas-admin", "true")
        console.log("[v0] Login exitoso")
        window.location.href = "admin-products.html"
      } else {
        console.log("[v0] Login fallido:", data.message)
        alert(data.message || "Usuario o contraseña incorrectos")
      }
    })
    .catch((error) => {
      console.error("[v0] Error en login:", error)
      alert("Error al conectar con el servidor")
    })
}

// Función de logout
function adminLogout() {
  localStorage.removeItem("arteplantas-admin")
  console.log("[v0] Logout exitoso")
}

// Verificar si hay sesión activa
function isAdminLoggedIn() {
  var session = localStorage.getItem("arteplantas-admin")
  return session === "true"
}

// Redirigir a login si no hay sesión
function requireAdminLogin() {
  if (!isAdminLoggedIn()) {
    window.location.href = "admin-login.html"
  }
}

/* ===============================
   INTERFAZ DE USUARIO
   Funciones para mostrar notificaciones y actualizar vistas
   =============================== */

// Mostrar notificación temporal
function showNotification(message) {
  var notification = document.createElement("div")
  notification.style.position = "fixed"
  notification.style.top = "20px"
  notification.style.right = "20px"
  notification.style.background = "#378e66"
  notification.style.color = "white"
  notification.style.padding = "15px 20px"
  notification.style.borderRadius = "4px"
  notification.style.zIndex = "2000"
  notification.style.animation = "slideIn 0.3s ease"
  notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  initializeProducts()
  updateCartCount()
})

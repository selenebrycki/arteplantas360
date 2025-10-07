/* ===============================
   ARCHIVO: main.js
   DESCRIPCIÓN: JavaScript principal para toda la página web de Arteplantas
   FUNCIONES: Menú lateral, carrito, productos, notificaciones, admin
   =============================== */

// ===============================
// VERIFICACIÓN DE COMPATIBILIDAD
// Asegura que localStorage esté disponible
// ===============================
function isLocalStorageAvailable() {
  try {
    var test = "__localStorage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    console.error("localStorage no está disponible:", e)
    return false
  }
}

// ===============================
// CONTROL DEL MENÚ LATERAL
// Abre y cierra el menú hamburguesa
// ===============================
function initSidebar() {
  const toggle = document.getElementById("menu-toggle")
  const sidebar = document.getElementById("sidebar")

  if (!toggle || !sidebar) return

  // Abrir/cerrar menú al hacer clic en el botón
  toggle.addEventListener("click", (e) => {
    e.stopPropagation()
    sidebar.classList.toggle("active")
  })

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("active") && !sidebar.contains(e.target) && e.target !== toggle) {
      sidebar.classList.remove("active")
    }
  })
}

// ===============================
// GESTIÓN DEL ESTADO DE ADMINISTRADOR
// Verifica si el usuario es admin y actualiza la UI
// ===============================
function checkAdminStatus() {
  if (!isLocalStorageAvailable()) return

  const isAdmin = localStorage.getItem("arteplantas-admin") === "true"
  const adminBadge = document.getElementById("admin-badge")
  const adminLoginLink = document.getElementById("admin-login-link")
  const adminMenuItem = document.getElementById("admin-menu-item")

  if (isAdmin) {
    // Usuario es administrador
    if (adminBadge) adminBadge.style.display = "inline-block"
    if (adminLoginLink) {
      adminLoginLink.innerHTML =
        '<img src="assets/icons/usuario.png" alt="Admin" class="icon" title="Sesión Activa - Admin">'
      adminLoginLink.href = "admin-products.html"
    }
    if (adminMenuItem) adminMenuItem.style.display = "block"
  } else {
    // Usuario normal
    if (adminBadge) adminBadge.style.display = "none"
    if (adminLoginLink) {
      adminLoginLink.innerHTML =
        '<img src="assets/icons/usuario.png" alt="Admin Login" class="icon" title="Acceso Administradores">'
      adminLoginLink.href = "admin-login.html"
    }
    if (adminMenuItem) adminMenuItem.style.display = "none"
  }
}

// ===============================
// FORMATEO DE PRECIOS
// Convierte números a formato de moneda
// ===============================
function formatPrice(price) {
  var numPrice = Number.parseInt(price, 10)
  // Fallback para navegadores sin toLocaleString
  if (typeof numPrice.toLocaleString === "function") {
    return "$" + numPrice.toLocaleString()
  } else {
    return "$" + numPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

// ===============================
// GESTIÓN DE PRODUCTOS
// Carga y guarda productos en localStorage
// ===============================
function loadProducts() {
  if (!isLocalStorageAvailable()) return getDefaultProducts()

  var productsJSON = localStorage.getItem("arteplantas-products")
  var products = productsJSON ? JSON.parse(productsJSON) : null

  // Si no hay productos, usar datos por defecto
  if (!products || products.length === 0) {
    products = getDefaultProducts()
    localStorage.setItem("arteplantas-products", JSON.stringify(products))
  }

  return products
}

function getDefaultProducts() {
  return [
    {
      id: "orquidea",
      name: "Orquídea Cattleya",
      price: 29900,
      stock: 5,
      minStock: 3,
      category: "Plantas",
      visible: true,
      description: "La Orquídea Cattleya es conocida como la 'reina de las orquídeas' por su belleza y elegancia.",
      image: "assets/images/Cattleya.jpg",
      meta: "Lila con centro amarillo",
    },
    {
      id: "molinetes",
      name: "Molinetes",
      price: 4000,
      stock: 20,
      minStock: 10,
      category: "Decoración",
      visible: true,
      description: "Divertidos molinetes para decorar jardines, macetas o interiores.",
      image: "assets/images/molinetes.jpg",
      meta: "Disponible en varios colores",
    },
    {
      id: "cactus",
      name: "Cactus y Suculentas",
      price: 2500,
      stock: 15,
      minStock: 5,
      category: "Plantas",
      visible: true,
      description: "Perfectos para quienes buscan plantas resistentes y de bajo mantenimiento.",
      image: "assets/images/cactusSuculentas.jpg",
      meta: "Muchas variedades disponibles",
    },
    {
      id: "ramoRomantico",
      name: "Ramo romántico",
      price: 30000,
      stock: 8,
      minStock: 3,
      category: "Ramos",
      visible: true,
      description: "Un ramo especialmente diseñado para expresar amor y romanticismo.",
      image: "assets/images/ramoRomantico.jpg",
      meta: "Rosas, clavelinas y eucalipto",
    },
    {
      id: "bebederoPajaritos",
      name: "Bebedero para Pajaritos",
      price: 5000,
      stock: 12,
      minStock: 5,
      category: "Accesorios",
      visible: true,
      description: "Atrae aves a tu jardín con este encantador bebedero para pajaritos.",
      image: "assets/images/bebederoPajaritos.jpg",
      meta: "Disponible en muchos colores",
    },
    {
      id: "ramoRosas",
      name: "Ramo de rosas rojas",
      price: 50000,
      stock: 6,
      minStock: 2,
      category: "Ramos",
      visible: true,
      description: "El clásico ramo de rosas rojas, símbolo por excelencia del amor y la pasión.",
      image: "assets/images/ramoRosas2.jpg",
      meta: "Clásico",
    },
    {
      id: "portaPanda",
      name: "Portamaceta de Panda",
      price: 14200,
      stock: 10,
      minStock: 4,
      category: "Macetas",
      visible: true,
      description: "Divertido y adorable portamaceta con forma de panda.",
      image: "assets/images/portaPanda.jpg",
      meta: "Cerámica esmaltada",
    },
    {
      id: "plantaCrisas",
      name: "Planta de Crisantemos",
      price: 8000,
      stock: 18,
      minStock: 6,
      category: "Plantas",
      visible: true,
      description: "Los crisantemos son flores alegres y coloridas que simbolizan optimismo y alegría.",
      image: "assets/images/plantaCrisas.jpg",
      meta: "Lila y amarillo",
    },
  ]
}

function saveProducts(products) {
  if (!isLocalStorageAvailable()) return
  localStorage.setItem("arteplantas-products", JSON.stringify(products))
}

function findProductById(id) {
  var products = loadProducts()
  // Fallback para navegadores sin Array.find
  if (Array.prototype.find) {
    return products.find((product) => product.id === id)
  } else {
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) return products[i]
    }
    return null
  }
}

function updateProduct(updatedProduct) {
  var products = loadProducts()
  var index = -1

  // Buscar índice del producto
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === updatedProduct.id) {
      index = i
      break
    }
  }

  if (index !== -1) {
    products[index] = updatedProduct
    saveProducts(products)
    return true
  }
  return false
}

function deleteProduct(productId) {
  var products = loadProducts()
  var filteredProducts = []

  // Filtrar productos manualmente
  for (var i = 0; i < products.length; i++) {
    if (products[i].id !== productId) {
      filteredProducts.push(products[i])
    }
  }

  saveProducts(filteredProducts)
  return products.length !== filteredProducts.length
}

// ===============================
// RENDERIZADO DE PRODUCTOS
// Muestra los productos en la página principal
// ===============================
function renderProducts() {
  var productsGrid = document.getElementById("products-grid")
  if (!productsGrid) return

  var products = loadProducts()
  var visibleProducts = []

  // Filtrar productos visibles
  for (var i = 0; i < products.length; i++) {
    if (products[i].visible) {
      visibleProducts.push(products[i])
    }
  }

  var html = ""
  for (var j = 0; j < visibleProducts.length; j++) {
    var product = visibleProducts[j]
    var stockWarning =
      product.stock < product.minStock && product.stock > 0 ? '<div class="stock-warning">¡Últimas unidades!</div>' : ""
    var buttonDisabled = product.stock === 0 ? "disabled" : ""
    var buttonText = product.stock === 0 ? "Agotado" : "Comprar"

    html +=
      '<article class="card product-card">' +
      '<img src="' +
      product.image +
      '" alt="' +
      product.name +
      '" onerror="this.src=\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBlbmNvbnRyYWRhPC90ZXh0Pjwvc3ZnPg==\'">' +
      '<h3><a href="productos.html?producto=' +
      product.id +
      '">' +
      product.name +
      "</a></h3>" +
      '<div class="price">' +
      formatPrice(product.price) +
      "</div>" +
      '<div class="meta">' +
      product.meta +
      "</div>" +
      stockWarning +
      '<div class="actions">' +
      '<button class="btn primary" onclick="addToCart(\'' +
      product.id +
      "', '" +
      product.name +
      "', " +
      product.price +
      ')" ' +
      buttonDisabled +
      ">" +
      buttonText +
      "</button>" +
      '<a class="btn" href="productos.html?producto=' +
      product.id +
      '">Ver más</a>' +
      "</div>" +
      "</article>"
  }

  productsGrid.innerHTML = html
}

// ===============================
// GESTIÓN DEL CARRITO
// Funciones para agregar, eliminar y actualizar el carrito
// ===============================
function addToCart(productId, productName, productPrice) {
  if (!isLocalStorageAvailable()) {
    alert("Tu navegador no soporta localStorage. Por favor actualiza tu navegador.")
    return
  }

  var cartJSON = localStorage.getItem("arteplantas-cart")
  var cart = cartJSON ? JSON.parse(cartJSON) : []
  var products = loadProducts()
  var product = findProductById(productId)

  if (product && product.stock > 0) {
    var existingItem = null

    // Buscar item existente
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        existingItem = cart[i]
        break
      }
    }

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

    localStorage.setItem("arteplantas-cart", JSON.stringify(cart))
    showNotification("Producto agregado al carrito")
    updateCartCounter()
  } else {
    showNotification("Producto agotado", "error")
  }
}

function clearCart() {
  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    if (!isLocalStorageAvailable()) return

    localStorage.removeItem("arteplantas-cart")
    updateCartCounter()

    // Recargar vista del carrito si estamos en la página de compra
    if (typeof window.loadCart === "function") {
      window.loadCart()
    }

    showNotification("Carrito vaciado")
  }
}

// ===============================
// CONTADOR DEL CARRITO
// Actualiza el número de productos en el icono del carrito
// ===============================
function updateCartCounter() {
  if (!isLocalStorageAvailable()) return

  var cartJSON = localStorage.getItem("arteplantas-cart")
  var cart = cartJSON ? JSON.parse(cartJSON) : []
  var totalItems = 0

  // Sumar cantidades
  for (var i = 0; i < cart.length; i++) {
    totalItems += cart[i].quantity || 1
  }

  var cartCountElement = document.getElementById("cart-count")

  if (cartCountElement) {
    cartCountElement.textContent = totalItems

    // Mostrar/ocultar el contador según si hay productos
    if (totalItems > 0) {
      cartCountElement.style.display = "flex"
    } else {
      cartCountElement.style.display = "none"
    }
  }
}

// ===============================
// NOTIFICACIONES
// Muestra mensajes emergentes al usuario
// ===============================
function showNotification(message, type) {
  type = type || "success"

  var notification = document.createElement("div")
  notification.textContent = message
  notification.style.cssText =
    "position: fixed;" +
    "bottom: 20px;" +
    "right: 20px;" +
    "background-color: " +
    (type === "success" ? "#2D5016" : "#e74c3c") +
    ";" +
    "color: white;" +
    "padding: 15px 25px;" +
    "border-radius: 8px;" +
    "z-index: 10000;" +
    "box-shadow: 0 4px 12px rgba(0,0,0,0.3);" +
    "animation: slideIn 0.3s ease;" +
    "font-family: 'Roboto', sans-serif;" +
    "font-size: 14px;"

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// ===============================
// FUNCIONES ADMIN - UTILIDADES
// Generación de IDs y verificación de autenticación
// ===============================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function checkAdminAuth() {
  if (!isLocalStorageAvailable()) return false

  if (!localStorage.getItem("arteplantas-admin")) {
    window.location.href = "admin-login.html"
    return false
  }
  return true
}

// ===============================
// FUNCIONES ADMIN - TABLA DE PRODUCTOS
// Carga y renderiza la tabla de productos en el panel admin
// ===============================
function loadProductsTable() {
  var products = loadProducts()
  var tbody = document.getElementById("products-table-body")

  if (!tbody) return

  tbody.innerHTML = ""

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No hay productos registrados</td></tr>'
    return
  }

  for (var i = 0; i < products.length; i++) {
    var product = products[i]
    var row = document.createElement("tr")

    var imageCell = product.image
      ? '<img src="' + product.image + '" alt="' + product.name + '" class="product-thumb">'
      : "📷"

    var stockClass = product.stock < 5 ? "stock-low" : "stock-ok"
    var statusClass = product.visible ? "status-active" : "status-inactive"
    var statusText = product.visible ? "Visible" : "Oculto"

    row.innerHTML =
      "<td>" +
      imageCell +
      "</td>" +
      "<td>" +
      product.name +
      "</td>" +
      "<td>" +
      product.category +
      "</td>" +
      "<td>" +
      formatPrice(product.price) +
      "</td>" +
      '<td class="' +
      stockClass +
      '">' +
      product.stock +
      "</td>" +
      '<td><span class="status ' +
      statusClass +
      '">' +
      statusText +
      "</span></td>" +
      "<td>" +
      '<button class="btn-edit" onclick="editProduct(\'' +
      product.id +
      "')\">Editar</button>" +
      '<button class="btn-delete" onclick="deleteProductConfirm(\'' +
      product.id +
      "')\">Eliminar</button>" +
      "</td>"

    tbody.appendChild(row)
  }
}

// ===============================
// FUNCIONES ADMIN - FILTRADO
// Filtra productos en la tabla según búsqueda
// ===============================
function filterProducts() {
  var searchInput = document.getElementById("product-search")
  if (!searchInput) return

  var searchTerm = searchInput.value.toLowerCase()
  var rows = document.querySelectorAll("#products-table-body tr")

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i]
    if (row.cells.length > 1) {
      var productName = row.cells[1].textContent.toLowerCase()
      var productCategory = row.cells[2].textContent.toLowerCase()

      if (productName.indexOf(searchTerm) > -1 || productCategory.indexOf(searchTerm) > -1) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    }
  }
}

// ===============================
// FUNCIONES ADMIN - MODAL
// Abre y cierra el modal de productos
// ===============================
function openProductModal(productId) {
  var modal = document.getElementById("product-modal")
  var title = document.getElementById("modal-title")
  var form = document.getElementById("product-form")

  if (!modal || !title || !form) return

  if (productId) {
    title.textContent = "Editar Producto"
    var product = findProductById(productId)
    if (product) {
      document.getElementById("product-id").value = product.id
      document.getElementById("product-name").value = product.name
      document.getElementById("product-category").value = product.category
      document.getElementById("product-price").value = product.price
      document.getElementById("product-stock").value = product.stock
      document.getElementById("product-description").value = product.description || ""
      document.getElementById("product-image").value = product.image || ""
      document.getElementById("product-visible").value = product.visible.toString()
    }
  } else {
    title.textContent = "Agregar Producto"
    form.reset()
    document.getElementById("product-id").value = ""
  }

  modal.style.display = "flex"
}

function closeProductModal() {
  var modal = document.getElementById("product-modal")
  if (modal) {
    modal.style.display = "none"
  }
}

// ===============================
// FUNCIONES ADMIN - EDITAR/ELIMINAR
// Edita o elimina productos
// ===============================
function editProduct(productId) {
  openProductModal(productId)
}

function deleteProductConfirm(productId) {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    if (deleteProduct(productId)) {
      showNotification("Producto eliminado correctamente")
      loadProductsTable()
    } else {
      showNotification("Error al eliminar el producto", "error")
    }
  }
}

// ===============================
// FUNCIONES ADMIN - CERRAR SESIÓN
// Cierra la sesión del administrador
// ===============================
function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    if (!isLocalStorageAvailable()) return

    localStorage.removeItem("arteplantas-admin")
    localStorage.removeItem("arteplantas-admin-user")

    // Disparar evento para actualizar la interfaz
    if (window.Event) {
      window.dispatchEvent(new Event("adminStatusChanged"))
    }

    // Redirigir al inicio
    window.location.href = "index.html"
  }
}

// ===============================
// INICIALIZACIÓN
// Se ejecuta cuando el DOM está listo
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar menú lateral
  initSidebar()

  // Verificar estado de administrador
  checkAdminStatus()

  // Renderizar productos si estamos en la página principal
  if (document.getElementById("products-grid")) {
    renderProducts()
  }

  // Actualizar contador del carrito
  updateCartCounter()

  // Panel de administración
  if (document.getElementById("products-table-body")) {
    loadProductsTable()

    // Configurar el formulario de productos
    var productForm = document.getElementById("product-form")
    if (productForm) {
      productForm.addEventListener("submit", (e) => {
        e.preventDefault()

        var productData = {
          id: document.getElementById("product-id").value || generateId(),
          name: document.getElementById("product-name").value,
          category: document.getElementById("product-category").value,
          price: Number.parseInt(document.getElementById("product-price").value, 10),
          stock: Number.parseInt(document.getElementById("product-stock").value, 10),
          description: document.getElementById("product-description").value,
          image: document.getElementById("product-image").value,
          visible: document.getElementById("product-visible").value === "true",
          minStock: 3,
          meta: "",
        }

        var products = loadProducts()
        var isEdit = document.getElementById("product-id").value

        if (isEdit) {
          // Editar producto existente
          var index = -1
          for (var i = 0; i < products.length; i++) {
            if (products[i].id === productData.id) {
              index = i
              break
            }
          }

          if (index !== -1) {
            products[index] = productData
            showNotification("Producto actualizado correctamente")
          }
        } else {
          // Agregar nuevo producto
          products.push(productData)
          showNotification("Producto agregado correctamente")
        }

        saveProducts(products)
        loadProductsTable()
        closeProductModal()
      })
    }
  }

  // Escuchar cambios en localStorage (para sincronizar entre pestañas)
  window.addEventListener("storage", (e) => {
    if (e.key === "arteplantas-admin") {
      checkAdminStatus()
    }
    if (e.key === "arteplantas-cart") {
      updateCartCounter()
    }
  })

  // Escuchar eventos personalizados
  window.addEventListener("adminStatusChanged", checkAdminStatus)
  window.addEventListener("cartUpdated", updateCartCounter)
})

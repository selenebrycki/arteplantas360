// Funciones para el panel de administración
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function formatPrice(price) {
  return "$" + Number.parseInt(price).toLocaleString()
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#27ae60" : "#e74c3c"};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Animaciones CSS para notificaciones
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`
document.head.appendChild(style)

// Gestión de productos
function loadProducts() {
  return JSON.parse(localStorage.getItem("foodexpress-products")) || []
}

function saveProducts(products) {
  localStorage.setItem("foodexpress-products", JSON.stringify(products))
}

function findProductById(id) {
  const products = loadProducts()
  return products.find((product) => product.id === id)
}

function updateProduct(updatedProduct) {
  const products = loadProducts()
  const index = products.findIndex((p) => p.id === updatedProduct.id)
  if (index !== -1) {
    products[index] = updatedProduct
    saveProducts(products)
    return true
  }
  return false
}

function deleteProduct(productId) {
  const products = loadProducts()
  const filteredProducts = products.filter((p) => p.id !== productId)
  saveProducts(filteredProducts)
  return products.length !== filteredProducts.length
}

// Cargar tabla de productos
function loadProductsTable() {
  const products = loadProducts()
  const tbody = document.getElementById("products-table-body")

  console.log("[v0] Loading products table, found products:", products.length)

  tbody.innerHTML = ""

  if (products.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">No hay productos registrados</td>
            </tr>
        `
    return
  }

  products.forEach((product) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>
                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-thumb">` : "📷"}
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatPrice(product.price)}</td>
            <td class="${product.stock < 5 ? "stock-low" : "stock-ok"}">
                ${product.stock}
            </td>
            <td>
                <span class="status ${product.visible ? "status-active" : "status-inactive"}">
                    ${product.visible ? "Visible" : "Oculto"}
                </span>
            </td>
            <td>
                <button class="btn-edit" onclick="editProduct('${product.id}')">Editar</button>
                <button class="btn-delete" onclick="deleteProductConfirm('${product.id}')">Eliminar</button>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Filtrar productos
function filterProducts() {
  const searchTerm = document.getElementById("product-search").value.toLowerCase()
  const rows = document.querySelectorAll("#products-table-body tr")

  rows.forEach((row) => {
    const productName = row.cells[1].textContent.toLowerCase()
    const productCategory = row.cells[2].textContent.toLowerCase()

    if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

// Modal functions
function openProductModal(productId = null) {
  const modal = document.getElementById("product-modal")
  const title = document.getElementById("modal-title")
  const form = document.getElementById("product-form")

  if (productId) {
    title.textContent = "Editar Producto"
    const product = findProductById(productId)
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
  document.getElementById("product-modal").style.display = "none"
}

// Guardar producto
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Admin panel loaded")

  // Sincronizar productos con los valores por defecto
  syncProductsWithDefaults()

  // Cargar la tabla de productos
  loadProductsTable()

  // Configurar el formulario de productos
  const productForm = document.getElementById("product-form")
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const productData = {
        id: document.getElementById("product-id").value || generateId(),
        name: document.getElementById("product-name").value,
        category: document.getElementById("product-category").value,
        price: Number.parseInt(document.getElementById("product-price").value),
        stock: Number.parseInt(document.getElementById("product-stock").value),
        description: document.getElementById("product-description").value,
        image: document.getElementById("product-image").value,
        visible: document.getElementById("product-visible").value === "true",
        minStock: 3, // Valor por defecto para stock mínimo
        meta: "", // Valor por defecto para meta
      }

      const products = loadProducts()

      if (document.getElementById("product-id").value) {
        // Editar producto existente
        const index = products.findIndex((p) => p.id === productData.id)
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
})

// Editar producto
function editProduct(productId) {
  openProductModal(productId)
}

// Confirmar eliminación
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

// Función para verificar autenticación en páginas admin
function checkAdminAuth() {
  if (!localStorage.getItem("foodexpress-admin")) {
    window.location.href = "admin-login.html"
    return false
  }
  return true
}

// Sincronizar productos con los datos por defecto si no existen
function syncProductsWithDefaults() {
  const products = JSON.parse(localStorage.getItem("foodexpress-products"))

  // Si no hay productos o están vacíos, cargar los productos por defecto
  if (!products || products.length === 0) {
    console.log("[v0] No products found, loading defaults from main.js")

    // Productos por defecto (sincronizados con main.js)
    const defaultProducts = [
      {
        id: "orquidea",
        name: "Orquídea Cattleya",
        price: 29900,
        stock: 5,
        minStock: 3,
        category: "Plantas",
        visible: true,
        description: "La Orquídea Cattleya es conocida como la 'reina de las orquídeas' por su belleza y elegancia.",
        image: "asb_assets/images/Cattleya.jpg",
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
        image: "asb_assets/images/molinetes.jpg",
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
        image: "asb_assets/images/cactusSuculentas.jpg",
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
        image: "asb_assets/images/ramoRomantico.jpg",
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
        image: "asb_assets/images/bebederoPajaritos.jpg",
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
        image: "asb_assets/images/ramoRosas2.jpg",
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
        image: "asb_assets/images/portaPanda.jpg",
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
        image: "asb_assets/images/plantaCrisas.jpg",
        meta: "Lila y amarillo",
      },
    ]

    saveProducts(defaultProducts)
    console.log("[v0] Default products saved:", defaultProducts.length)
  } else {
    console.log("[v0] Products already exist:", products.length)
  }
}

// Cerrar sesión
function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem("foodexpress-admin")
    localStorage.removeItem("foodexpress-admin-user")

    // Disparar evento para actualizar la interfaz
    window.dispatchEvent(new Event("adminStatusChanged"))

    // Redirigir al inicio
    window.location.href = "index.html"
  }
}

/* ===============================
   ARCHIVO: js/productos-page.js
   DESCRIPCIÓN: JavaScript para la página de fichas de productos
   FUNCIONES: Cargar productos dinámicamente desde BD
   =============================== */

// Cargar productos dinámicamente según URL
document.addEventListener("DOMContentLoaded", () => {
  var urlParams = new URLSearchParams(window.location.search)
  var productId = urlParams.get("producto")

  if (productId) {
    cargarProductoDinamico(productId)
  } else {
    mostrarTodosLosProductos()
  }
})

// Cargar un producto específico desde BD
function cargarProductoDinamico(productId) {
  fetch("api/productos.php?action=id&id=" + productId)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.data) {
        renderizarFichaProducto(data.data)
      } else {
        mostrarTodosLosProductos()
      }
    })
    .catch((error) => {
      console.error("[v0] Error al cargar producto:", error)
      mostrarTodosLosProductos()
    })
}

// Renderizar ficha de producto dinámicamente
function renderizarFichaProducto(producto) {
  var container = document.querySelector("main.container")
  if (!container) return

  var ficha = document.createElement("section")
  ficha.className = "product-detail active"
  ficha.innerHTML = `
    <a href="index.html#productos" class="back-button">← Volver a productos</a>
    <div class="detail-container">
      <div class="detail-image">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="detail-info">
        <h2>${producto.nombre}</h2>
        <div class="detail-price">$${Number.parseFloat(producto.precio).toLocaleString("es-AR")}</div>
        <div class="meta">${producto.categoria}</div>
        <div class="detail-description">
          <p>${producto.descripcion || "Sin descripción"}</p>
        </div>
        <div class="actions">
          <button class="btn primary" onclick="addToCart(${producto.id}, '${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
          <a href="index.html#productos" class="btn">Seguir viendo</a>
        </div>
      </div>
    </div>
  `

  container.innerHTML = ""
  container.appendChild(ficha)
}

function mostrarTodosLosProductos() {
  var container = document.querySelector("main.container")
  if (!container) return

  fetch("api/productos.php?action=all")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.data) {
        renderizarGridProductos(data.data)
      } else {
        container.innerHTML = "<p>No hay productos disponibles</p>"
      }
    })
    .catch((error) => {
      console.error("[v0] Error al cargar productos:", error)
      container.innerHTML = "<p>Error al cargar productos</p>"
    })
}

// Renderizar grid de todos los productos
function renderizarGridProductos(productos) {
  var container = document.querySelector("main.container")
  if (!container) return

  container.innerHTML = ""
  var grid = document.createElement("div")
  grid.className = "products-grid"
  grid.style.display = "grid"
  grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))"
  grid.style.gap = "20px"
  grid.style.padding = "20px"

  productos.forEach((producto) => {
    var card = document.createElement("div")
    card.className = "card"
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 250px; object-fit: cover;">
      <h3><a href="productos.html?producto=${producto.id}" style="text-decoration: none; color: inherit;">${producto.nombre}</a></h3>
      <div class="price">$${Number.parseFloat(producto.precio).toLocaleString("es-AR")}</div>
      <div class="meta">${producto.categoria}</div>
      <div class="actions" style="display: flex; gap: 10px;">
        <button class="btn primary" onclick="addToCart(${producto.id}, '${producto.nombre}', ${producto.precio})" style="flex: 1;">Agregar</button>
        <a href="productos.html?producto=${producto.id}" class="btn" style="flex: 1; text-align: center;">Ver más</a>
      </div>
    `
    grid.appendChild(card)
  })

  container.appendChild(grid)
}

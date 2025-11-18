/* ===============================
   ARCHIVO: js/admin.js
   DESCRIPCIÓN: JavaScript específico para el panel de administración
   FUNCIONES: Gestión de productos, tabla interactiva, formularios modales
   =============================== */

// Verificar autenticación antes de cargar
if (!localStorage.getItem("arteplantas-admin")) {
  window.location.href = "admin-login.html"
}

// Variables globales
var productosAdmin = []
var productoEnEdicion = null
var imagenBase64 = null

/* ===============================
   INICIALIZACIÓN
   Cargar productos al abrir la página
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  cargarProductosAdmin()
  configurarEventosFormulario()
  configurarCargaImagenes()
})

/* ===============================
   FUNCIONES DE CARGA
   Obtener productos desde la API
   =============================== */

function cargarProductosAdmin() {
  fetch("api/admin-productos.php?action=all")
    .then((response) => response.json())
    .then((data) => {
      console.log("[v0] Respuesta de API:", data)
      if (data.status === "success" && data.data) {
        productosAdmin = data.data
        renderizarTablaProductos(productosAdmin)
      } else {
        console.error("[v0] Error en respuesta de API:", data.message)
        mostrarAlerta("Error al cargar productos: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("[v0] Error al cargar productos:", error)
      mostrarAlerta("Error al cargar productos", "error")
    })
}

/* ===============================
   FUNCIONES DE CARGA DE IMÁGENES
   Convertir imagen a base64 para envío
   =============================== */

function configurarCargaImagenes() {
  var fileInput = document.getElementById("product-image-file")
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      var file = e.target.files[0]
      if (file) {
        var maxSizeMB = 2
        var maxSizeBytes = maxSizeMB * 1024 * 1024

        if (file.size > maxSizeBytes) {
          mostrarAlerta("La imagen no debe superar " + maxSizeMB + "MB", "error")
          return
        }

        if (!file.type.startsWith("image/")) {
          mostrarAlerta("Por favor selecciona un archivo de imagen válido", "error")
          return
        }

        // Crear una imagen para validar y potencialmente redimensionar
        var img = new Image()
        img.onload = () => {
          var reader = new FileReader()
          reader.onload = (event) => {
            comprimirYConvertirImagen(file, (base64) => {
              imagenBase64 = base64
              var preview = document.getElementById("image-preview")
              preview.src = imagenBase64
              preview.style.display = "block"
              console.log("[v0] Imagen cargada (tamaño base64: " + imagenBase64.length + " bytes)")
            })
          }
          reader.readAsDataURL(file)
        }
        img.onerror = () => {
          mostrarAlerta("El archivo no es una imagen válida", "error")
        }
        img.src = URL.createObjectURL(file)
      }
    })
  }
}

function comprimirYConvertirImagen(file, callback) {
  var reader = new FileReader()
  reader.onload = (e) => {
    var img = new Image()
    img.onload = () => {
      var canvas = document.createElement("canvas")
      var ctx = canvas.getContext("2d")

      var maxWidth = 800
      var maxHeight = 800
      var width = img.width
      var height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      var base64 = canvas.toDataURL("image/jpeg", 0.85)
      callback(base64)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

/* ===============================
   FUNCIONES DE TABLA
   Mostrar y actualizar tabla de productos
   =============================== */

function renderizarTablaProductos(productos) {
  var tbody = document.getElementById("products-table-body")
  if (!tbody) return

  tbody.innerHTML = ""

  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No hay productos disponibles</td></tr>'
    return
  }

  productos.forEach((producto) => {
    var row = document.createElement("tr")
    var statusClass = producto.visible == 1 ? "status-active" : "status-inactive"
    var statusText = producto.visible == 1 ? "Visible" : "Oculto"
    var stockClass = producto.stock <= 5 ? "stock-low" : "stock-ok"

    row.innerHTML = `
      <td><img src="${producto.imagen}" alt="${producto.nombre}" class="product-thumb"></td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>$${Number.parseFloat(producto.precio).toLocaleString("es-AR")}</td>
      <td class="${stockClass}">${producto.stock}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
      <td>
        <button class="btn-edit" onclick="editarProducto(${producto.id})">Editar</button>
        <button class="btn-delete" onclick="eliminarProductoConConfirmacion(${producto.id})">Eliminar</button>
      </td>
    `

    tbody.appendChild(row)
  })
}

/* ===============================
   FUNCIONES MODAL
   Abrir y cerrar modal de formulario
   =============================== */

function openProductModal() {
  productoEnEdicion = null
  limpiarFormulario()
  imagenBase64 = null
  document.getElementById("modal-title").textContent = "Agregar Producto"
  document.getElementById("product-modal").style.display = "flex"
}

function closeProductModal() {
  document.getElementById("product-modal").style.display = "none"
  limpiarFormulario()
  imagenBase64 = null
}

// Cerrar modal al hacer clic fuera
window.addEventListener("click", (event) => {
  var modal = document.getElementById("product-modal")
  if (event.target === modal) {
    closeProductModal()
  }
})

function limpiarFormulario() {
  document.getElementById("product-form").reset()
  document.getElementById("product-id").value = ""
  document.getElementById("image-preview").style.display = "none"
  productoEnEdicion = null
  imagenBase64 = null
}

/* ===============================
   FUNCIONES CRUD
   Crear, editar, eliminar productos
   =============================== */

function editarProducto(id) {
  var producto = productosAdmin.find((p) => p.id == id)

  if (!producto) {
    mostrarAlerta("Producto no encontrado", "error")
    return
  }

  productoEnEdicion = producto
  imagenBase64 = null

  document.getElementById("product-id").value = producto.id
  document.getElementById("product-name").value = producto.nombre
  document.getElementById("product-price").value = producto.precio
  document.getElementById("product-category").value = producto.categoria
  document.getElementById("product-stock").value = producto.stock
  document.getElementById("product-description").value = producto.descripcion || ""
  document.getElementById("product-visible").value = producto.visible == 1 ? "true" : "false"

  var preview = document.getElementById("image-preview")
  preview.src = producto.imagen
  preview.style.display = "block"

  document.getElementById("modal-title").textContent = "Editar Producto"
  document.getElementById("product-modal").style.display = "flex"
}

function eliminarProductoConConfirmacion(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    eliminarProducto(id)
  }
}

function eliminarProducto(id) {
  fetch("api/admin-productos.php?id=" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        mostrarAlerta("Producto eliminado correctamente", "success")
        cargarProductosAdmin()
      } else {
        mostrarAlerta(data.message, "error")
      }
    })
    .catch((error) => {
      console.error("[v0] Error:", error)
      mostrarAlerta("Error al eliminar el producto", "error")
    })
}

/* ===============================
   FUNCIONES DE BÚSQUEDA
   Filtrar productos en la tabla
   =============================== */

function filterProducts() {
  var searchTerm = document.getElementById("product-search").value.toLowerCase()
  var productosFiltered = productosAdmin.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm) || producto.categoria.toLowerCase().includes(searchTerm),
  )
  renderizarTablaProductos(productosFiltered)
}

/* ===============================
   FUNCIONES DE FORMULARIO
   Guardar producto
   =============================== */

function configurarEventosFormulario() {
  var form = document.getElementById("product-form")
  if (form) {
    form.addEventListener("submit", guardarProducto)
  }
}

function guardarProducto(e) {
  e.preventDefault()

  var imagen = imagenBase64 || (productoEnEdicion ? productoEnEdicion.imagen : "")

  if (!imagen && !productoEnEdicion) {
    mostrarAlerta("Por favor selecciona una imagen", "error")
    return
  }

  var producto = {
    nombre: document.getElementById("product-name").value,
    precio: Number.parseFloat(document.getElementById("product-price").value),
    categoria: document.getElementById("product-category").value,
    stock: Number.parseInt(document.getElementById("product-stock").value),
    descripcion: document.getElementById("product-description").value,
    imagen: imagenBase64 || (productoEnEdicion ? productoEnEdicion.imagen : ""),
    visible: document.getElementById("product-visible").value === "true",
  }

  if (!producto.nombre || producto.precio <= 0) {
    mostrarAlerta("Por favor completa todos los campos correctamente", "error")
    return
  }

  if (productoEnEdicion) {
    producto.id = productoEnEdicion.id
    actualizarProductoEnBD(producto)
  } else {
    crearProductoEnBD(producto)
  }
}

function crearProductoEnBD(producto) {
  fetch("api/admin-productos.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        mostrarAlerta("Producto creado correctamente", "success")
        closeProductModal()
        cargarProductosAdmin()
      } else {
        mostrarAlerta(data.message, "error")
      }
    })
    .catch((error) => {
      console.error("[v0] Error:", error)
      mostrarAlerta("Error al crear el producto", "error")
    })
}

function actualizarProductoEnBD(producto) {
  fetch("api/admin-productos.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        mostrarAlerta("Producto actualizado correctamente", "success")
        closeProductModal()
        cargarProductosAdmin()
      } else {
        mostrarAlerta(data.message, "error")
      }
    })
    .catch((error) => {
      console.error("[v0] Error:", error)
      mostrarAlerta("Error al actualizar el producto", "error")
    })
}

/* ===============================
   FUNCIONES DE UTILIDAD
   Mostrar alertas
   =============================== */

function mostrarAlerta(mensaje, tipo) {
  var alerta = document.createElement("div")
  alerta.style.position = "fixed"
  alerta.style.top = "20px"
  alerta.style.right = "20px"
  alerta.style.background = tipo === "success" ? "#27ae60" : "#e74c3c"
  alerta.style.color = "white"
  alerta.style.padding = "15px 20px"
  alerta.style.borderRadius = "4px"
  alerta.style.zIndex = "3000"
  alerta.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
  alerta.textContent = mensaje

  document.body.appendChild(alerta)

  setTimeout(() => {
    alerta.remove()
  }, 4000)
}

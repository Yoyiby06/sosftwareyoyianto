// software.js

let inventory = [];
let cart = [];
let salesHistory = [];

function addProduct() {
  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const quantity = parseInt(document.getElementById('product-quantity').value);

  if (!name || isNaN(price) || isNaN(quantity)) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  const product = { name, price, quantity };
  inventory.push(product);
  displayInventory();
  clearInputs();
}

function clearInputs() {
  document.getElementById('product-name').value = "";
  document.getElementById('product-price').value = "";
  document.getElementById('product-quantity').value = "";
}

function displayInventory() {
  const inventoryList = document.getElementById('inventory-list');
  inventoryList.innerHTML = '';

  inventory.forEach((product, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${product.name} - S/ ${product.price.toFixed(2)} (${product.quantity})`;
    const addToCartBtn = document.createElement('button');
    addToCartBtn.innerText = "Añadir";
    addToCartBtn.classList.add("btn-action");
    addToCartBtn.onclick = () => addToCart(index);
    div.appendChild(addToCartBtn);
    inventoryList.appendChild(div);
  });
}

function addToCart(index) {
  const product = inventory[index];
  if (product.quantity === 0) {
    alert("No hay stock disponible");
    return;
  }
  product.quantity--;

  const existing = cart.find(p => p.name === product.name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name: product.name, price: product.price, quantity: 1 });
  }

  displayInventory();
  displayCart();
}

function displayCart() {
  const salesList = document.getElementById('sales-list');
  salesList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}`;
    salesList.appendChild(div);
    total += item.price * item.quantity;
  });

  document.getElementById('total').textContent = total.toFixed(2);
}

function completeSale() {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  salesHistory.push([...cart]);
  displaySalesHistory();
  generateInvoice();
  cart = [];
  displayCart();
}

function displaySalesHistory() {
  const historyList = document.getElementById('sales-history-list');
  historyList.innerHTML = '';
  salesHistory.forEach((sale, index) => {
    const entry = document.createElement('div');
    entry.classList.add('history-entry');
    const date = new Date().toLocaleString();
    entry.innerHTML = `<strong>Venta ${index + 1}</strong> (${date}):<br>` +
      sale.map(p => `${p.name} x${p.quantity} - S/ ${(p.price * p.quantity).toFixed(2)}`).join('<br>');
    historyList.appendChild(entry);
  });
}

function generateInvoice() {
  const invoiceBox = document.getElementById('invoice-box');
  const invoiceItems = document.getElementById('invoice-items');
  const invoiceTotal = document.getElementById('invoice-total');
  invoiceBox.style.display = 'block';
  invoiceItems.innerHTML = '';

  let total = 0;
  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('invoice-line');
    div.innerHTML = `${item.name} x${item.quantity} <span>S/ ${(item.price * item.quantity).toFixed(2)}</span>`;
    invoiceItems.appendChild(div);
    total += item.price * item.quantity;
  });

  invoiceTotal.textContent = total.toFixed(2);
}

function closeInvoice() {
  document.getElementById('invoice-box').style.display = 'none';
}

function printInvoice() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración inicial
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = 20; // Posición inicial en el eje Y

    // Título de la boleta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("BOLETA ELECTRÓNICA", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Información de la empresa
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("EMPRESARIOTEC", margin, y);
    doc.text("RUC: 12345678901", margin, y + 5);
    doc.text("Dirección: Av. Ejemplo 123, Lima, Perú", margin, y + 10);
    doc.text("Teléfono: +51 987 654 321", margin, y + 15);
    y += 25;

    // Información del cliente
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Cliente:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text("Nombre: Cliente Genérico", margin, y + 5);
    doc.text("DNI: 12345678", margin, y + 10);
    y += 20;

    // Tabla de productos
    doc.setFont("helvetica", "bold");
    doc.text("Detalle de la Compra:", margin, y);
    y += 10;

    // Encabezados de la tabla
    doc.setFontSize(10);
    doc.text("Producto", margin, y);
    doc.text("Cantidad", pageWidth / 2 - 20, y);
    doc.text("Precio Unit.", pageWidth / 2 + 20, y);
    doc.text("Subtotal", pageWidth - margin - 30, y, { align: "right" });
    y += 5;

    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y); // Línea separadora
    y += 5;

    // Detalles de los productos
    const invoiceItems = document.querySelectorAll("#invoice-items .invoice-line");
    let total = 0;

    invoiceItems.forEach(item => {
        const [name, quantityAndPrice] = item.textContent.split(" x");
        const [quantity, price] = quantityAndPrice.split(" S/ ");
        const subtotal = parseFloat(price) * parseInt(quantity);

        doc.setFont("helvetica", "normal");
        doc.text(name.trim(), margin, y);
        doc.text(quantity.trim(), pageWidth / 2 - 20, y);
        doc.text(`S/ ${parseFloat(price).toFixed(2)}`, pageWidth / 2 + 20, y);
        doc.text(`S/ ${subtotal.toFixed(2)}`, pageWidth - margin - 30, y, { align: "right" });

        total += subtotal;
        y += 10;
    });

    // Línea separadora antes del total
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Total
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", pageWidth / 2 + 20, y);
    doc.text(`S/ ${total.toFixed(2)}`, pageWidth - margin - 30, y, { align: "right" });
    y += 10;

    // Fecha y hora
    const date = new Date();
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${date.toLocaleDateString()}`, margin, y);
    doc.text(`Hora: ${date.toLocaleTimeString()}`, margin, y + 5);
    y += 15;

    // Mensaje de agradecimiento
    doc.setFont("helvetica", "italic");
    doc.text("¡Gracias por su compra!", pageWidth / 2, y, { align: "center" });

    // Guardar o imprimir la boleta
    doc.save("boleta-electronica.pdf");
}

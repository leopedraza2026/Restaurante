// Datos del menú (puedes modificarlo fácilmente)
const MENU = [
  { id: 'pollo-brasa', name: 'Pollo a la brasa (1/2)', price: 9.50, desc: 'Jugoso pollo a la brasa con sazón casera.' },
  { id: 'pollo-entero', name: 'Pollo a la brasa (entero)', price: 17.00, desc: 'Pollo entero para compartir.' },
  { id: 'combo-familiar', name: 'Combo Familiar', price: 28.00, desc: 'Pollo entero + papas + ensalada.' },
  { id: 'alitas-picantes', name: 'Alitas Picantes (8)', price: 8.00, desc: 'Alitas con salsa especial picante.' },
  { id: 'papas-gajo', name: 'Papas gajo', price: 3.50, desc: 'Papas crocantes al horno.' },
  { id: 'ensalada', name: 'Ensalada fresca', price: 3.00, desc: 'Ensalada mixta con aderezo.' },
  { id: 'bebida-500', name: 'Bebida 500ml', price: 1.80, desc: 'Refresco o agua.' },
];

let cart = loadCart();

// Elementos DOM
const menuEl = document.getElementById('menu');
const cartCountEl = document.getElementById('cart-count');
const viewCartBtn = document.getElementById('view-cart-btn');
const cartPanel = document.getElementById('cart-panel');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const orderSection = document.getElementById('order-section');
const orderForm = document.getElementById('order-form');
const messageEl = document.getElementById('message');
const cancelOrderBtn = document.getElementById('cancel-order-btn');
const yearEl = document.getElementById('year');

// Inicialización
yearEl.textContent = new Date().getFullYear();
renderMenu();
updateCartUI();

// Render del menú
function renderMenu(){
  menuEl.innerHTML = '';
  MENU.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.innerHTML = `
      <h4>${item.name}</h4>
      <p class="small">${item.desc}</p>
      <div class="price">$${item.price.toFixed(2)}</div>
      <div class="actions">
        <button class="btn primary" data-id="${item.id}">Añadir</button>
        <button class="btn secondary" data-id="${item.id}" data-action="info">Info</button>
      </div>
    `;
    menuEl.appendChild(card);
  });

  // eventos de añadir
  menuEl.querySelectorAll('.menu-item .primary').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      addToCart(id);
    });
  });
  menuEl.querySelectorAll('.menu-item [data-action="info"]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      const it = MENU.find(m=>m.id===id);
      showMessage(`${it.name} — ${it.desc} — $${it.price.toFixed(2)}`, 2500);
    });
  });
}

// Carrito: añadir, eliminar, cantidad
function addToCart(id){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateCartUI();
  showMessage('Producto añadido al carrito', 900);
}

function changeQty(id, qty){
  const idx = cart.findIndex(i=>i.id===id);
  if(idx>=0){
    if(qty <= 0) cart.splice(idx,1);
    else cart[idx].qty = qty;
    saveCart();
    updateCartUI();
  }
}

function clearCart(){
  cart = [];
  saveCart();
  updateCartUI();
}

// UI del carrito
function updateCartUI(){
  const totalItems = cart.reduce((s,i)=>s+i.qty,0);
  cartCountEl.textContent = totalItems;
  cartItemsEl.innerHTML = '';
  if(cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="small">Tu carrito está vacío.</div>';
  } else {
    cart.forEach(ci=>{
      const itemData = MENU.find(m=>m.id===ci.id);
      const line = document.createElement('div');
      line.className = 'cart-item';
      line.innerHTML = `
        <div>
          <div><strong>${itemData.name}</strong></div>
          <div class="small">$${itemData.price.toFixed(2)} x ${ci.qty} = $${(itemData.price*ci.qty).toFixed(2)}</div>
        </div>
        <div class="qty-controls">
          <button class="btn" data-id="${ci.id}" data-action="minus">-</button>
          <div class="small">${ci.qty}</div>
          <button class="btn" data-id="${ci.id}" data-action="plus">+</button>
        </div>
      `;
      cartItemsEl.appendChild(line);
    });

    // bind botones qty
    cartItemsEl.querySelectorAll('[data-action]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const id = e.currentTarget.dataset.id;
        const action = e.currentTarget.dataset.action;
        const existing = cart.find(c=>c.id===id);
        if(!existing) return;
        if(action==='plus') changeQty(id, existing.qty+1);
        if(action==='minus') changeQty(id, existing.qty-1);
      });
    });
  }

  const total = cart.reduce((s,ci)=> {
    const p = MENU.find(m=>m.id===ci.id).price;
    return s + p*ci.qty;
  },0);
  cartTotalEl.textContent = total.toFixed(2);
}

// Persistencia sencilla
function saveCart(){
  localStorage.setItem('pollo_cart_v1', JSON.stringify(cart));
}
function loadCart(){
  try{
    const raw = localStorage.getItem('pollo_cart_v1');
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

// Mensajes temporales
let msgTimeout = null;
function showMessage(text, ms=1500){
  if(msgTimeout) clearTimeout(msgTimeout);
  messageEl.textContent = text;
  messageEl.classList.remove('hidden');
  msgTimeout = setTimeout(()=>messageEl.classList.add('hidden'), ms);
}

// Botones UI
viewCartBtn.addEventListener('click', ()=>{
  const isHidden = cartPanel.classList.contains('hidden');
  if(isHidden){
    cartPanel.classList.remove('hidden');
    cartPanel.setAttribute('aria-hidden','false');
  } else {
    cartPanel.classList.add('hidden');
    cartPanel.setAttribute('aria-hidden','true');
  }
});

clearCartBtn.addEventListener('click', ()=>{
  clearCart();
  showMessage('Carrito vaciado', 900);
});

checkoutBtn.addEventListener('click', ()=>{
  if(cart.length === 0){
    showMessage('Añade al menos un producto para ordenar', 1400);
    return;
  }
  orderSection.classList.remove('hidden');
  orderSection.scrollIntoView({behavior:'smooth'});
});

cancelOrderBtn.addEventListener('click', ()=>{
  orderSection.classList.add('hidden');
});

// Envío de pedido (simulado)
orderForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const notes = document.getElementById('customer-notes').value.trim();

  if(!name || !phone || !address){
    showMessage('Completa los campos requeridos', 1400);
    return;
  }

  const order = {
    id: 'ORD-' + Date.now(),
    created_at: new Date().toISOString(),
    customer: { name, phone, address, notes },
    items: cart.map(ci => {
      const m = MENU.find(mm => mm.id === ci.id);
      return { id: ci.id, name: m.name, qty: ci.qty, price: m.price };
    }),
    total: cart.reduce((s,ci)=> s + (MENU.find(m=>m.id===ci.id).price * ci.qty), 0)
  };

  // Simulamos envío (aquí podrías conectar una API real)
  console.log('Pedido enviado (simulado):', order);
  showMessage('Pedido enviado. ¡Gracias!', 2200);

  // Limpiar carrito y formulario
  clearCart();
  orderForm.reset();
  orderSection.classList.add('hidden');
});

// Inicial: guardar si no existe
saveCart();
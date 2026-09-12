document.addEventListener("DOMContentLoaded", () => {
  const USER = "Limber";
  const PASS = "deivi246";

  const products = [
    ["Coca Cola 600ml","bebidas",8,"imagenes/COCA.COLA.jpg"],["Jugo de Naranja 1L","bebidas",10,"imagenes/JUGO.NARANJA.jpg"],["Agua Mineral 1L","bebidas",5,"imagenes/AGUA.MINERAL.jpg"],["Café 250g","bebidas",15,"imagenes/CAFE.jpg"],
    ["Harina de Trigo 1kg","harinas",7,"imagenes/HARINA.TRIGO.jpg"],["Harina de Maíz 1kg","harinas",6,"imagenes/HARINA.MAIZ.jpg"],["Arroz 1kg","harinas",8,"imagenes/ARROZ.jpg"],["Azúcar 1kg","harinas",5,"imagenes/AZUCAR.jpg"],
    ["Tomate 1kg","verduras",6,"imagenes/TOMATE.jpg"],["Lechuga 1kg","verduras",5,"imagenes/LECHUGA.jpg"],["Zanahoria 1kg","verduras",4,"imagenes/ZANAHORIA.jpg"],["Papa 1kg","verduras",5,"imagenes/PAPA.jpg"],
    ["Manzana 1kg","frutas",12,"imagenes/MANZANA.jpg"],["Plátano 1kg","frutas",8,"imagenes/BANANA.jpg"],["Naranja 1kg","frutas",10,"imagenes/NARANJA.jpg"],["Uva 1kg","frutas",15,"imagenes/UVA.jpg"]
  ].map((p,i)=>({id:i+1,name:p[0],cat:p[1],price:p[2],icon:p[3]}));

  const $ = id => document.getElementById(id);
  const loginPage=$("loginPage"), app=$("appPage"), form=$("loginForm"), msg=$("loginMessage");
  const grid=$("productsGrid"), noProducts=$("noProducts"), search=$("search");
  const cartPanel=$("cartPanel"), overlay=$("overlay"), cartItems=$("cartItems"), empty=$("emptyCart"), summary=$("summary");
  let category="todos", cart=[], selectedPayment="Efectivo", lastSale=null;

  const loadSales=()=>JSON.parse(localStorage.getItem("empresaHogarVentas")||"[]");
  const saveSales=s=>localStorage.setItem("empresaHogarVentas",JSON.stringify(s));
  const money=n=>"Bs. "+Number(n).toFixed(2);
  const count=()=>cart.reduce((s,x)=>s+x.qty,0);

  function setCounts(){
    $("").textContent=count();
    $("headCount").textContent=count();
    $("cartCountTitle").textContent=count();
  }

  function renderProducts(){
    const term=(search.value||"").toLowerCase().trim();
    const list=products.filter(p=>(category==="todos"||p.cat===category)&&p.name.toLowerCase().includes(term));
    grid.innerHTML=list.map(p=>`
      <article class="product">
        <div class="product-img"><img src="${p.icon}" alt="${p.name}"></div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <button class="add" data-add="${p.id}">🛒 Agregar</button>
      </article>`).join("");
    noProducts.classList.toggle("hidden",list.length>0);
    const names={todos:"Todos los productos",bebidas:"Bebidas",harinas:"Harinas y otros",verduras:"Verduras",frutas:"Frutas"};
    $("productsTitle").textContent=names[category];
    $("productsSubtitle").textContent=`${list.length} producto${list.length===1?"":"s"} disponible${list.length===1?"":"s"}`;
    $("pageTitle").textContent=category==="todos"?"Inicio":names[category];
  }

  function renderCart(){
    setCounts();
    if(!cart.length){
      cartItems.innerHTML=""; empty.classList.remove("hidden"); summary.classList.add("hidden"); return;
    }
    empty.classList.add("hidden"); summary.classList.remove("hidden");
    cartItems.innerHTML=cart.map(x=>`
      <div class="cart-row">
        <div class="cart-img"><img src="${x.icon}" alt="${x.name}"></div>
        <div><h4>${x.name}</h4><div class="unit">${money(x.price)}</div>
          <div class="qty"><button data-dec="${x.id}">−</button><b>${x.qty}</b><button data-inc="${x.id}">+</button></div>
        </div>
        <button class="delete" data-del="${x.id}">🗑</button>
      </div>`).join("");
    const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
    $("subtotal").textContent=money(total);
    $("total").textContent=money(total);
  }

  function openCart(){cartPanel.classList.add("open");overlay.classList.remove("hidden");renderCart()}
  function closeCart(){cartPanel.classList.remove("open");overlay.classList.add("hidden")}
  function totalCart(){return cart.reduce((s,x)=>s+x.price*x.qty,0)}

  form.addEventListener("submit",e=>{
    e.preventDefault();
    const u=$("usuario").value.trim(), p=$("password").value;
    if(u===USER && p===PASS){
      loginPage.classList.add("hidden"); app.classList.remove("hidden");
      $("headerUser").textContent=u; $("sideUser").textContent=u;
      msg.textContent=""; $("password").value=""; renderProducts();
    }else{
      msg.textContent="❌ Usuario o contraseña incorrectos.";
      $("password").select();
    }
  });

  $("togglePassword").addEventListener("click",()=>{
    const input=$("password"); input.type=input.type==="password"?"text":"password";
  });

  document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{
    category=btn.dataset.category;
    document.querySelectorAll(".menu-item").forEach(x=>x.classList.toggle("active",x.dataset.category===category));
    renderProducts();
    if(window.innerWidth<=700) $("sidebar").classList.remove("mobile-open");
    window.scrollTo({top:0,behavior:"smooth"});
  }));

  grid.addEventListener("click",e=>{
    const id=Number(e.target.dataset.add); if(!id)return;
    const p=products.find(x=>x.id===id), found=cart.find(x=>x.id===id);
    if(found)found.qty++; else cart.push({...p,qty:1});
    renderCart(); openCart();
  });

  cartItems.addEventListener("click",e=>{
    let id;
    if(e.target.dataset.inc){id=Number(e.target.dataset.inc);cart.find(x=>x.id===id).qty++}
    if(e.target.dataset.dec){id=Number(e.target.dataset.dec);const x=cart.find(x=>x.id===id);x.qty--;if(x.qty<=0)cart=cart.filter(y=>y.id!==id)}
    if(e.target.dataset.del){id=Number(e.target.dataset.del);cart=cart.filter(x=>x.id!==id)}
    renderCart();
  });

  search.addEventListener("input",renderProducts);
  $("cartButton").addEventListener("click",openCart);
  $("menuCart").addEventListener("click",openCart);
  $("closeCart").addEventListener("click",closeCart);
  overlay.addEventListener("click",closeCart);
  $("continue").addEventListener("click",closeCart);
  $("shopNow").addEventListener("click",()=>{category="todos";renderProducts();window.scrollTo({top:300,behavior:"smooth"})});

  // PAYMENT
  document.querySelectorAll(".payment-option").forEach(btn=>{
    btn.addEventListener("click",()=>{
      selectedPayment=btn.dataset.payment;
      document.querySelectorAll(".payment-option").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      $("cashInfo").classList.toggle("hidden",selectedPayment!=="Efectivo");
      $("qrInfo").classList.toggle("hidden",selectedPayment!=="QR");
      $("cardInfo").classList.toggle("hidden",selectedPayment!=="Tarjeta de débito");
    });
  });

  $("checkout").addEventListener("click",()=>{
    if(!cart.length)return;
    $("paymentTotal").textContent=money(totalCart());
    $("customerName").value="";
    $("wantNit").checked=false;
    $("customerNit").value="";
    $("nitBox").classList.add("hidden");
    $("paymentModal").classList.remove("hidden");
    setTimeout(()=>$("customerName").focus(),100);
  });

  $("wantNit").addEventListener("change",()=>{
    $("nitBox").classList.toggle("hidden", !$("wantNit").checked);
    if(!$("wantNit").checked) $("customerNit").value="";
    else $("customerNit").focus();
  });
  $("closePayment").addEventListener("click",()=>$("paymentModal").classList.add("hidden"));

  $("confirmPayment").addEventListener("click",()=>{
    if(!cart.length)return;

    const customerName=$("customerName").value.trim();
    const wantsNit=$("wantNit").checked;
    const customerNit=$("customerNit").value.trim();

    if(!customerName){
      alert("Por favor, ingresa el nombre del cliente.");
      $("customerName").focus();
      return;
    }

    if(wantsNit && !customerNit){
      alert("Si seleccionas NIT, debes ingresar el número de NIT.");
      $("customerNit").focus();
      return;
    }

    const sales=loadSales();
    const next=(sales.length?sales.length+1:1);
    const sale={
      id: String(next).padStart(6,"0"),
      date:new Date().toLocaleString("es-BO"),
      user:$("headerUser").textContent,
      customer:customerName,
      nit:wantsNit?customerNit:"",
      payment:selectedPayment,
      items:cart.map(x=>({name:x.name,price:x.price,qty:x.qty,icon:x.icon})),
      quantity:count(),
      total:totalCart()
    };
    sales.push(sale); saveSales(sales); lastSale=sale;
    $("paymentModal").classList.add("hidden"); closeCart();
    $("saleNumber").textContent=sale.id;
    $("saleCustomer").textContent=sale.customer;
    $("saleNit").textContent=sale.nit || "Sin NIT";
    $("salePayment").textContent=sale.payment;
    $("purchaseItems").textContent=sale.quantity;
    $("purchaseTotal").textContent=money(sale.total);
    $("saleMessage").textContent=`Venta ${sale.id} registrada correctamente.`;
    $("successModal").classList.remove("hidden");
  });

  function buildInvoice(sale){
    const rows=sale.items.map(x=>`<tr><td>${x.name}</td><td>${x.qty}</td><td class="right">${money(x.price)}</td><td class="right">${money(x.price*x.qty)}</td></tr>`).join("");
    $("invoicePrint").innerHTML=`
      <div class="invoice-document">
        <div class="invoice-head">
          <div><h1>EMPRESA HOGAR</h1><div>Tu hogar, nuestra prioridad</div><div>Sistema de ventas</div></div>
          <div class="right"><b>FACTURA / COMPROBANTE</b><br>N.º ${sale.id}<br>${sale.date}</div>
        </div>
        <p><b>Cliente:</b> ${sale.customer || sale.user}<br><b>NIT:</b> ${sale.nit || "Sin NIT"}<br><b>Forma de pago:</b> ${sale.payment}</p>
        <table><thead><tr><th>Producto</th><th>Cant.</th><th class="right">P. Unit.</th><th class="right">Importe</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <div class="invoice-total">TOTAL: ${money(sale.total)}</div>
        <p style="margin-top:30px">Gracias por su compra.</p>
      </div>`;
  }

  $("pdfBtn").addEventListener("click",()=>{
    if(!lastSale)return;
    buildInvoice(lastSale);
    window.print();
  });

  const closeSuccess=()=>{$("successModal").classList.add("hidden");cart=[];renderCart()};
  $("finish").addEventListener("click",closeSuccess);
  $("closeSuccess").addEventListener("click",closeSuccess);

  // SALES REGISTRY
  function renderSales(){
    const sales=loadSales().reverse();
    $("salesList").innerHTML=sales.length?sales.map(s=>`
      <div class="sale-record">
        <div class="sale-record-head"><b>Venta N.º ${s.id}</b><b>${money(s.total)}</b></div>
        <small>${s.date} · Cliente: ${s.customer || s.user || "-"} · ${s.payment} · ${s.quantity} productos</small>
        <div class="sale-actions">
          <button data-print-sale="${s.id}">📄 PDF / Imprimir</button>
          <button class="delete-sale" data-delete-sale="${s.id}">🗑 Eliminar</button>
        </div>
      </div>`).join(""):`<div class="no-sales">📋<h3>No hay ventas registradas</h3><p>Las compras confirmadas aparecerán aquí.</p></div>`;
    $("salesList").querySelectorAll("[data-print-sale]").forEach(b=>b.addEventListener("click",()=>{
      const sale=loadSales().find(s=>s.id===b.dataset.printSale); if(s){buildInvoice(sale);window.print()}
    }));
    $("salesList").querySelectorAll("[data-delete-sale]").forEach(b=>b.addEventListener("click",()=>{
      const remaining=loadSales().filter(s=>s.id!==b.dataset.deleteSale);saveSales(remaining);renderSales();
    }));
  }

  $("menuSales").addEventListener("click",()=>{
    renderSales(); $("salesModal").classList.remove("hidden");
    if(window.innerWidth<=700) $("sidebar").classList.remove("mobile-open");
  });
  $("closeSales").addEventListener("click",()=>$("salesModal").classList.add("hidden"));

  $("mobileMenu").addEventListener("click",()=>{$("sidebar").classList.toggle("mobile-open")});
  $("logoutBtn").addEventListener("click",()=>{
    app.classList.add("hidden"); loginPage.classList.remove("hidden");
    cart=[]; renderCart(); $("usuario").value=""; $("password").value="";
  });

  renderProducts(); renderCart();
});
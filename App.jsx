import { useState, useEffect } from "react";

const WHATSAPP = "59896533730";

const C = {
  darkOlive:  "#4a4820",
  midOlive:   "#6b6820",
  lightOlive: "#a8b84b",
  sage:       "#d7d5a5",   // color de la imagen — fondo y botón agregar
  card:       "#fffef5",
  border:     "#b8b460",
  muted:      "#7a7640",
  text:       "#2e2c10",
  creamLight: "#ddd88e",
  whatsapp:   "#25D366",
};

const CON_MIEL = [
  "Copos de maíz","Proteína de soja","Avena","Nueces","Almendras",
  "Castañas de cajú","Coco rallado","Semillas de zapallo",
  "Aceite de coco","Miel","Chips de banana","Pasas de uva","Chocolate",
];
const SIN_MIEL = [
  "Copos de maíz","Proteína de soja","Avena","Nueces","Almendras",
  "Castañas de cajú","Coco rallado","Semillas de zapallo",
  "Aceite de coco","Claras de huevo","Chips de banana","Pasas de uva","Chocolate",
];
const CUSTOM_INGREDIENTS = [
  "Copos de maíz","Avena","Proteína de soja","Castañas de cajú",
  "Almendras","Nueces","Semillas de zapallo","Chips de banana",
  "Miel","Aceite de coco","Coco rallado","Chocolate","Pasas de uva","Claras de huevo",
];

const CUSTOM_SIZES  = [{ label:"1 kg", value:"1kg", price:740 }, { label:"½ kg", value:"500g", price:360 }];
const CLASSIC_SIZES = [{ label:"1 kg", value:"1kg", price:660 }, { label:"½ kg", value:"500g", price:350 }];

function Star({ size = 48, color = C.darkOlive }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"0.7rem", fontWeight:700,
      textTransform:"uppercase", letterSpacing:"2px", color:C.muted, marginBottom:"8px" }}>
      {children}
    </p>
  );
}

function SizeSelector({ sizes, active, onSelect }) {
  return (
    <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
      {sizes.map(s => (
        <button key={s.value} onClick={() => onSelect(s.value)} style={{
          flex:1, padding:"11px 8px", borderRadius:"10px", cursor:"pointer",
          border:`2px solid ${active === s.value ? C.darkOlive : C.border}`,
          background: active === s.value ? C.darkOlive : C.sage,
          color: active === s.value ? C.creamLight : C.muted,
          fontFamily:"'Josefin Sans',sans-serif", fontWeight:700, fontSize:"0.88rem",
          lineHeight:1.5, transition:"all 0.15s",
        }}>
          {s.label}<br/>
          <span style={{ fontSize:"1rem", color: active === s.value ? C.creamLight : C.darkOlive }}>
            ${s.price}
          </span>
        </button>
      ))}
    </div>
  );
}

const cardStyle = {
  background: C.card, borderRadius:"18px", padding:"26px",
  boxShadow:"0 4px 24px rgba(74,72,32,0.10)", border:`1px solid ${C.border}`,
};

const inputSt = {
  padding:"12px 15px", borderRadius:"10px", border:`1.5px solid ${C.border}`,
  fontSize:"0.9rem", fontFamily:"'Josefin Sans',sans-serif", color:C.text,
  background:C.sage, width:"100%",
};

export default function Granomix() {
  const [customSize, setCustomSize]   = useState("1kg");
  const [customSel, setCustomSel]     = useState([]);
  const [classicSize, setClassicSize] = useState("1kg");
  const [classicType, setClassicType] = useState("con miel");
  const [removed, setRemoved]         = useState([]);
  const [cart, setCart]               = useState([]);
  const [name, setName]               = useState("");
  const [phone, setPhone]             = useState("");
  const [address, setAddress]         = useState("");
  const [notes, setNotes]             = useState("");
  const [refName, setRefName]         = useState("");
  const [refPhone, setRefPhone]       = useState("");
  const [delivery, setDelivery]       = useState("pickup");
  const [payment, setPayment]         = useState("");
  const [cashAmount, setCashAmount]   = useState("");
  const [flash, setFlash]             = useState(null);

  const baseIngredients = classicType === "con miel" ? CON_MIEL : SIN_MIEL;

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Josefin+Sans:wght@400;600;700&display=swap');
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { background:${C.sage}; }
      @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(1.05)} 100%{transform:scale(1)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      .fade-up { animation: fadeUp 0.3s ease forwards; }
      input:focus, textarea:focus { outline:none; border-color:${C.darkOlive} !important; box-shadow:0 0 0 3px rgba(74,72,32,0.15); }
      button { font-family:'Josefin Sans',sans-serif; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => { setRemoved([]); }, [classicType]);

  const toggleRemove = (ing) => {
    if (removed.includes(ing)) setRemoved(p => p.filter(i => i !== ing));
    else if (removed.length < 3) setRemoved(p => [...p, ing]);
  };

  const toggleCustom = (ing) =>
    setCustomSel(p => p.includes(ing) ? p.filter(i => i !== ing) : [...p, ing]);

  const customPrice  = CUSTOM_SIZES.find(s => s.value === customSize)?.price;
  const classicPrice = CLASSIC_SIZES.find(s => s.value === classicSize)?.price;

  const doFlash = (t) => { setFlash(t); setTimeout(() => setFlash(null), 1100); };

  const addCustom = () => {
    if (!customSel.length) return;
    setCart(p => [...p, { id:Date.now(), type:"custom", size:customSize, ingredients:[...customSel], price:customPrice }]);
    setCustomSel([]);
    doFlash("custom");
  };

  const addClassic = () => {
    const finalIng = baseIngredients.filter(i => !removed.includes(i));
    setCart(p => [...p, { id:Date.now(), type:"classic", size:classicSize, classicType, ingredients:finalIng, removed:[...removed], price:classicPrice }]);
    setRemoved([]);
    doFlash("classic");
  };

  const removeItem = (id) => setCart(p => p.filter(i => i.id !== id));
  const total = cart.reduce((s, i) => s + i.price, 0);
  const isTransfer = payment === "transferencia-itau" || payment === "transferencia-santander";
  const canSend = name.trim() && phone.trim() && cart.length && payment &&
    (delivery === "pickup" || address.trim());

  const sendOrder = () => {
    if (!canSend) return;
    let msg = `*Pedido GRANOMIX*\n\n`;
    msg += `Nombre: ${name.trim()}\n`;
    msg += `Teléfono: ${phone.trim()}\n`;
    msg += delivery === "pickup"
      ? `Retiro: Pick up (a coordinar por WhatsApp)\n`
      : `Entrega a domicilio (día a coordinar por WhatsApp): ${address.trim()}\n`;
    msg += `\nProductos:\n`;
    cart.forEach((item, i) => {
      if (item.type === "custom") {
        msg += `\n${i+1}. Armá tu granola (${item.size}) - $${item.price}\n`;
        msg += `   Ingredientes: ${item.ingredients.join(", ")}\n`;
      } else {
        msg += `\n${i+1}. Granola ${item.classicType} (${item.size}) - $${item.price}\n`;
        if (item.removed.length) msg += `   Sin: ${item.removed.join(", ")}\n`;
      }
    });
    msg += `\nTotal: $${total}`;
    if (payment === "efectivo") {
      msg += `\nPago: Efectivo${cashAmount.trim() ? ` (paga con $${cashAmount.trim()})` : ""}`;
    } else {
      msg += `\nPago: ${payment === "transferencia-itau" ? "Transferencia Itaú" : "Transferencia Santander"} (solicitar número de cuenta por WhatsApp y enviar comprobante)`;
    }
    if (notes.trim()) msg += `\n\nAclaraciones: ${notes.trim()}`;
    if (refName.trim()) msg += `\n\nReferido por: ${refName.trim()}${refPhone.trim() ? ` - Tel: ${refPhone.trim()}` : ""}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ fontFamily:"'Josefin Sans',sans-serif", background:C.sage, minHeight:"100vh", color:C.text }}>

      {/* ── HEADER ── */}
      <header style={{ background:C.darkOlive, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, display:"flex" }}>
          {Array.from({length:20}).map((_, i) => (
            <div key={i} style={{ flex:1, background:i%2===0 ? C.darkOlive : C.midOlive, opacity:0.5 }} />
          ))}
        </div>
        <div style={{ position:"relative", zIndex:1, padding:"32px 24px 28px", display:"flex", alignItems:"center", justifyContent:"center", gap:"20px" }}>
          <Star size={42} color={C.creamLight} />
          <h1 style={{ fontFamily:"'Dancing Script',cursive", fontSize:"clamp(2.8rem,9vw,4.2rem)", color:C.creamLight, lineHeight:1, fontWeight:700, letterSpacing:"1px" }}>
            granomix
          </h1>
          <Star size={42} color={C.creamLight} />
        </div>
      </header>

      <main style={{ maxWidth:"960px", margin:"0 auto", padding:"20px 16px 60px" }}>

        {/* ── INFO STRIP ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"12px", marginBottom:"24px" }}>
          {[
            { title:"Pick up", desc:"Todos los días\nPunta Carretas y Ciudad Vieja\nDía y hora a coordinar por WhatsApp" },
            { title:"Envío a domicilio", desc:"Gratis a todo Montevideo\nDía a coordinar por WhatsApp" },
            { title:"Tiempos de entrega", desc:"Lo recibís dentro de los tres días siguientes a que hacés el pedido." },
          ].map(item => (
            <div key={item.title} style={{ background:C.darkOlive, borderRadius:"12px", padding:"16px 18px" }}>
              <p style={{ color:C.creamLight, fontWeight:700, fontSize:"0.8rem", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"6px" }}>
                {item.title}
              </p>
              <p style={{ color:C.creamLight, fontSize:"0.81rem", lineHeight:1.65, whiteSpace:"pre-line", opacity:0.9 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── REFERRAL BANNER ── */}
        <div style={{ background:C.darkOlive, borderRadius:"14px", padding:"18px 22px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"16px" }}>
          <Star size={30} color={C.creamLight} />
          <div>
            <p style={{ color:C.creamLight, fontWeight:700, fontSize:"0.88rem" }}>Programa de referidos</p>
            <p style={{ color:C.creamLight, fontSize:"0.81rem", marginTop:"3px", lineHeight:1.55, opacity:0.8 }}>
              Traés un cliente nuevo y cuando compra, te llevás un 50% de descuento en tu próxima compra.
            </p>
          </div>
        </div>

        {/* ── PRODUCTS: clásica primero, luego armá ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:"20px", marginBottom:"22px" }}>

          {/* GRANOLA CLÁSICA — primero */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily:"'Dancing Script',cursive", fontSize:"1.7rem", color:C.darkOlive, marginBottom:"4px" }}>
              Granola clásica
            </h2>
            <p style={{ color:C.muted, fontSize:"0.8rem", marginBottom:"20px" }}>Podés eliminar hasta 3 ingredientes</p>

            <SectionLabel>Tipo</SectionLabel>
            <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
              {["con miel","sin miel"].map(t => (
                <button key={t} onClick={() => setClassicType(t)} style={{
                  flex:1, padding:"11px", borderRadius:"10px", cursor:"pointer",
                  border:`2px solid ${classicType === t ? C.darkOlive : C.border}`,
                  background: classicType === t ? C.darkOlive : C.sage,
                  color: classicType === t ? C.creamLight : C.muted,
                  fontWeight:700, fontSize:"0.85rem", textTransform:"capitalize", transition:"all 0.15s",
                }}>
                  {t === "con miel" ? "Con miel" : "Sin miel"}
                </button>
              ))}
            </div>

            <SectionLabel>Tamaño</SectionLabel>
            <SizeSelector sizes={CLASSIC_SIZES} active={classicSize} onSelect={setClassicSize} />

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
              <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:C.muted }}>
                Ingredientes
              </p>
              <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"0.7rem", fontWeight:700, color: removed.length > 0 ? "#c0573a" : C.muted, minWidth:"90px", textAlign:"right" }}>
                {removed.length === 0 ? "Eliminá hasta 3" : `Eliminaste ${removed.length}/3`}
              </p>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", marginBottom:"18px" }}>
              {baseIngredients.map(ing => {
                const isRemoved = removed.includes(ing);
                const maxed = removed.length >= 3 && !isRemoved;
                return (
                  <button key={ing} onClick={() => toggleRemove(ing)} disabled={maxed} style={{
                    padding:"6px 12px", borderRadius:"20px", cursor:maxed ? "not-allowed" : "pointer",
                    border:`1.5px solid ${isRemoved ? "#c0573a" : C.border}`,
                    background: isRemoved ? "#f5e8e4" : C.sage,
                    color: isRemoved ? "#c0573a" : maxed ? "#b0a870" : C.muted,
                    fontSize:"0.78rem", fontWeight:600,
                    textDecoration:isRemoved ? "line-through" : "none",
                    opacity:maxed ? 0.45 : 1, transition:"all 0.14s",
                  }}>
                    {ing}
                  </button>
                );
              })}
            </div>

            <button onClick={addClassic} style={{
              width:"100%", padding:"13px", borderRadius:"10px", border:"none",
              background: C.sage, color: C.darkOlive,
              border: `2px solid ${C.border}`,
              fontWeight:700, fontSize:"0.88rem", cursor:"pointer",
              letterSpacing:"1px", textTransform:"uppercase", transition:"all 0.15s",
              animation:flash === "classic" ? "pop 0.3s ease" : "none",
            }}>
              {flash === "classic" ? "Agregado" : "+ Agregar al pedido"}
            </button>
          </div>

          {/* ARMÁ TU GRANOLA — segundo */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily:"'Dancing Script',cursive", fontSize:"1.7rem", color:C.darkOlive, marginBottom:"4px" }}>
              Armá tu granola
            </h2>
            <p style={{ color:C.muted, fontSize:"0.8rem", marginBottom:"20px" }}>Seleccioná los ingredientes que querés</p>

            <SectionLabel>Tamaño</SectionLabel>
            <SizeSelector sizes={CUSTOM_SIZES} active={customSize} onSelect={setCustomSize} />

            <SectionLabel>Ingredientes</SectionLabel>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", marginBottom:"16px" }}>
              {CUSTOM_INGREDIENTS.map(ing => {
                const on = customSel.includes(ing);
                return (
                  <button key={ing} onClick={() => toggleCustom(ing)} style={{
                    padding:"6px 12px", borderRadius:"20px", cursor:"pointer",
                    border:`1.5px solid ${on ? C.darkOlive : C.border}`,
                    background: on ? C.darkOlive : C.sage,
                    color: on ? C.creamLight : C.muted,
                    fontSize:"0.78rem", fontWeight:600, transition:"all 0.14s",
                  }}>
                    {ing}
                  </button>
                );
              })}
            </div>

            {customSel.length > 0 && (
              <p style={{ fontSize:"0.78rem", color:C.midOlive, fontWeight:700, marginBottom:"10px" }}>
                {customSel.length} ingrediente{customSel.length !== 1 ? "s" : ""} seleccionado{customSel.length !== 1 ? "s" : ""}
              </p>
            )}

            <button onClick={addCustom} disabled={!customSel.length} style={{
              width:"100%", padding:"13px", borderRadius:"10px",
              background: customSel.length ? C.sage : "#e4e2b8",
              color: customSel.length ? C.darkOlive : "#a8a470",
              border: `2px solid ${customSel.length ? C.border : "#d8d4a0"}`,
              fontWeight:700, fontSize:"0.88rem", cursor:customSel.length ? "pointer" : "not-allowed",
              letterSpacing:"1px", textTransform:"uppercase", transition:"all 0.15s",
              animation:flash === "custom" ? "pop 0.3s ease" : "none",
            }}>
              {flash === "custom" ? "Agregado" : "+ Agregar al pedido"}
            </button>
          </div>
        </div>

        {/* ── CART ── */}
        {cart.length > 0 && (
          <div className="fade-up" style={{ ...cardStyle, marginBottom:"20px" }}>
            <h2 style={{ fontFamily:"'Dancing Script',cursive", fontSize:"1.6rem", color:C.darkOlive, marginBottom:"16px" }}>
              Tu pedido
            </h2>
            {cart.map(item => (
              <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"12px 0", borderBottom:`1px solid ${C.sage}`, gap:"12px" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700, fontSize:"0.9rem", color:C.darkOlive }}>
                    {item.type === "custom" ? `Armá tu granola (${item.size})` : `Granola ${item.classicType} (${item.size})`}
                  </p>
                  <p style={{ color:C.muted, fontSize:"0.76rem", marginTop:"3px" }}>
                    {item.type === "custom"
                      ? item.ingredients.join(", ")
                      : item.removed.length ? `Sin: ${item.removed.join(", ")}` : "Todos los ingredientes"}
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"14px", flexShrink:0 }}>
                  <span style={{ fontWeight:700, color:C.midOlive }}>${item.price}</span>
                  <button onClick={() => removeItem(item.id)} style={{ background:"none", border:"none", color:"#a09a60", cursor:"pointer", fontSize:"1rem" }}>x</button>
                </div>
              </div>
            ))}
            <div style={{ textAlign:"right", marginTop:"14px" }}>
              <span style={{ fontFamily:"'Dancing Script',cursive", fontSize:"1.5rem", color:C.darkOlive, fontWeight:700 }}>
                Total: ${total}
              </span>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        <div style={cardStyle}>
          <h2 style={{ fontFamily:"'Dancing Script',cursive", fontSize:"1.6rem", color:C.darkOlive, marginBottom:"20px" }}>
            Tus datos
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

            <input placeholder="Tu nombre *" value={name} onChange={e => setName(e.target.value)} style={inputSt} />
            <input placeholder="Tu teléfono *" value={phone} onChange={e => setPhone(e.target.value)} style={inputSt} />

            <div>
              <SectionLabel>¿Cómo lo retirás?</SectionLabel>
              <div style={{ display:"flex", gap:"10px" }}>
                {[
                  ["pickup","Pick up\nPunta Carretas o Ciudad Vieja"],
                  ["delivery","Envío a domicilio\nGratis en Montevideo"],
                ].map(([val, label]) => (
                  <button key={val} onClick={() => setDelivery(val)} style={{
                    flex:1, padding:"11px 8px", borderRadius:"10px", cursor:"pointer",
                    border:`2px solid ${delivery === val ? C.darkOlive : C.border}`,
                    background: delivery === val ? C.darkOlive : C.sage,
                    color: delivery === val ? C.creamLight : C.muted,
                    fontWeight:700, fontSize:"0.75rem", lineHeight:1.5,
                    whiteSpace:"pre-line", transition:"all 0.14s",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize:"0.76rem", color:C.muted, marginTop:"8px" }}>
                El día y hora se coordina por WhatsApp una vez recibido el pedido.
              </p>
            </div>

            {delivery === "delivery" && (
              <input placeholder="Dirección de entrega *" value={address} onChange={e => setAddress(e.target.value)} style={inputSt} />
            )}

            <div>
              <SectionLabel>Forma de pago *</SectionLabel>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {[
                  ["efectivo","Efectivo"],
                  ["transferencia-itau","Transferencia Itaú"],
                  ["transferencia-santander","Transferencia Santander"],
                ].map(([val, label]) => (
                  <button key={val} onClick={() => setPayment(val)} style={{
                    flex:1, minWidth:"110px", padding:"10px 8px", borderRadius:"10px", cursor:"pointer",
                    border:`2px solid ${payment === val ? C.darkOlive : C.border}`,
                    background: payment === val ? C.darkOlive : C.sage,
                    color: payment === val ? C.creamLight : C.muted,
                    fontWeight:700, fontSize:"0.76rem", transition:"all 0.14s",
                  }}>
                    {label}
                  </button>
                ))}
              </div>

              {payment === "efectivo" && (
                <input
                  placeholder="¿Con cuánto vas a pagar? (para tener el vuelto)"
                  value={cashAmount}
                  onChange={e => setCashAmount(e.target.value)}
                  style={{ ...inputSt, marginTop:"10px" }}
                />
              )}

              {isTransfer && (
                <div style={{ marginTop:"10px", background:C.sage, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"12px 14px" }}>
                  <p style={{ fontSize:"0.8rem", color:C.darkOlive, fontWeight:700, marginBottom:"4px" }}>
                    Instrucciones para transferencia
                  </p>
                  <p style={{ fontSize:"0.78rem", color:C.muted, lineHeight:1.6 }}>
                    Te enviamos el número de cuenta por WhatsApp una vez realizado el pedido. Luego mandá el comprobante de pago.
                  </p>
                </div>
              )}
            </div>

            <textarea placeholder="Aclaraciones o consultas (opcional)" value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ ...inputSt, resize:"vertical" }} />

            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"16px" }}>
              <SectionLabel>¿Te recomendó alguien? (opcional)</SectionLabel>
              <p style={{ fontSize:"0.78rem", color:C.muted, marginBottom:"10px", lineHeight:1.55 }}>
                Si venís de parte de alguien, completá sus datos. Cuando comprás, esa persona recibe un 50% de descuento en su próxima compra.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                <input placeholder="Nombre de quien te recomendó" value={refName} onChange={e => setRefName(e.target.value)} style={inputSt} />
                <input placeholder="Teléfono de quien te recomendó" value={refPhone} onChange={e => setRefPhone(e.target.value)} style={inputSt} />
              </div>
            </div>

            <button onClick={sendOrder} disabled={!canSend} style={{
              padding:"15px", borderRadius:"12px", border:"none",
              background: canSend ? C.whatsapp : "#c0ba80",
              color:"#fff", fontWeight:700, fontSize:"1rem",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
              cursor:canSend ? "pointer" : "not-allowed", transition:"all 0.15s",
              letterSpacing:"1px", textTransform:"uppercase",
            }}>
              Enviar pedido por WhatsApp
            </button>

            {!canSend && (
              <p style={{ textAlign:"center", color:C.muted, fontSize:"0.78rem" }}>
                {!cart.length ? "Agregá al menos un producto para continuar"
                  : !name.trim() || !phone.trim() ? "Completá tu nombre y teléfono"
                  : !payment ? "Seleccioná una forma de pago"
                  : "Completá la dirección de entrega"}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background:C.darkOlive, padding:"22px 20px", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"14px" }}>
          <Star size={20} color={C.creamLight} />
          <span style={{ fontFamily:"'Dancing Script',cursive", fontSize:"1.4rem", color:C.creamLight }}>granomix</span>
          <Star size={20} color={C.creamLight} />
        </div>
      </footer>
    </div>
  );
}

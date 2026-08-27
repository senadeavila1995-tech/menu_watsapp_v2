import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFire,
  FaUtensils,
  FaPizzaSlice,
  FaHotdog,
  FaHamburger,
  FaBeer,
  FaWhatsapp,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaClock,
  FaMinus,
  FaPlus,
  FaTrash,
  FaMotorcycle,
  FaStar,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

type Categoria =
  | "chuzos"
  | "salchipapas"
  | "pizzas"
  | "perros"
  | "rapidas"
  | "bebidas_licores";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: Categoria;
  descripcion: string;
  imagen: string;
  destacado?: boolean;
};

type ProductoCarrito = Producto & { cantidad: number };

const IMAGEN_FALLBACK =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85";

const CATEGORIAS: { key: Categoria; label: string; icon: React.ReactNode }[] = [
  { key: "chuzos", label: "Chuzos", icon: <FaFire /> },
  { key: "salchipapas", label: "Salchipapas", icon: <FaUtensils /> },
  { key: "pizzas", label: "Pizzas", icon: <FaPizzaSlice /> },
  { key: "perros", label: "Perros calientes", icon: <FaHotdog /> },
  { key: "rapidas", label: "Rápidas", icon: <FaHamburger /> },
  { key: "bebidas_licores", label: "Bebidas y licores", icon: <FaBeer /> },
];

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Chuzo de Pollo",
    precio: 12000,
    categoria: "chuzos",
    descripcion: "Pollo a la parrilla, doradito y lleno de sabor.",
    imagen:
      "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?auto=format&fit=crop&w=900&q=85",
    destacado: true,
  },
  {
    id: 2,
    nombre: "Chuzo Mixto",
    precio: 15000,
    categoria: "chuzos",
    descripcion: "Una combinación irresistible de carnes a la parrilla.",
    imagen:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    nombre: "Salchipapa Sencilla",
    precio: 10000,
    categoria: "salchipapas",
    descripcion: "Papas crocantes, salchicha y nuestras salsas.",
    imagen:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    nombre: "Salchipapa Especial",
    precio: 18000,
    categoria: "salchipapas",
    descripcion: "Papas, salchicha, queso y toppings para antojo grande.",
    imagen:
      "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=85",
    destacado: true,
  },
  {
    id: 5,
    nombre: "Pizza Personal",
    precio: 20000,
    categoria: "pizzas",
    descripcion: "Pizza recién horneada, perfecta para un antojo personal.",
    imagen:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    nombre: "Pizza Familiar",
    precio: 45000,
    categoria: "pizzas",
    descripcion: "Tamaño para compartir y disfrutar en familia.",
    imagen:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85",
    destacado: true,
  },
  {
    id: 7,
    nombre: "Perro Sencillo",
    precio: 8000,
    categoria: "perros",
    descripcion: "Perro caliente clásico con nuestras salsas.",
    imagen:
      "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    nombre: "Perro Especial",
    precio: 14000,
    categoria: "perros",
    descripcion: "Más toppings, más sabor y mucho más antojo.",
    imagen:
      "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=900&q=85",
    destacado: true,
  },
  {
    id: 9,
    nombre: "Hamburguesa",
    precio: 15000,
    categoria: "rapidas",
    descripcion: "Carne jugosa, pan suave y toppings frescos.",
    imagen:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    destacado: true,
  },
  {
    id: 10,
    nombre: "Arepa Rellena",
    precio: 12000,
    categoria: "rapidas",
    descripcion: "Arepa dorada con relleno abundante y sabroso.",
    imagen:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 11,
    nombre: "Patacón Mixto",
    precio: 13000,
    categoria: "rapidas",
    descripcion: "Patacón crocante con una mezcla de sabores costeños.",
    imagen:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 12,
    nombre: "Cerveza",
    precio: 5000,
    categoria: "bebidas_licores",
    descripcion: "Bien fría para acompañar tu comida favorita.",
    imagen:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 13,
    nombre: "Gaseosa 1.5L",
    precio: 6000,
    categoria: "bebidas_licores",
    descripcion: "Una bebida fría para compartir.",
    imagen:
      "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 14,
    nombre: "Ron 375ml",
    precio: 35000,
    categoria: "bebidas_licores",
    descripcion: "Para acompañar la noche con responsabilidad.",
    imagen:
      "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=900&q=85",
  },
];

function App() {
  const [categoria, setCategoria] = useState<Categoria>("chuzos");
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [horaActual, setHoraActual] = useState(new Date().getHours());

  const [cliente, setCliente] = useState({ nombre: "", telefono: "", direccion: "" });

  useEffect(() => {
    const interval = setInterval(() => setHoraActual(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  const horaApertura = 10;
  const horaCierre = 23;
  const negocioAbierto = horaActual >= horaApertura && horaActual < horaCierre;
  const productosFiltrados = productos.filter((p) => p.categoria === categoria);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const agregarAlCarrito = (producto: Producto) => {
    if (!negocioAbierto) {
      Swal.fire({
        icon: "error",
        title: "Cocina cerrada 🔴",
        text: "Nuestro horario es de 10:00 AM a 11:00 PM",
        confirmButtonColor: "#ff5a3c",
      });
      return;
    }

    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) => (p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p));
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });

    Swal.fire({
      icon: "success",
      title: "¡Agregado al carrito!",
      timer: 850,
      showConfirmButton: false,
    });
  };

  const aumentarCantidad = (id: number) => {
    setCarrito((prev) => prev.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)));
  };

  const disminuirCantidad = (id: number) => {
    setCarrito((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
        .filter((p) => p.cantidad > 0)
    );
  };

  const eliminarProducto = (id: number) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ff5a3c",
    }).then((result) => {
      if (result.isConfirmed) setCarrito((prev) => prev.filter((p) => p.id !== id));
    });
  };

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const numeroWhatsapp = "573157957224";

  const construirMensaje = () => {
    const mensaje = carrito
      .map((p) => `• ${p.nombre} x${p.cantidad} = $${(p.precio * p.cantidad).toLocaleString("es-CO")}`)
      .join("\n");

    return `🌴 *NUEVO PEDIDO - FAST FOOD COSTA*\n\n👤 ${cliente.nombre}\n📞 ${cliente.telefono}\n📍 ${cliente.direccion}\n\n🍟 *Pedido:*\n${mensaje}\n\n💰 *Total: $${total.toLocaleString("es-CO")}*`;
  };

  const enviarPedido = () => {
    if (!cliente.nombre || !cliente.telefono || !cliente.direccion) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Completa todos los campos del cliente",
        confirmButtonColor: "#ff5a3c",
      });
      return;
    }

    if (carrito.length === 0) {
      Swal.fire({ icon: "info", title: "Carrito vacío", text: "Agrega al menos un producto." });
      return;
    }

    window.open(`https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(construirMensaje())}`, "_blank");
  };

  const irAlCarritoRapido = () => document.getElementById("carrito")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="costa-app">
      <header className="costa-navbar">
        <div className="brand-mark">🌴</div>
        <div>
          <p className="brand-title">Fast Food Costa</p>
          <p className="brand-tag">Sabor del Atlántico, directo a tu WhatsApp</p>
        </div>
        <div className="navbar-open-status">
          <span className={clsx("status-dot", negocioAbierto ? "is-open" : "is-closed")} />
          {negocioAbierto ? "Abierto" : "Cerrado"}
        </div>
      </header>

      <section className="costa-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-kicker"><FaStar /> Hecho para antojos grandes</span>
          <h1>Tu próximo antojo empieza aquí.</h1>
          <p>Chuzos, salchipapas, pizzas y más. Elige, arma tu pedido y mándalo por WhatsApp.</p>
          <div className="hero-actions">
            <span className="costa-badge-estado">
              <FaClock /> {negocioAbierto ? "Abierto ahora" : "Cerrado"} · 10:00 AM - 11:00 PM
            </span>
            <span className="hero-delivery"><FaMotorcycle /> Domicilios por WhatsApp</span>
          </div>
        </div>
      </section>

      <main className="container costa-main pb-5">
        <section className="costa-card customer-card shadow-sm mb-4">
          <div className="section-heading">
            <div className="section-icon"><FaUser /></div>
            <div>
              <span className="section-eyebrow">Antes de pedir</span>
              <h2>¿A dónde te llevamos tu antojo?</h2>
            </div>
          </div>
          <div className="row g-2">
            <div className="col-md-4">
              <input className="form-control" name="nombre" placeholder="Nombre completo" onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <input className="form-control" name="telefono" placeholder="Teléfono / WhatsApp" onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <input className="form-control" name="direccion" placeholder="Dirección de entrega" onChange={handleChange} />
            </div>
          </div>
        </section>

        <section className="menu-section">
          <div className="section-heading menu-title-row">
            <div>
              <span className="section-eyebrow">Explora el menú</span>
              <h2>¿Qué se te antoja hoy?</h2>
            </div>
            {totalItems > 0 && <button className="mini-cart" onClick={irAlCarritoRapido}><FaShoppingCart /> {totalItems} productos</button>}
          </div>

          <div className="category-scroller mb-4">
            {CATEGORIAS.map((c) => (
              <button key={c.key} className={clsx("costa-chip", { activo: categoria === c.key })} onClick={() => setCategoria(c.key)}>
                {c.icon} <span>{c.label}</span>
              </button>
            ))}
          </div>

          <div className="row g-3 g-lg-4">
            <AnimatePresence mode="popLayout">
              {productosFiltrados.map((p) => (
                <motion.div
                  key={p.id}
                  className="col-6 col-md-4 col-xl-3"
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.22 }}
                >
                  <article className="costa-product-card h-100">
                    <div className="product-image-wrap">
                      <img
                        src={p.imagen}
                        className="product-image"
                        alt={p.nombre}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = IMAGEN_FALLBACK;
                        }}
                      />
                      {p.destacado && <span className="product-badge"><FaStar /> Favorito</span>}
                    </div>
                    <div className="product-content">
                      <h3>{p.nombre}</h3>
                      <p className="product-description">{p.descripcion}</p>
                      <div className="product-footer">
                        <span className="precio">${p.precio.toLocaleString("es-CO")}</span>
                        <button className="costa-btn-agregar" onClick={() => agregarAlCarrito(p)} aria-label={`Agregar ${p.nombre}`}>
                          <FaPlus /> Agregar
                        </button>
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <section id="carrito" className="costa-carrito shadow-sm mt-5">
          <div className="cart-header">
            <div>
              <span className="section-eyebrow">Tu selección</span>
              <h2><FaShoppingCart /> Carrito {totalItems > 0 && <span>({totalItems})</span>}</h2>
            </div>
            <span className="cart-total-small">${total.toLocaleString("es-CO")}</span>
          </div>

          {carrito.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🍟</div>
              <strong>Tu carrito está esperando un antojo.</strong>
              <span>Agrega tus favoritos y aquí aparecerá tu pedido.</span>
            </div>
          ) : (
            <div className="cart-items">
              <AnimatePresence>
                {carrito.map((p) => (
                  <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="cart-item">
                    <img src={p.imagen} alt="" onError={(e) => { e.currentTarget.src = IMAGEN_FALLBACK; }} />
                    <div className="cart-item-info">
                      <strong>{p.nombre}</strong>
                      <span>${p.precio.toLocaleString("es-CO")} c/u</span>
                    </div>
                    <div className="cart-controls">
                      <div className="quantity-control">
                        <button onClick={() => disminuirCantidad(p.id)}><FaMinus /></button>
                        <span>{p.cantidad}</span>
                        <button onClick={() => aumentarCantidad(p.id)}><FaPlus /></button>
                      </div>
                      <strong className="cart-line-total">${(p.precio * p.cantidad).toLocaleString("es-CO")}</strong>
                      <button className="delete-btn" onClick={() => eliminarProducto(p.id)} aria-label={`Eliminar ${p.nombre}`}><FaTrash /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        <section className="checkout-card mt-4">
          <div>
            <span className="section-eyebrow">Listo para pedir</span>
            <h2>Total del pedido</h2>
          </div>
          <div className="checkout-total">${total.toLocaleString("es-CO")}</div>
          <button className="costa-btn-whatsapp" onClick={enviarPedido}>
            <FaWhatsapp size={22} /> Enviar pedido por WhatsApp
          </button>
        </section>
      </main>

      <footer className="costa-footer">
        <p className="footer-brand">🌴 Fast Food Costa</p>
        <p><FaMapMarkerAlt /> Atlántico, Colombia · <FaPhoneAlt /> {numeroWhatsapp}</p>
        <small>Menú digital · Pedidos rápidos por WhatsApp</small>
      </footer>

      {carrito.length > 0 && (
        <motion.button className="costa-fab-whatsapp" onClick={irAlCarritoRapido} initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
          <FaShoppingCart />
          <span>{totalItems}</span>
        </motion.button>
      )}
    </div>
  );
}

export default App;

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
};

type ProductoCarrito = Producto & {
  cantidad: number;
};

const CATEGORIAS: { key: Categoria; label: string; icon: React.ReactNode }[] = [
  { key: "chuzos", label: "Chuzos", icon: <FaFire /> },
  { key: "salchipapas", label: "Salchipapas", icon: <FaUtensils /> },
  { key: "pizzas", label: "Pizzas", icon: <FaPizzaSlice /> },
  { key: "perros", label: "Perros calientes", icon: <FaHotdog /> },
  { key: "rapidas", label: "Rápidas", icon: <FaHamburger /> },
  { key: "bebidas_licores", label: "Bebidas y licores", icon: <FaBeer /> },
];

function App() {
  const [categoria, setCategoria] = useState<Categoria>("chuzos");
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [horaActual, setHoraActual] = useState(new Date().getHours());

  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const horaApertura = 10;
  const horaCierre = 23;
  const negocioAbierto = horaActual >= horaApertura && horaActual < horaCierre;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const obtenerImagen = (nombre: string) =>
    `https://picsum.photos/seed/food-${nombre}/500/300`;

  const productos: Producto[] = [
    { id: 1, nombre: "Chuzo de Pollo", precio: 12000, categoria: "chuzos" },
    { id: 2, nombre: "Chuzo Mixto", precio: 15000, categoria: "chuzos" },
    { id: 3, nombre: "Salchipapa Sencilla", precio: 10000, categoria: "salchipapas" },
    { id: 4, nombre: "Salchipapa Especial", precio: 18000, categoria: "salchipapas" },
    { id: 5, nombre: "Pizza Personal", precio: 20000, categoria: "pizzas" },
    { id: 6, nombre: "Pizza Familiar", precio: 45000, categoria: "pizzas" },
    { id: 7, nombre: "Perro Sencillo", precio: 8000, categoria: "perros" },
    { id: 8, nombre: "Perro Especial", precio: 14000, categoria: "perros" },
    { id: 9, nombre: "Hamburguesa", precio: 15000, categoria: "rapidas" },
    { id: 10, nombre: "Arepa Rellena", precio: 12000, categoria: "rapidas" },
    { id: 11, nombre: "Patacón Mixto", precio: 13000, categoria: "rapidas" },
    { id: 12, nombre: "Cerveza", precio: 5000, categoria: "bebidas_licores" },
    { id: 13, nombre: "Gaseosa 1.5L", precio: 6000, categoria: "bebidas_licores" },
    { id: 14, nombre: "Ron 375ml", precio: 35000, categoria: "bebidas_licores" },
  ];

  const productosFiltrados = productos.filter((p) => p.categoria === categoria);

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
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          timer: 900,
          showConfirmButton: false,
        });

        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }

      Swal.fire({
        icon: "success",
        title: "¡Agregado al carrito! 🌴",
        timer: 900,
        showConfirmButton: false,
      });

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const aumentarCantidad = (id: number) => {
    setCarrito((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p))
    );
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
      confirmButtonColor: "#ff5a3c",
    }).then((result) => {
      if (result.isConfirmed) {
        setCarrito((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("Eliminado", "Producto removido", "success");
      }
    });
  };

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  const numeroWhatsapp = "573157957224";

  const construirMensaje = () => {
    const mensaje = carrito
      .map(
        (p) =>
          `• ${p.nombre} x${p.cantidad} = $${(
            p.precio * p.cantidad
          ).toLocaleString("es-CO")}`
      )
      .join("\n");

    return `
🌴 *NUEVO PEDIDO - FAST FOOD COSTA*

👤 ${cliente.nombre}
📞 ${cliente.telefono}
📍 ${cliente.direccion}

🍟 Pedido:
${mensaje}

💰 Total: $${total.toLocaleString("es-CO")}
`;
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
      Swal.fire({
        icon: "info",
        title: "Carrito vacío",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Pedido enviado 🚀",
      text: "Te redirigimos a WhatsApp",
      confirmButtonColor: "#017a7a",
    });

    window.open(
      `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(construirMensaje())}`,
      "_blank"
    );
  };

  const irAlCarritoRapido = () => {
    document.getElementById("carrito")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100svh" }}>

      {/* NAVBAR */}
      <div className="costa-navbar">
        <span style={{ fontSize: "1.6rem" }}>🌴</span>
        <div>
          <p className="brand-title">Fast Food Costa</p>
          <p className="brand-tag">Sabor del Atlántico, directo a tu WhatsApp</p>
        </div>
      </div>

      {/* HERO */}
      <div className="costa-hero">
        <h1>🍔 Antojos costeños a un mensaje de distancia</h1>
        <p className="mb-3">Chuzos, salchipapas, pizzas y más, con sabor de la Costa Caribe</p>
        <span
          className={clsx(
            "costa-badge-estado",
            negocioAbierto ? "costa-badge-abierto" : "costa-badge-cerrado"
          )}
        >
          <FaClock /> {negocioAbierto ? "Abierto ahora" : "Cerrado"} · 10:00 AM - 11:00 PM
        </span>
      </div>

      <div className="container pb-5">

        {/* CLIENTE */}
        <div className="costa-card shadow-sm p-3 mb-4">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <FaUser /> Datos para tu pedido
          </h6>

          <input
            className="form-control mb-2"
            name="nombre"
            placeholder="Nombre completo"
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="telefono"
            placeholder="Teléfono / WhatsApp"
            onChange={handleChange}
          />
          <input
            className="form-control"
            name="direccion"
            placeholder="Dirección de entrega (barrio, calle)"
            onChange={handleChange}
          />
        </div>

        {/* CATEGORÍAS */}
        <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
          {CATEGORIAS.map((c) => (
            <button
              key={c.key}
              className={clsx("costa-chip", { activo: categoria === c.key })}
              onClick={() => setCategoria(c.key)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* PRODUCTOS */}
        <div className="row g-3 mb-4">
          <AnimatePresence mode="popLayout">
            {productosFiltrados.map((p) => (
              <motion.div
                key={p.id}
                className="col-6 col-md-4"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="costa-product-card h-100">
                  <img src={obtenerImagen(p.nombre)} className="card-img-top w-100" alt={p.nombre} />
                  <div className="card-body text-center">
                    <h6 className="fw-bold mb-1">{p.nombre}</h6>
                    <p className="precio fw-bold mb-3">
                      ${p.precio.toLocaleString("es-CO")}
                    </p>

                    <button
                      className="costa-btn-agregar w-100 py-2"
                      onClick={() => agregarAlCarrito(p)}
                    >
                      🍟 Agregar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CARRITO */}
        <div id="carrito" className="costa-carrito p-3 shadow-sm mb-4">
          <h5 className="mb-3">
            <FaShoppingCart /> Tu carrito {totalItems > 0 && `(${totalItems})`}
          </h5>

          {carrito.length === 0 ? (
            <p className="text-muted mb-0">Aún no has agregado productos</p>
          ) : (
            <AnimatePresence>
              {carrito.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2"
                >
                  <span className="fw-bold">{p.nombre}</span>

                  <div className="d-flex align-items-center gap-2">
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => disminuirCantidad(p.id)}
                      >
                        <FaMinus size={11} />
                      </button>
                      <span className="px-2">{p.cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => aumentarCantidad(p.id)}
                      >
                        <FaPlus size={11} />
                      </button>
                    </div>

                    <strong>${(p.precio * p.cantidad).toLocaleString("es-CO")}</strong>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarProducto(p.id)}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* TOTAL */}
        <div className="text-center">
          <h4 className="costa-total fw-bold mb-3">
            Total: ${total.toLocaleString("es-CO")}
          </h4>

          <button className="costa-btn-whatsapp px-4 py-2" onClick={enviarPedido}>
            <FaWhatsapp size={20} /> Enviar pedido por WhatsApp
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="costa-footer">
        <p className="d-flex align-items-center justify-content-center gap-2 mb-1">
          <FaMapMarkerAlt /> Atlántico, Colombia
        </p>
        <p className="d-flex align-items-center justify-content-center gap-2">
          <FaPhoneAlt /> {numeroWhatsapp}
        </p>
      </div>

      {/* BOTÓN FLOTANTE */}
      {carrito.length > 0 && (
        <motion.button
          className="costa-fab-whatsapp"
          onClick={irAlCarritoRapido}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaShoppingCart />
        </motion.button>
      )}
    </div>
  );
}

export default App;

import { useState } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: "bebidas" | "comestibles" | "licores";
};

type ProductoCarrito = Producto & {
  cantidad: number;
};

function App() {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [categoria, setCategoria] = useState<Producto["categoria"]>("bebidas");

  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 FUNCIÓN PARA IMÁGENES
const obtenerImagen = (nombre: string) => {
  const key = nombre.toLowerCase().trim();

  const mapa: Record<string, number> = {
    "gaseosa": 10,
    "jugo natural": 20,
    "hamburguesa": 30,
    "perro caliente": 40,
    "pizza": 50,
    "salchipapa": 60,
    "chuzo": 70,
    "lasaña": 80,
    "espagueti": 90,
    "ron": 100,
    "aguardiente": 110,
    "vodka": 120,
  };

  const id = mapa[key] || 200;

  // 🔥 Picsum SIEMPRE responde (no falla como Unsplash)
  return `https://picsum.photos/seed/${id}/400/300`;
};

  const productos: Producto[] = [
    { id: 1, nombre: "Gaseosa", precio: 4000, categoria: "bebidas" },
    { id: 2, nombre: "Jugo Natural", precio: 5000, categoria: "bebidas" },
    { id: 3, nombre: "Hamburguesa", precio: 12000, categoria: "comestibles" },
    { id: 4, nombre: "Perro Caliente", precio: 8000, categoria: "comestibles" },
    { id: 5, nombre: "Pizza", precio: 20000, categoria: "comestibles" },
    { id: 6, nombre: "Salchipapa", precio: 20000, categoria: "comestibles" },
    { id: 7, nombre: "Chuzo", precio: 20000, categoria: "comestibles" },
    { id: 8, nombre: "Lasaña", precio: 20000, categoria: "comestibles" },
    { id: 9, nombre: "Espagueti", precio: 20000, categoria: "comestibles" },
    { id: 15, nombre: "Ron", precio: 3000, categoria: "licores" },
    { id: 16, nombre: "Aguardiente", precio: 3000, categoria: "licores" },
    { id: 17, nombre: "Vodka", precio: 3000, categoria: "licores" },
  ];

  const productosFiltrados = productos.filter(
    (p) => p.categoria === categoria
  );

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);

      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });

    Swal.fire({
      icon: "success",
      title: `${producto.nombre} añadido`,
      timer: 800,
      showConfirmButton: false,
    });
  };

  const aumentarCantidad = (id: number) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  const disminuirCantidad = (id: number) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const eliminarProducto = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));

    Swal.fire({
      icon: "info",
      title: "Producto eliminado",
      timer: 700,
      showConfirmButton: false,
    });
  };

  const total = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const enviarPedido = () => {
    const numero = "573157957224";

    if (
      !cliente.nombre.trim() ||
      !cliente.telefono.trim() ||
      !cliente.direccion.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Completa todos los datos",
      });
      return;
    }

    if (cliente.telefono.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Teléfono inválido",
      });
      return;
    }

    if (carrito.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No hay productos en el carrito",
      });
      return;
    }

    const mensajeProductos = carrito
      .map(
        (p) =>
          `• ${p.nombre} x${p.cantidad} = $${(
            p.precio * p.cantidad
          ).toLocaleString("es-CO")}`
      )
      .join("\n");

    const textoFinal = `
🧾 *NUEVO PEDIDO*

👤 Cliente: ${cliente.nombre}
📞 Teléfono: ${cliente.telefono}
📍 Dirección: ${cliente.direccion}

🛒 *Detalle del pedido:*
${mensajeProductos}

💰 *Total:* $${total.toLocaleString("es-CO")}
`;

    Swal.fire({
      icon: "success",
      title: "Redirigiendo a WhatsApp...",
      timer: 1000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(
        textoFinal
      )}`;
      window.open(url, "_blank");
    }, 1000);
  };

  return (
    <div className="container py-4">

      <div className="text-center mb-4">
        <h2 className="fw-bold">🍔 Sabor Costeño</h2>
        <p className="text-muted mb-1">
          Comida rápida en Barranquilla
        </p>
        <small className="text-success">
          🛵 Domicilios disponibles
        </small>
      </div>

      <div style={{ position: "fixed", top: 15, right: 15, zIndex: 1000 }}>
        <button
          className="btn btn-dark position-relative rounded-pill px-3"
          data-bs-toggle="modal"
          data-bs-target="#carritoModal"
        >
          🛒
          {carrito.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
              {carrito.length}
            </span>
          )}
        </button>
      </div>

      <div className="card p-3 mb-4 shadow-sm border-0">
        <h5 className="mb-3">📍 Datos de entrega</h5>

        <input className="form-control mb-2" placeholder="Nombre completo" name="nombre" value={cliente.nombre} onChange={handleChange} />
        <input className="form-control mb-2" placeholder="Teléfono" name="telefono" value={cliente.telefono} onChange={handleChange} />
        <input className="form-control" placeholder="Dirección" name="direccion" value={cliente.direccion} onChange={handleChange} />
      </div>

      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        <button className={`btn ${categoria === "bebidas" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setCategoria("bebidas")}>🧃 Bebidas</button>
        <button className={`btn ${categoria === "comestibles" ? "btn-warning" : "btn-outline-warning"}`} onClick={() => setCategoria("comestibles")}>🍔 Comida</button>
        <button className={`btn ${categoria === "licores" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => setCategoria("licores")}>🍹 Licores</button>
      </div>

      <div className="row g-3">
        {productosFiltrados.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <div className="card h-100 shadow-sm border-0">

              <img
                src={obtenerImagen(p.nombre)}
                alt={p.nombre}
                className="card-img-top"
                style={{ height: "140px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h6>{p.nombre}</h6>

                <p className="text-success fw-bold">
                  ${p.precio.toLocaleString("es-CO")}
                </p>

                <button className="btn btn-dark mt-auto" onClick={() => agregarAlCarrito(p)}>
                  Añadir
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <div className="modal fade" id="carritoModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>🛒 Tu pedido</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {carrito.length === 0 ? (
                <p>Tu carrito está vacío</p>
              ) : (
                <ul className="list-group">
                  {carrito.map((p) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={p.id}>
                      <div>
                        <strong>{p.nombre}</strong>
                        <div className="small text-muted">
                          ${p.precio.toLocaleString("es-CO")}
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => disminuirCantidad(p.id)}>−</button>
                        <span>{p.cantidad}</span>
                        <button className="btn btn-sm btn-outline-success" onClick={() => aumentarCantidad(p.id)}>+</button>
                      </div>

                      <div>
                        <strong>${(p.precio * p.cantidad).toLocaleString("es-CO")}</strong>
                        <button className="btn btn-sm btn-danger ms-2" onClick={() => eliminarProducto(p.id)}>🗑️</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <strong>Total: ${total.toLocaleString("es-CO")}</strong>
              <button className="btn btn-success" onClick={enviarPedido}>
                📲 Pedir
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
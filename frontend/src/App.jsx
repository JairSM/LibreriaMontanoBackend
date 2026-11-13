
import { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import Vista3D from "./Vista3D";

function App() {
  const [seccion, setSeccion] = useState("inventario");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(API_URL)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el inventario");
        }
        return respuesta.json();
      })
      .then((datos) => {
        setProductos(datos);
        setCargando(false);
      })
      .catch((error) => {
        setError(error.message);
        setCargando(false);
      });
  }, []);

  const unidadesDisponibles = productos.reduce(
    (total, producto) => total + producto.stock,
    0
  );

  const claseBoton = (nombre) =>
    `w-full text-left rounded-lg px-4 py-3 font-semibold transition-colors ${
      seccion === nombre
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:block relative">

        <h1 className="text-2xl font-bold mb-2">
          Librería Montaño
        </h1>

        <p className="text-slate-400 text-sm mb-10">
          Sistema de gestión
        </p>

        <nav className="space-y-3">

          <button
            onClick={() => setSeccion("inventario")}
            className={claseBoton("inventario")}
          >
            📦 Inventario
          </button>

          <button
            onClick={() => setSeccion("productos")}
            className={claseBoton("productos")}
          >
            🏷️ Productos
          </button>

          <button
            onClick={() => setSeccion("showroom")}
            className={claseBoton("showroom")}
          >
            🏬 Showroom 3D
          </button>

        </nav>

        <div className="absolute bottom-6 text-slate-500 text-sm">
          Librería Montaño © 2026
        </div>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 min-w-0">

        <header className="bg-white shadow-sm px-8 py-6">

          <h2 className="text-2xl font-bold text-slate-800">
            {seccion === "inventario"
              ? "Panel de control"
              : seccion === "productos"
                ? "Gestión de productos"
                : "Showroom de Librería Montaño"}
          </h2>

          <p className="text-slate-500 mt-1">
            {seccion === "showroom"
              ? "Explora nuestra tienda en tres dimensiones."
              : "Administración de productos e inventario"}
          </p>

        </header>

        <main className="max-w-7xl mx-auto p-6 md:p-8">

          {/* SECCIÓN INVENTARIO */}
          {seccion === "inventario" && (
            <>
              <div className="mb-6">

                <h3 className="text-xl font-bold text-slate-800">
                  Inventario de productos
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Consulta el resumen actual de tu inventario.
                </p>

              </div>

              {cargando ? (
                <p className="bg-white rounded-xl p-6">
                  Cargando inventario...
                </p>
              ) : error ? (
                <p className="bg-red-50 text-red-700 rounded-xl p-6">
                  Error: {error}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">

                    <p className="text-slate-500 text-sm">
                      Productos registrados
                    </p>

                    <h3 className="text-3xl font-bold text-slate-800 mt-2">
                      {productos.length}
                    </h3>

                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">

                    <p className="text-slate-500 text-sm">
                      Unidades disponibles
                    </p>

                    <h3 className="text-3xl font-bold text-blue-600 mt-2">
                      {unidadesDisponibles}
                    </h3>

                  </div>

                </div>
              )}
            </>
          )}

          {/* SECCIÓN PRODUCTOS */}
          {seccion === "productos" && (
            <>
              <div className="mb-6">

                <h3 className="text-xl font-bold text-slate-800">
                  Gestión de productos
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Registra, consulta, edita y elimina productos.
                </p>

              </div>

              <ProductList />
            </>
          )}

          {/* SECCIÓN SHOWROOM 3D */}
          {seccion === "showroom" && (
            <Vista3D />
          )}

        </main>

      </div>

    </div>
  );
}

export default App;

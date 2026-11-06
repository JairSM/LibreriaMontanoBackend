
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const categorias = [
  { id: 1, name: "Cuadernos" },
  { id: 2, name: "Útiles escolares" },
  { id: 3, name: "Material de oficina" },
];

const marcas = [
  { id: 1, name: "ABC" },
  { id: 2, name: "Pilot" },
  { id: 3, name: "Faber-Castell" },
];

const formularioInicial = {
  name: "",
  purchase_price: "",
  price: "",
  stock: "",
  category_id: "1",
  brand_id: "1",
};

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  async function cargarProductos() {
    try {
      setError("");

      const respuesta = await fetch(API_URL);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos");
      }

      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function cambiarCampo(e) {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setMensaje("");
  }

  function editarProducto(producto) {
    setEditandoId(producto.id);

    setFormulario({
      name: producto.name,
      purchase_price: String(producto.purchase_price),
      price: String(producto.price),
      stock: String(producto.stock),
      category_id: String(producto.category_id),
      brand_id: String(producto.brand_id),
    });

    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function guardarProducto(e) {
    e.preventDefault();
    setMensaje("");

    const datos = {
      name: formulario.name.trim(),
      purchase_price: Number(formulario.purchase_price),
      price: Number(formulario.price),
      stock: Number(formulario.stock),
      category_id: Number(formulario.category_id),
      brand_id: Number(formulario.brand_id),
    };

    if (
      !datos.name ||
      formulario.purchase_price === "" ||
      formulario.price === "" ||
      formulario.stock === "" ||
      !Number.isFinite(datos.purchase_price) ||
      !Number.isFinite(datos.price) ||
      !Number.isInteger(datos.stock) ||
      datos.purchase_price < 0 ||
      datos.price < 0 ||
      datos.stock < 0
    ) {
      setMensaje(
        "Verifica los datos ingresados. No se permiten valores negativos."
      );
      return;
    }

    try {
      setGuardando(true);

      const esEdicion = editandoId !== null;

      const respuesta = await fetch(
        esEdicion ? `${API_URL}/${editandoId}` : API_URL,
        {
          method: esEdicion ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.json();

        throw new Error(
          detalle.detail
            ? JSON.stringify(detalle.detail)
            : "No se pudo guardar el producto"
        );
      }

      limpiarFormulario();

      setMensaje(
        esEdicion
          ? "¡Producto actualizado correctamente!"
          : "¡Producto registrado correctamente!"
      );

      await cargarProductos();
    } catch (error) {
      setMensaje("Error: " + error.message);
    } finally {
      setGuardando(false);
    }
  }

  // Eliminar producto con confirmación
  async function eliminarProducto(producto) {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar "${producto.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    try {
      setEliminandoId(producto.id);
      setMensaje("");

      const respuesta = await fetch(
        `${API_URL}/${producto.id}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.json();

        throw new Error(
          detalle.detail || "No se pudo eliminar el producto"
        );
      }

      if (editandoId === producto.id) {
        limpiarFormulario();
      }

      await cargarProductos();

      setMensaje("¡Producto eliminado correctamente!");
    } catch (error) {
      setMensaje("Error al eliminar: " + error.message);
    } finally {
      setEliminandoId(null);
    }
  }

  if (cargando) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center text-slate-500">
        Cargando inventario...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Resumen del inventario */}
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
            {productos.reduce(
              (total, producto) => total + producto.stock,
              0
            )}
          </h3>
        </div>

      </div>

      {/* Formulario de registro y edición */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {editandoId !== null
            ? "Editar producto"
            : "Registrar nuevo producto"}
        </h3>

        <p className="text-sm text-slate-500 mb-6">
          {editandoId !== null
            ? "Modifica los datos del producto seleccionado."
            : "Completa los datos para agregar un producto al inventario."}
        </p>

        <form
          onSubmit={guardarProducto}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del producto
            </label>

            <input
              type="text"
              name="name"
              value={formulario.name}
              onChange={cambiarCampo}
              placeholder="Ej. Cuaderno universitario"
              maxLength="150"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio de compra (Bs)
            </label>

            <input
              type="number"
              name="purchase_price"
              value={formulario.purchase_price}
              onChange={cambiarCampo}
              min="0"
              step="0.01"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Precio de venta (Bs)
            </label>

            <input
              type="number"
              name="price"
              value={formulario.price}
              onChange={cambiarCampo}
              min="0"
              step="0.01"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cantidad en stock
            </label>

            <input
              type="number"
              name="stock"
              value={formulario.stock}
              onChange={cambiarCampo}
              min="0"
              step="1"
              required
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Categoría
            </label>

            <select
              name="category_id"
              value={formulario.category_id}
              onChange={cambiarCampo}
              className="w-full border border-slate-300 rounded-lg p-3 bg-white"
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Marca
            </label>

            <select
              name="brand_id"
              value={formulario.brand_id}
              onChange={cambiarCampo}
              className="w-full border border-slate-300 rounded-lg p-3 bg-white"
            >
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={guardando}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {guardando
                ? "Guardando..."
                : editandoId !== null
                  ? "Guardar cambios"
                  : "Registrar producto"}
            </button>

            {editandoId !== null && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-lg"
              >
                Cancelar edición
              </button>
            )}

          </div>

          {mensaje && (
            <p className="md:col-span-2 text-sm font-medium text-blue-700">
              {mensaje}
            </p>
          )}

        </form>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            Productos registrados
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Consulta y administra el estado actual de tu inventario.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-600 text-sm">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Precio de venta</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Disponibilidad</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="hover:bg-slate-50"
                >

                  <td className="px-6 py-5 font-medium text-slate-800">
                    {producto.name}
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    Bs {Number(producto.price).toFixed(2)}
                  </td>

                  <td className="px-6 py-5 font-semibold text-slate-700">
                    {producto.stock} unidades
                  </td>

                  <td className="px-6 py-5">
                    {producto.stock > 10 ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Disponible
                      </span>
                    ) : producto.stock > 0 ? (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Stock bajo
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Agotado
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() => editarProducto(producto)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarProducto(producto)}
                        disabled={eliminandoId === producto.id}
                        className="bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        {eliminandoId === producto.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {productos.length === 0 && (
          <p className="p-8 text-center text-slate-500">
            Todavía no hay productos registrados.
          </p>
        )}

      </div>

    </div>
  );
}

export default ProductList;

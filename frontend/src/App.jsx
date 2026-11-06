
import ProductList from "./components/ProductList";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Menú lateral */}
      <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-2">
          Librería Montaño
        </h1>

        <p className="text-slate-400 text-sm mb-10">
          Sistema de gestión
        </p>

        <nav className="space-y-3">
          <div className="bg-blue-600 rounded-lg px-4 py-3 font-semibold">
            📦 Inventario
          </div>
          <div className="px-4 py-3 text-slate-300">
            🏷️ Productos
          </div>
        </nav>

        <div className="absolute bottom-6 text-slate-500 text-sm">
          Librería Montaño © 2026
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        <header className="bg-white shadow-sm px-8 py-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Panel de control
          </h2>
          <p className="text-slate-500 mt-1">
            Administración de productos e inventario
          </p>
        </header>

        <main className="max-w-7xl mx-auto p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              Inventario de productos
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Consulta los productos registrados en la librería.
            </p>
          </div>

          <ProductList />
        </main>
      </div>
    </div>
  );
}

export default App;

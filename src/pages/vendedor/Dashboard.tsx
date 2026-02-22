import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function VendedorDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-black">
          Panel de Vendedor
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/vendedor/vender"
            className="card bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <h2 className="card-title text-black">Registrar Venta</h2>
              <p className="text-black">Crear una nueva venta</p>
            </div>
          </Link>

          <Link
            to="/vendedor/mis-ventas"
            className="card bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <div className="card-body">
              <h2 className="card-title text-black">Mis Ventas</h2>
              <p className="text-black">Ver historial de ventas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

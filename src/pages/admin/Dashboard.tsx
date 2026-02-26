import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  MdInventory,
  MdShoppingCart,
  MdPointOfSale,
  MdAssessment,
  MdCategory
} from "react-icons/md";

export default function AdminDashboard() {
  const dashboardCards = [
    {
      title: "Inventario",
      description: "Ver y gestionar productos",
      to: "/admin/inventario",
      icon: MdInventory,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Categorías",
      description: "Gestionar categorías de productos",
      to: "/admin/categorias",
      icon: MdCategory,
      gradient: "bg-gradient-info",
    },
    {
      title: "Cargar Compra",
      description: "Registrar compra de mercadería",
      to: "/admin/compras",
      icon: MdShoppingCart,
      gradient: "bg-gradient-success",
    },
    {
      title: "Ventas",
      description: "Ver todas las ventas",
      to: "/admin/ventas",
      icon: MdPointOfSale,
      gradient: "bg-gradient-secondary",
    },
    {
      title: "Reportes",
      description: "Generar reporte por fecha",
      to: "/admin/reportes",
      icon: MdAssessment,
      gradient: "bg-gradient-warning",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto p-8 animate-fadeIn">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 text-lg">
            Gestiona tu inventario y operaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.to}
                className="group relative modern-card text-white overflow-hidden hover-lift"
                style={{
                  background: `linear-gradient(135deg, ${card.gradient.includes('primary') ? '#1e3a8a, #3b82f6' :
                      card.gradient.includes('info') ? '#0891b2, #06b6d4' :
                        card.gradient.includes('success') ? '#047857, #10b981' :
                          card.gradient.includes('secondary') ? '#0f172a, #475569' :
                            '#d97706, #f59e0b'
                    })`,
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="text-5xl opacity-90" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

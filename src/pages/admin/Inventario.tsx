import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Product } from "../../types";
import { productsService } from "../../services/products.service";

export default function Inventario() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto p-8 animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Inventario
          </h1>
          <p className="text-gray-600">
            Gestiona el stock de productos
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Stock</th>
                    <th>Precio Venta</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-500 bg-white"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-6xl opacity-20">📦</div>
                          <p className="text-lg font-medium">
                            No hay productos en el inventario
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="bg-white">
                        <td className="font-mono text-sm text-gray-600">
                          {product.sku}
                        </td>
                        <td className="font-semibold text-gray-800">
                          {product.name}
                        </td>
                        <td className="text-gray-600">
                          {product.description || "-"}
                        </td>
                        <td>
                          <span
                            className={`font-bold ${product.currentStock < 10
                              ? "text-red-600"
                              : product.currentStock < 30
                                ? "text-yellow-600"
                                : "text-green-600"
                              }`}
                          >
                            {product.currentStock}
                            {product.currentStock < 10 && " ⚠️"}
                          </span>
                        </td>
                        <td className="font-semibold text-gray-800">
                          Gs. {parseFloat(product.salePrice).toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`badge-modern ${product.isActive
                              ? "badge-success"
                              : "bg-gray-300 text-gray-700"
                              }`}
                          >
                            {product.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

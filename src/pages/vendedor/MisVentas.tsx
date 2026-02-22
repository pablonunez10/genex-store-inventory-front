import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Sale } from "../../types";
import { salesService } from "../../services/sales.service";
import { format } from "date-fns";

export default function MisVentas() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const data = await salesService.getMySales();
      setSales(data);
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Mis Ventas</h1>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.length === 0 ? (
              <div className="card bg-white border border-gray-200 shadow">
                <div className="card-body text-center">
                  <p className="text-black">No tienes ventas registradas</p>
                </div>
              </div>
            ) : (
              sales.map((sale) => (
                <div
                  key={sale.id}
                  className="card bg-white border border-gray-200 shadow"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="card-title text-black">
                          Venta #{sale.id.slice(0, 8)}
                        </h2>
                        <p className="text-sm text-black">
                          Fecha:{" "}
                          {format(new Date(sale.saleDate), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black">
                          Gs. {sale.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto mt-4 border border-gray-300 rounded-lg">
                      <table className="table table-sm text-black border-collapse w-full bg-white">
                        <thead className="bg-gray-100 border-b-2 border-gray-300">
                          <tr className="text-black">
                            <th className="border border-gray-300 text-black bg-gray-100">Producto</th>
                            <th className="border border-gray-300 text-black bg-gray-100">Cantidad</th>
                            <th className="border border-gray-300 text-black bg-gray-100">Precio Unit.</th>
                            <th className="border border-gray-300 text-black bg-gray-100">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.items.map((item, index) => (
                            <tr key={item.id} className={`text-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="border border-gray-300 text-black">{item.productName}</td>
                              <td className="border border-gray-300 text-black">{item.quantity}</td>
                              <td className="border border-gray-300 text-black">Gs. {item.unitPrice}</td>
                              <td className="border border-gray-300 text-black">Gs. {item.subtotal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

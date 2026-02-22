import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import { SalesReport } from '../../types';
import { salesService } from '../../services/sales.service';
import { format } from 'date-fns';

export default function Reportes() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await salesService.getReport(date);
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al generar reporte');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Reportes de Ventas</h1>

        <div className="card bg-white border border-gray-200 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Seleccionar Fecha"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <button
                className="btn bg-black text-white hover:bg-gray-800 mb-2"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? 'Generando...' : 'Generar Reporte'}
              </button>
            </div>

            {error && (
              <div className="bg-gray-200 border border-gray-400 text-black p-4 rounded-lg mt-4">
                <span className="text-black">{error}</span>
              </div>
            )}
          </div>
        </div>

        {report && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="card bg-white border border-gray-200 shadow">
                <div className="card-body">
                  <h2 className="card-title text-sm text-black">Total Vendido</h2>
                  <p className="text-3xl font-bold text-black">Gs. {report.summary.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="card bg-white border border-gray-200 shadow">
                <div className="card-body">
                  <h2 className="card-title text-sm text-black">Cantidad de Ventas</h2>
                  <p className="text-3xl font-bold text-black">{report.summary.totalSales}</p>
                </div>
              </div>

              <div className="card bg-white border border-gray-200 shadow">
                <div className="card-body">
                  <h2 className="card-title text-sm text-black">Unidades Vendidas</h2>
                  <p className="text-3xl font-bold text-black">{report.summary.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="card bg-white border border-gray-200 shadow">
              <div className="card-body">
                <h2 className="card-title mb-4 text-black">Detalle de Ventas</h2>

                {report.sales.length === 0 ? (
                  <p className="text-center text-black">No hay ventas en esta fecha</p>
                ) : (
                  <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="table text-black border-collapse w-full bg-white">
                      <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr className="text-black">
                          <th className="border border-gray-300 text-black bg-gray-100">Hora</th>
                          <th className="border border-gray-300 text-black bg-gray-100">Vendedor</th>
                          <th className="border border-gray-300 text-black bg-gray-100">Productos</th>
                          <th className="border border-gray-300 text-black bg-gray-100">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.sales.map((sale, index) => (
                          <tr key={sale.id} className={`text-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="border border-gray-300 text-black">{format(new Date(sale.saleDate), 'HH:mm')}</td>
                            <td className="border border-gray-300 text-black">{sale.sellerName}</td>
                            <td className="border border-gray-300 text-black">
                              {sale.items.map((item) => (
                                <div key={item.id} className="text-black">
                                  {item.productName} x{item.quantity}
                                </div>
                              ))}
                            </td>
                            <td className="border border-gray-300 text-black font-bold">Gs. {sale.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

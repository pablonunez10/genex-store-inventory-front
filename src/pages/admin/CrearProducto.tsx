import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import { productsService } from "../../services/products.service";
import { MdArrowBack, MdSave } from "react-icons/md";

export default function CrearProducto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    salePrice: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await productsService.create({
        name: formData.name,
        sku: formData.sku,
        description: formData.description || undefined,
        salePrice: parseFloat(formData.salePrice),
      });
      navigate("/admin/inventario");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto p-8 animate-fadeIn">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/inventario")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <MdArrowBack /> Volver al Inventario
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Crear Nuevo Producto
          </h1>
          <p className="text-gray-600">
            Completa la información del producto
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 max-w-3xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre del Producto"
                type="text"
                placeholder="Ej: Laptop HP"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Input
                label="SKU"
                type="text"
                placeholder="Ej: LAP-001"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                required
              />
            </div>

            <TextArea
              label="Descripción"
              placeholder="Descripción detallada del producto (opcional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Input
              label="Precio de Venta (Gs.)"
              type="number"
              step="0.01"
              placeholder="Ej: 5000000"
              value={formData.salePrice}
              onChange={(e) =>
                setFormData({ ...formData, salePrice: e.target.value })
              }
              required
            />

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl animate-fadeIn">
                <span className="font-medium">⚠️ {error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn-gradient flex items-center gap-2 flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <MdSave />
                    Crear Producto
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 border-0 px-8 rounded-xl font-semibold transition-all"
                onClick={() => navigate("/admin/inventario")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

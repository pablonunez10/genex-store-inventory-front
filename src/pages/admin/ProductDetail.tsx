import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { Product, Category } from "../../types";
import { productsService } from "../../services/products.service";
import { categoriesService } from "../../services/categories.service";

export default function ProductoDetalle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    salePrice: "",
    categoryId: "",
    currentStock: "",
  });

  useEffect(() => {
    if (id) {
      loadProduct();
      loadCategories();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productsService.getById(id!);
      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description || "",
        salePrice: data.salePrice,
        categoryId: data.categoryId,
        currentStock: data.currentStock.toString(),
      });
    } catch (error) {
      console.error("Error cargando producto:", error);
      setError("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await productsService.update(id!, {
        name: formData.name,
        description: formData.description || undefined,
        salePrice: parseFloat(formData.salePrice),
        categoryId: formData.categoryId,
        currentStock: parseInt(formData.currentStock),
      });
      setIsEditing(false);
      await loadProduct();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al actualizar producto");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!product) return;
    setSaving(true);
    try {
      await productsService.update(id!, {
        isActive: !product.isActive,
      });
      await loadProduct();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cambiar estado");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        salePrice: product.salePrice,
        categoryId: product.categoryId,
        currentStock: product.currentStock.toString(),
      });
    }
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
        <Navbar />
        <div className="container mx-auto p-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Producto no encontrado</p>
            <button
              className="btn bg-black text-white hover:bg-gray-800 mt-4"
              onClick={() => navigate("/admin/inventario")}
            >
              Volver al inventario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto p-8 animate-fadeIn">
        <div className="mb-6">
          <button
            className="btn btn-ghost text-gray-600"
            onClick={() => navigate("/admin/inventario")}
          >
            ← Volver al inventario
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 max-w-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditing ? "Editar Producto" : product.name}
              </h1>
              <p className="text-gray-500 font-mono">SKU: {product.sku}</p>
            </div>
            <span
              className={`badge-modern ${
                product.isActive
                  ? "badge-success"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {product.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Nombre"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Input
                  label="Descripcion (opcional)"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Precio de Venta (Gs.)"
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: e.target.value })
                    }
                    required
                    min="0"
                  />

                  <Input
                    label="Stock Actual"
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) =>
                      setFormData({ ...formData, currentStock: e.target.value })
                    }
                    required
                    min="0"
                  />
                </div>

                <Select
                  label="Categoría"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mt-4">
                  {error}
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="btn bg-black text-white hover:bg-gray-800"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Categoría</label>
                    <p className="text-gray-800 font-medium">
                      {product.category.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Precio de Venta
                    </label>
                    <p className="text-gray-800 font-medium">
                      Gs. {parseFloat(product.salePrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Stock Actual</label>
                    <p
                      className={`font-bold ${
                        product.currentStock < 10
                          ? "text-red-600"
                          : product.currentStock < 30
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.currentStock} unidades
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Última Actualización
                    </label>
                    <p className="text-gray-800">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {product.description && (
                  <div>
                    <label className="text-sm text-gray-500">Descripción</label>
                    <p className="text-gray-800">{product.description}</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mt-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  onClick={() => setIsEditing(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar producto
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    product.isActive
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                  onClick={handleToggleActive}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : product.isActive ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Desactivar
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Activar
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

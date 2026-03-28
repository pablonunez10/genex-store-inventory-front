import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { Product, Category, ProductVariant } from "../../types";
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
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantForm, setVariantForm] = useState({
    name: "",
    sku: "",
    salePrice: "",
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

  const openVariantModal = (variant?: ProductVariant) => {
    if (variant) {
      setEditingVariant(variant);
      setVariantForm({
        name: variant.name,
        sku: variant.sku,
        salePrice: variant.salePrice,
        currentStock: variant.currentStock.toString(),
      });
    } else {
      setEditingVariant(null);
      setVariantForm({ name: "", sku: "", salePrice: "", currentStock: "0" });
    }
    setShowVariantModal(true);
  };

  const closeVariantModal = () => {
    setShowVariantModal(false);
    setEditingVariant(null);
    setVariantForm({ name: "", sku: "", salePrice: "", currentStock: "0" });
    setError("");
  };

  const handleSaveVariant = async () => {
    if (!variantForm.name || !variantForm.sku || !variantForm.salePrice) {
      setError("Nombre, SKU y precio son requeridos");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingVariant) {
        await productsService.updateVariant(editingVariant.id, {
          name: variantForm.name,
          salePrice: parseFloat(variantForm.salePrice),
          currentStock: parseInt(variantForm.currentStock),
        });
      } else {
        await productsService.createVariant(id!, {
          name: variantForm.name,
          sku: variantForm.sku,
          salePrice: parseFloat(variantForm.salePrice),
        });
      }
      closeVariantModal();
      await loadProduct();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar variante");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVariant = async (variant: ProductVariant) => {
    if (!confirm(`¿Eliminar la variante "${variant.name}"?`)) return;

    setSaving(true);
    try {
      await productsService.deleteVariant(variant.id);
      await loadProduct();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar variante");
    } finally {
      setSaving(false);
    }
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

        {/* Sección de Variantes */}
        <div className="glass-card rounded-2xl p-6 max-w-2xl mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Variantes</h2>
            <button
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              onClick={() => openVariantModal()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Variante
            </button>
          </div>

          {product.variants && product.variants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Nombre</th>
                    <th className="text-left py-2 px-2 text-gray-600 font-medium">SKU</th>
                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Precio</th>
                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Stock</th>
                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Estado</th>
                    <th className="text-left py-2 px-2 text-gray-600 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="border-b border-gray-100">
                      <td className="py-2 px-2 text-gray-800">{variant.name}</td>
                      <td className="py-2 px-2 text-gray-600 font-mono text-xs">{variant.sku}</td>
                      <td className="py-2 px-2 text-gray-800">Gs. {parseFloat(variant.salePrice).toLocaleString()}</td>
                      <td className={`py-2 px-2 font-bold ${
                        variant.currentStock < 10
                          ? "text-red-600"
                          : variant.currentStock < 30
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}>
                        {variant.currentStock}
                      </td>
                      <td className="py-2 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          variant.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {variant.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 text-xs"
                            onClick={() => openVariantModal(variant)}
                          >
                            Editar
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 text-xs"
                            onClick={() => handleDeleteVariant(variant)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay variantes para este producto. Agrega variantes como "iPhone 13 Pro", "Samsung A56", etc.
            </p>
          )}
        </div>
      </div>

      {/* Modal de Variante */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingVariant ? "Editar Variante" : "Nueva Variante"}
            </h3>

            <div className="space-y-4">
              <Input
                label="Nombre de la variante"
                type="text"
                placeholder="Ej: iPhone 13 Pro, Samsung A56"
                value={variantForm.name}
                onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                required
              />

              <Input
                label="SKU"
                type="text"
                placeholder="Ej: VID-IPH13PRO"
                value={variantForm.sku}
                onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                disabled={!!editingVariant}
                required
              />

              <Input
                label="Precio de Venta (Gs.)"
                type="number"
                value={variantForm.salePrice}
                onChange={(e) => setVariantForm({ ...variantForm, salePrice: e.target.value })}
                min="0"
                required
              />

              {editingVariant && (
                <Input
                  label="Stock Actual"
                  type="number"
                  value={variantForm.currentStock}
                  onChange={(e) => setVariantForm({ ...variantForm, currentStock: e.target.value })}
                  min="0"
                />
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg mt-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={closeVariantModal}
              >
                Cancelar
              </button>
              <button
                className="flex-1 btn bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSaveVariant}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

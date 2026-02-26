import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import { Category } from "../../types";
import { categoriesService } from "../../services/categories.service";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from "react-icons/md";

export default function Categorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || "" });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, {
          name: formData.name,
          description: formData.description || undefined,
        });
      } else {
        await categoriesService.create({
          name: formData.name,
          description: formData.description || undefined,
        });
      }
      closeModal();
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar categoría");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      return;
    }

    try {
      await categoriesService.delete(category.id);
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error al eliminar categoría");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto p-8 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Categorías</h1>
            <p className="text-gray-600">Gestiona las categorías de productos</p>
          </div>
          <button onClick={() => openModal()} className="btn-gradient flex items-center gap-2">
            <MdAdd className="text-xl" />
            Nueva Categoría
          </button>
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
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-500 bg-white">
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-6xl opacity-20">📁</div>
                          <p className="text-lg font-medium">No hay categorías creadas</p>
                          <button
                            onClick={() => openModal()}
                            className="btn-gradient mt-2 flex items-center gap-2"
                          >
                            <MdAdd /> Crear primera categoría
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="bg-white">
                        <td className="font-semibold text-gray-800">{category.name}</td>
                        <td className="text-gray-600">{category.description || "-"}</td>
                        <td className="text-gray-600">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(category)}
                              className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                            >
                              <MdEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(category)}
                              className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                            >
                              <MdDelete className="text-lg" />
                            </button>
                          </div>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="glass-card rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-ghost btn-circle text-gray-500 hover:text-gray-700"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre"
                type="text"
                placeholder="Ej: Electrónica"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <TextArea
                label="Descripción"
                placeholder="Descripción de la categoría (opcional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-xl animate-fadeIn">
                  <span className="font-medium text-sm">{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-gradient flex items-center gap-2 flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <MdSave />
                      {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 border-0 px-6 rounded-xl font-semibold transition-all"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

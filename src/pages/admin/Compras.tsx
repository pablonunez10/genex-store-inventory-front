import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { Product } from "../../types";
import { productsService } from "../../services/products.service";
import { purchasesService } from "../../services/purchases.service";
import { format } from "date-fns";

export default function Compras() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productSku: "",
    productDescription: "",
    quantity: "",
    costPrice: "",
    salePrice: "",
    supplier: "",
    invoiceNumber: "",
    purchaseDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data.filter((p) => p.isActive));
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let productId = formData.productId;

      if (isNewProduct) {
        const newProduct = await productsService.create({
          name: formData.productName,
          sku: formData.productSku,
          description: formData.productDescription || undefined,
          salePrice: parseFloat(formData.salePrice),
        });
        productId = newProduct.id;
      }

      await purchasesService.create({
        productId,
        quantity: parseInt(formData.quantity),
        costPrice: parseFloat(formData.costPrice),
        salePrice: parseFloat(formData.salePrice),
        supplier: formData.supplier || undefined,
        invoiceNumber: formData.invoiceNumber || undefined,
        purchaseDate: formData.purchaseDate,
      });
      alert("Compra registrada exitosamente");
      navigate("/admin/inventario");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrar compra");
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const totalCost =
    formData.quantity && formData.costPrice
      ? (
          parseInt(formData.quantity) * parseFloat(formData.costPrice)
        ).toLocaleString()
      : "0";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-black">
          Registrar Compra de Mercaderia
        </h1>

        <div className="card bg-white border border-gray-200 shadow-xl max-w-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="bg-black"
                    checked={isNewProduct}
                    onChange={(e) => setIsNewProduct(e.target.checked)}
                  />
                  <span className="label-text text-black font-medium">
                    Crear producto nuevo
                  </span>
                </label>
              </div>

              {isNewProduct ? (
                <>
                  <div className="mt-4">
                    <Input
                      label="Nombre del Producto"
                      type="text"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      label="SKU"
                      type="text"
                      value={formData.productSku}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productSku: e.target.value,
                        })
                      }
                      required
                    />

                    <Input
                      label="Descripcion (opcional)"
                      type="text"
                      value={formData.productDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <Select
                    label="Producto Existente"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (SKU: {product.sku}) - Stock actual:{" "}
                        {product.currentStock}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Cantidad"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                  min="1"
                />

                <Input
                  label="Fecha de Compra"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Precio de Costo (Gs.)"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: e.target.value })
                  }
                  required
                  min="0"
                />

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
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Proveedor (opcional)"
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                />

                <Input
                  label="Nro. Factura (opcional)"
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invoiceNumber: e.target.value,
                    })
                  }
                />
              </div>

              {!isNewProduct && selectedProduct && (
                <div className="bg-gray-100 border border-gray-300 text-black p-4 rounded-lg mt-4">
                  <div>
                    <p>Stock actual: {selectedProduct.currentStock}</p>
                    <p>
                      Nuevo stock:{" "}
                      {selectedProduct.currentStock +
                        (parseInt(formData.quantity) || 0)}
                    </p>
                    <p>Costo total: Gs. {totalCost}</p>
                  </div>
                </div>
              )}

              {isNewProduct && formData.quantity && formData.costPrice && (
                <div className="bg-gray-100 border border-gray-300 text-black p-4 rounded-lg mt-4">
                  <div>
                    <p>Producto nuevo</p>
                    <p>Stock inicial: {formData.quantity || 0}</p>
                    <p>Costo total: Gs. {totalCost}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-gray-200 border border-gray-400 text-black p-4 rounded-lg mt-4">
                  <span className="text-black">{error}</span>
                </div>
              )}

              <div className="form-control mt-6 flex flex-row gap-2">
                <button
                  type="submit"
                  className="btn bg-black text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Registrar Compra"}
                </button>
                <button
                  type="button"
                  className="btn bg-black text-white hover:bg-gray-800"
                  onClick={() => navigate("/admin")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

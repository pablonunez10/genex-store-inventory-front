import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { Product, Category, ProductVariant } from "../../types";
import { productsService } from "../../services/products.service";
import { purchasesService } from "../../services/purchases.service";
import { categoriesService } from "../../services/categories.service";
import { format } from "date-fns";

type PurchaseMode = "product" | "variant" | "newProduct" | "newVariant";

export default function Compras() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("product");

  const [formData, setFormData] = useState({
    // Producto existente
    productId: "",
    // Variante existente
    variantId: "",
    // Nuevo producto
    productName: "",
    productSku: "",
    productDescription: "",
    productCategoryId: "",
    // Nueva variante
    variantName: "",
    variantSku: "",
    // Datos de compra
    quantity: "",
    costPrice: "",
    salePrice: "",
    supplier: "",
    invoiceNumber: "",
    purchaseDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data.filter((p) => p.isActive));
    } catch (error) {
      console.error("Error cargando productos:", error);
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

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const selectedVariant = selectedProduct?.variants?.find(
    (v) => v.id === formData.variantId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (purchaseMode === "newProduct") {
        // Crear producto nuevo y registrar compra
        const newProduct = await productsService.create({
          name: formData.productName,
          sku: formData.productSku,
          description: formData.productDescription || undefined,
          salePrice: parseFloat(formData.salePrice),
          categoryId: formData.productCategoryId,
        });

        await purchasesService.create({
          productId: newProduct.id,
          quantity: parseInt(formData.quantity),
          costPrice: parseFloat(formData.costPrice),
          salePrice: parseFloat(formData.salePrice),
          supplier: formData.supplier || undefined,
          invoiceNumber: formData.invoiceNumber || undefined,
          purchaseDate: formData.purchaseDate,
        });
      } else if (purchaseMode === "newVariant") {
        // Crear variante nueva y registrar compra
        const newVariant = await productsService.createVariant(formData.productId, {
          name: formData.variantName,
          sku: formData.variantSku,
          salePrice: parseFloat(formData.salePrice),
        });

        await purchasesService.createVariantPurchase({
          variantId: newVariant.id,
          quantity: parseInt(formData.quantity),
          costPrice: parseFloat(formData.costPrice),
          salePrice: parseFloat(formData.salePrice),
          supplier: formData.supplier || undefined,
          invoiceNumber: formData.invoiceNumber || undefined,
          purchaseDate: formData.purchaseDate,
        });
      } else if (purchaseMode === "variant") {
        // Compra de variante existente
        await purchasesService.createVariantPurchase({
          variantId: formData.variantId,
          quantity: parseInt(formData.quantity),
          costPrice: parseFloat(formData.costPrice),
          salePrice: parseFloat(formData.salePrice),
          supplier: formData.supplier || undefined,
          invoiceNumber: formData.invoiceNumber || undefined,
          purchaseDate: formData.purchaseDate,
        });
      } else {
        // Compra de producto base
        await purchasesService.create({
          productId: formData.productId,
          quantity: parseInt(formData.quantity),
          costPrice: parseFloat(formData.costPrice),
          salePrice: parseFloat(formData.salePrice),
          supplier: formData.supplier || undefined,
          invoiceNumber: formData.invoiceNumber || undefined,
          purchaseDate: formData.purchaseDate,
        });
      }

      alert("Compra registrada exitosamente");
      navigate("/admin/inventario");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrar compra");
    } finally {
      setLoading(false);
    }
  };

  const totalCost =
    formData.quantity && formData.costPrice
      ? (parseInt(formData.quantity) * parseFloat(formData.costPrice)).toLocaleString()
      : "0";

  const hasVariants = selectedProduct?.variants && selectedProduct.variants.length > 0;

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
              {/* Selector de modo */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tipo de compra
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      purchaseMode === "product"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setPurchaseMode("product");
                      setFormData({ ...formData, variantId: "" });
                    }}
                  >
                    Producto existente
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      purchaseMode === "variant"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPurchaseMode("variant")}
                  >
                    Variante existente
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      purchaseMode === "newVariant"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPurchaseMode("newVariant")}
                  >
                    Nueva variante
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      purchaseMode === "newProduct"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPurchaseMode("newProduct")}
                  >
                    Producto nuevo
                  </button>
                </div>
              </div>

              {/* Producto nuevo */}
              {purchaseMode === "newProduct" && (
                <>
                  <div className="mt-4">
                    <Input
                      label="Nombre del Producto"
                      type="text"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({ ...formData, productName: e.target.value })
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
                        setFormData({ ...formData, productSku: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Descripcion (opcional)"
                      type="text"
                      value={formData.productDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, productDescription: e.target.value })
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <Select
                      label="Categoría"
                      value={formData.productCategoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, productCategoryId: e.target.value })
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
                </>
              )}

              {/* Producto existente o para agregar variante */}
              {(purchaseMode === "product" || purchaseMode === "variant" || purchaseMode === "newVariant") && (
                <div className="mt-4">
                  <Select
                    label="Producto"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value, variantId: "" })
                    }
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (SKU: {product.sku})
                        {product.variants && product.variants.length > 0
                          ? ` - ${product.variants.length} variantes`
                          : ` - Stock: ${product.currentStock}`}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Variante existente */}
              {purchaseMode === "variant" && selectedProduct && (
                <div className="mt-4">
                  {hasVariants ? (
                    <Select
                      label="Variante"
                      value={formData.variantId}
                      onChange={(e) =>
                        setFormData({ ...formData, variantId: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccionar variante</option>
                      {selectedProduct.variants?.filter(v => v.isActive).map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.name} (SKU: {variant.sku}) - Stock: {variant.currentStock}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded-lg text-sm">
                      Este producto no tiene variantes. Selecciona "Nueva variante" para crear una.
                    </div>
                  )}
                </div>
              )}

              {/* Nueva variante */}
              {purchaseMode === "newVariant" && selectedProduct && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Nombre de la variante"
                    type="text"
                    placeholder="Ej: iPhone 13 Pro"
                    value={formData.variantName}
                    onChange={(e) =>
                      setFormData({ ...formData, variantName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="SKU de la variante"
                    type="text"
                    placeholder="Ej: VID-IPH13PRO"
                    value={formData.variantSku}
                    onChange={(e) =>
                      setFormData({ ...formData, variantSku: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {/* Datos de la compra */}
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
                    setFormData({ ...formData, invoiceNumber: e.target.value })
                  }
                />
              </div>

              {/* Resumen */}
              {formData.quantity && formData.costPrice && (
                <div className="bg-gray-100 border border-gray-300 text-black p-4 rounded-lg mt-4">
                  {purchaseMode === "newProduct" && (
                    <p className="font-medium">Producto nuevo: {formData.productName}</p>
                  )}
                  {purchaseMode === "newVariant" && selectedProduct && (
                    <p className="font-medium">
                      Nueva variante: {selectedProduct.name} - {formData.variantName}
                    </p>
                  )}
                  {purchaseMode === "variant" && selectedVariant && (
                    <>
                      <p className="font-medium">
                        {selectedProduct?.name} - {selectedVariant.name}
                      </p>
                      <p>Stock actual: {selectedVariant.currentStock}</p>
                      <p>
                        Nuevo stock: {selectedVariant.currentStock + (parseInt(formData.quantity) || 0)}
                      </p>
                    </>
                  )}
                  {purchaseMode === "product" && selectedProduct && (
                    <>
                      <p className="font-medium">{selectedProduct.name}</p>
                      <p>Stock actual: {selectedProduct.currentStock}</p>
                      <p>
                        Nuevo stock: {selectedProduct.currentStock + (parseInt(formData.quantity) || 0)}
                      </p>
                    </>
                  )}
                  <p className="mt-2 font-bold">Costo total: Gs. {totalCost}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mt-4">
                  {error}
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
                  className="btn bg-gray-200 text-black hover:bg-gray-300"
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

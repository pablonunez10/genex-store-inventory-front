import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import { Product } from '../../types';
import { productsService } from '../../services/products.service';
import { salesService } from '../../services/sales.service';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Vender() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data.filter((p) => p.isActive && p.currentStock > 0));
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity('1');
    const modal = document.getElementById('add_to_cart_modal') as HTMLDialogElement;
    modal?.showModal();
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const qty = parseInt(quantity);
    if (qty <= 0 || qty > selectedProduct.currentStock) {
      alert('Cantidad invalida o sin stock suficiente');
      return;
    }

    const existingItem = cart.find((item) => item.product.id === selectedProduct.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { product: selectedProduct, quantity: qty }]);
    }

    const modal = document.getElementById('add_to_cart_modal') as HTMLDialogElement;
    modal?.close();
    setSelectedProduct(null);
    setQuantity('1');
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert('El carrito esta vacio');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      await salesService.create(items);
      alert('Venta registrada exitosamente');
      setCart([]);
      navigate('/vendedor/mis-ventas');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar venta');
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.product.salePrice) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Registrar Venta</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card bg-white border border-gray-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-black">Productos Disponibles</h2>

                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Buscar por nombre o SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                  <table className="table text-black border-collapse w-full bg-white">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                      <tr className="text-black">
                        <th className="border border-gray-300 text-black bg-gray-100">SKU</th>
                        <th className="border border-gray-300 text-black bg-gray-100">Nombre</th>
                        <th className="border border-gray-300 text-black bg-gray-100">Precio</th>
                        <th className="border border-gray-300 text-black bg-gray-100">Stock</th>
                        <th className="border border-gray-300 text-black bg-gray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center border border-gray-300 text-black bg-white">
                            No hay productos disponibles
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product, index) => (
                          <tr key={product.id} className={`text-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="border border-gray-300 text-black">{product.sku}</td>
                            <td className="border border-gray-300 text-black">{product.name}</td>
                            <td className="border border-gray-300 text-black">Gs. {parseFloat(product.salePrice).toLocaleString()}</td>
                            <td className="border border-gray-300 text-black">{product.currentStock}</td>
                            <td className="border border-gray-300 text-black">
                              <button
                                className="btn btn-sm bg-black text-white hover:bg-gray-800"
                                onClick={() => handleProductClick(product)}
                              >
                                Agregar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card bg-white border border-gray-200 shadow-xl sticky top-8">
              <div className="card-body">
                <h2 className="card-title text-black">Carrito</h2>

                {cart.length === 0 ? (
                  <p className="text-center py-8 text-black">Carrito vacio</p>
                ) : (
                  <div>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between items-center p-2 border rounded">
                          <div className="flex-1">
                            <p className="font-semibold text-black">{item.product.name}</p>
                            <p className="text-sm text-black">
                              {item.quantity} x Gs. {parseFloat(item.product.salePrice).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-black">
                              Gs. {(parseFloat(item.product.salePrice) * item.quantity).toLocaleString()}
                            </p>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => handleRemoveFromCart(item.product.id)}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between items-center text-xl font-bold text-black">
                      <span>Total:</span>
                      <span>Gs. {total.toLocaleString()}</span>
                    </div>

                    {error && (
                      <div className="bg-gray-200 border border-gray-400 text-black p-4 rounded-lg mt-4">
                        <span className="text-black">{error}</span>
                      </div>
                    )}

                    <button
                      className="btn bg-black text-white hover:bg-gray-800 btn-block mt-4"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? 'Procesando...' : 'Confirmar Venta'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <dialog id="add_to_cart_modal" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg text-black">Agregar al Carrito</h3>
          {selectedProduct && (
            <div className="py-4">
              <p className="font-semibold text-black">{selectedProduct.name}</p>
              <p className="text-sm text-black">SKU: {selectedProduct.sku}</p>
              <p className="text-sm text-black">Precio: Gs. {parseFloat(selectedProduct.salePrice).toLocaleString()}</p>
              <p className="text-sm text-black">Stock disponible: {selectedProduct.currentStock}</p>

              <div className="mt-4">
                <Input
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max={selectedProduct.currentStock}
                />
              </div>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn bg-gray-200 text-black hover:bg-gray-300" onClick={() => setSelectedProduct(null)}>Cancelar</button>
              <button className="btn bg-black text-white hover:bg-gray-800" onClick={handleAddToCart} type="button">
                Agregar
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

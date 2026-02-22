import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';

import AdminDashboard from './pages/admin/Dashboard';
import Inventario from './pages/admin/Inventario';
import CrearProducto from './pages/admin/CrearProducto';
import Compras from './pages/admin/Compras';
import Ventas from './pages/admin/Ventas';
import Reportes from './pages/admin/Reportes';

import VendedorDashboard from './pages/vendedor/Dashboard';
import Vender from './pages/vendedor/Vender';
import MisVentas from './pages/vendedor/MisVentas';

function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventario"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Inventario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos/nuevo"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CrearProducto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/compras"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Compras />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ventas"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Ventas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Reportes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendedor"
          element={
            <ProtectedRoute allowedRoles={['VENDEDOR']}>
              <VendedorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendedor/vender"
          element={
            <ProtectedRoute allowedRoles={['VENDEDOR']}>
              <Vender />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendedor/mis-ventas"
          element={
            <ProtectedRoute allowedRoles={['VENDEDOR']}>
              <MisVentas />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

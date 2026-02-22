import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { MdLogin } from "react-icons/md";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar-modern px-6 py-4 flex items-center justify-between">
      <Link
        to={user?.role === "ADMIN" ? "/admin" : "/vendedor"}
        className="text-2xl font-bold hover:opacity-80 transition-opacity"
      >
        ✨ Genex Store
      </Link>
      <div className="flex items-center gap-4 px-4 py-2 glass rounded-xl">
        <div className="flex flex-col items-end">
          <span className="font-semibold text-sm">{user?.name}</span>
          <span className="text-xs opacity-80">{user?.role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-sm bg-white/20 border-white/30 hover:bg-white/30 text-white transition-all"
          title="Cerrar sesión"
        >
          <MdLogin className="text-lg" />
        </button>
      </div>
    </div>
  );
}

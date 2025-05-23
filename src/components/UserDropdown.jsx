import { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

export default function UserDropdown({ role, logout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="user-icon">
        <UserIcon className="icon" />
      </button>

      {open && (
        <div className="dropdown-menu">
          {role === "admin" && (
            <>
              <Link to="/admin" className="dropdown-item">
                Gestionar usuarios
              </Link>
              <Link to="/inventario" className="dropdown-item">
                Inventario
              </Link>
            </>
          )}

          {role === "vendedor" && (
            <>
              <Link to="/inventario" className="dropdown-item">
                Inventario
              </Link>
            </>
          )}

          {role === "cliente" && (
            <>
              <Link to="/" className="dropdown-item">
                Ver Pedidos
              </Link>
            </>
          )}

          <button className="dropdown-item" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}


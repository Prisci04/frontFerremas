import { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

export default function UserDropdown({ role, logout , clienteId}) {
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
        <button onClick={() => setOpen(!open)} className="header_principal_action_btn">
          <UserIcon className="header_principal_action_btn" />
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
                <Link to={`/${clienteId}/mis-pedidos`} className="dropdown-item">
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


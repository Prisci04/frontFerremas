import { useState, useRef, useEffect, useMemo } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import UserDropdown from "./UserDropdown";

import {
  WrenchScrewdriverIcon,
  BoltIcon,
  BuildingOffice2Icon,
  PaintBrushIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router";
import OpenRouter from "./OpenRouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductos } from "../api/productos";

function Header2({
  cart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  clearCart,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const backdropRef = useRef(null);
  const [authUser, setAuthUser] = useState();
  const [buscarProducto, setBuscarProducto] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  //state derivado
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.precio, 0),
    [cart]
  );

  // Cerrar menú y carrito al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (backdropRef.current && backdropRef.current === event.target) {
        setCartOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("ferremasCart_")) {
        localStorage.removeItem(key);
      }
    });
    // query client
    clearCart();
    queryClient.clear();

    queryClient.invalidateQueries(["user"]);

    navigate("/login", { replace: true });
    window.location.reload();
  };

  const { data, isError, isLoading } = useAuth();
  // console.log("datos header2::", data);

  const { data: dataProductos, isLoading: isLoadingProductos } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const handleChange = (value) => {
    setBuscarProducto((prevBuscar) => {
      const datosBuscados = [];
      datosBuscados.map(() =>
        dataProductos.filter((item) => item.nombre === value)
      );
      return datosBuscados;
    });
  };

  return (
    <>
      <header className="header_principal_container">
        <div className="header_principal_wrapper">
          <div className="header_principal_content">
            {/* Logo y Menú */}
            <div className="header_principal_logo_section">
              <Link to="/" className="header_principal_logo">
                <img
                  src="/img/logoferremas-removebg.png"
                  alt="Logo Ferremas"
                  className="header_principal_logo_img"
                />
              </Link>
              <button
                className="header_principal_action_btn"
                onClick={() => setIsOpen(true)}
              >
                <Bars3Icon />
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="header_principal_search_section">
              <div
                className={`header_principal_search_wrapper ${
                  searchFocused ? "focused" : ""
                }`}
              >
                <div
                  className={`header_principal_search_container ${
                    searchFocused ? "focused" : ""
                  }`}
                >
                  <div className="header_principal_search_input_wrapper">
                    <div className="header_principal_search_icon_left ">
                      <MagnifyingGlassIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="¿Qué estás buscando?"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onChange={(evt) => handleChange(evt.target.value)}
                      className="header_principal_search_input"
                    />
                  </div>
                  <button className="header_principal_search_btn">
                    <MagnifyingGlassIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Acciones del usuario */}
            <div className="header_principal_actions">
              {data ? (
                <>
                  <UserDropdown role={data.role} logout={logout} clienteId={data._id}/>
                  <span className="header_principal_greeting">
                    Hola {data?.nombre} {data?.apellido}
                  </span>
                </>
              ) : (
                <>
                  <Link to="/login" className="header_principal_action_btn">
                    <UserIcon />
                  </Link>
                  <span className="header_principal_greeting">
                    <Link to="/login" className="header-link">
                      Ingresar
                    </Link>{" "}
                    /{" "}
                    <Link to="/register" className="header-link">
                      Registrarse
                    </Link>
                  </span>
                </>
              )}

              <Link to="/open-router" className="header_principal_action_btn">
                <SparklesIcon />
              </Link>

              <button
                className="header_principal_action_btn"
                onClick={toggleCart}
              >
                <ShoppingCartIcon />
                {cart.length > 0 && (
                  <span className="header_principal_cart_badge">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`offcanvas-categorias ${isOpen ? "open" : ""}`}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            <Squares2X2Icon className="icono2" /> Categorías
          </h5>
          <button className="btn-close" onClick={() => setIsOpen(false)}>
            <XMarkIcon className="icono2" />
          </button>
        </div>

        <div className="offcanvas-body">
          <div className="categoria-separador">Todas las categorías</div>
          <Link
            to="/productos"
            className="categoria-btn active"
            onClick={() => setIsOpen(false)}
          >
            <Squares2X2Icon className="icono" /> Todos los productos
          </Link>

          <div className="categoria-separador">Herramientas y materiales</div>
          <button
            className="categoria-btn"
            onClick={() => {
              handleCategoria("herramientas");
              setIsOpen(false);
            }}
          >
            <WrenchScrewdriverIcon className="icono" /> Herramientas
          </button>
          <button
            className="categoria-btn"
            onClick={() => {
              handleCategoria("materiales");
              setIsOpen(false);
            }}
          >
            <BoltIcon className="icono" /> Materiales Eléctricos
          </button>
          <button
            className="categoria-btn"
            onClick={() => {
              handleCategoria("construccion");
              setIsOpen(false);
            }}
          >
            <BuildingOffice2Icon className="icono" /> Construcción
          </button>

          <div className="categoria-separador">Acabados y protección</div>
          <button
            className="categoria-btn"
            onClick={() => {
              handleCategoria("pinturas");
              setIsOpen(false);
            }}
          >
            <PaintBrushIcon className="icono" /> Pinturas
          </button>
          <button
            className="categoria-btn"
            onClick={() => {
              handleCategoria("adhesivos");
              setIsOpen(false);
            }}
          >
            <ShieldCheckIcon className="icono" /> Adhesivos y Sellantes
          </button>
          <button
            className="categoria-btn"
            onClick={() => {
              handleCategoria("seguridad");
              setIsOpen(false);
            }}
          >
            <ShieldCheckIcon className="icono" /> Seguridad
          </button>

          <div className="logo-final-cat">
            <img src="/img/logoferremas-removebg.png" alt="Logo Ferremas" />
          </div>
        </div>
      </div>

      {/* Backdrop para el carrito */}
      <div
        ref={backdropRef}
        className={`cart-backdrop ${cartOpen ? "open" : ""}`}
        onClick={closeCart}
      ></div>

      {/* Mini Carrito - Nuevo diseño */}
      <div
        ref={cartRef}
        className={`mini-cart-modern ${cartOpen ? "open" : ""}`}
      >
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingCartIcon className="cart-header-icon" />
            <h3 className="cart-titulo">Tu Carrito</h3>
          </div>
          <button className="close-cart-btn" onClick={closeCart}>
            <XMarkIcon className="icon" />
          </button>
        </div>

        {isEmpty ? (
          <p className="px-4 py-2">El carrito está vacío</p>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((producto) => (
                <div key={producto._id} className="cart-item">
                  <div className="item-image">
                    <img src={producto.imagen} alt={producto.nombre} />
                  </div>
                  <div className="item-details">
                    <div className="item-price">
                      <h4>{producto.nombre}</h4>
                      <span className="current-price">${producto.precio}</span>
                      <div className="item-actions">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() => decreaseQuantity(producto._id)}
                          >
                            <MinusIcon className="icon-sm" />
                          </button>
                          <span className="quantity">{producto.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => increaseQuantity(producto._id)}
                          >
                            <PlusIcon className="icon-sm" />
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(producto._id)}
                        >
                          <TrashIcon className="icon-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Total:</span>
                  <span className="total-price">${cartTotal}</span>
                </div>
              </div>

              <div className="cart-actions">
                <Link to="/carrito" className="cart-btn secondary">
                  Ir al carro
                </Link>
                <Link to="/pago" className="cart-btn primary">
                  Continuar con el pago
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Header2;

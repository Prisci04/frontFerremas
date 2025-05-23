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
  SparklesIcon ,
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
import {useQuery, useQueryClient} from "@tanstack/react-query"
import { getProductos } from "../api/productos";

function Header2({ cart, decreaseQuantity, increaseQuantity, removeFromCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const backdropRef = useRef(null);
  const [authUser, setAuthUser] = useState()
  const [buscarProducto, setBuscarProducto] = useState([])

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
  const queryClient = useQueryClient()




  const logout = () => {

    localStorage.removeItem("AUTH_TOKEN");
    // query client

    queryClient.clear();

    queryClient.invalidateQueries(['user']);

    navigate("/login", { replace: true });
    window.location.reload();

    // navigate("/login");
    
  };

  const { data, isError, isLoading } = useAuth();
  // console.log("datos header2::", data);


  const {data: dataProductos, isLoading: isLoadingProductos} = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos
  })

  const handleChange = (value)=> {
    setBuscarProducto((prevBuscar) => {
      const datosBuscados = []
      datosBuscados.map(()=> dataProductos.filter((item) => item.nombre === value  ))
      return datosBuscados
    })
  }



  
 
  return (
    <>
    {data?._id && 
      <header className="main-header">
        <div className="header-container">
          {/* Versión móvil y desktop */}
          <div className="header-left">
            <div className="logo-container">
              <div className="">
                <Link to="/" className="">
  <img
    src="/img/logoferremas-removebg.png"
    alt="Logo Ferremas"
    className="logo-ferremas"
  />
</Link>
              </div>
            </div>
            <button className="menu-btn" onClick={() => setIsOpen(true)}>
              <Bars3Icon className="icon" />
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className={`search-container ${searchFocused ? "focused" : ""}`}>
            <div className="search-box">
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={(evt) => handleChange(evt.target.value)}
              />
              <button className="search-btn">
                <MagnifyingGlassIcon className="icon" />
              </button>
            </div>
          </div>

          <div className="header-right">
            <div className="header-icons">
              <UserDropdown role= {data.role} logout={logout} />
              
              Hola {data?.nombre} {data?.apellido}
             
              <Link to="/open-router"><SparklesIcon className="icon" /></Link>
              
              <button className="cart-icon" onClick={toggleCart}>
                <ShoppingCartIcon className="icon" />
                
              </button>
              {/* <button onClick={() => logout()}>
                <p>Cerrar sesion</p>
              </button> */}
            </div>
          </div>
        </div>
      </header>
}

      {/* Menú de categorías */}

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
          <Link to="/productos"
            className="categoria-btn active"
          >
            <Squares2X2Icon className="icono" /> Todos los productos
          </Link>

          <div className="categoria-separador">Herramientas y materiales</div>
          <button
            className="categoria-btn"
            onClick={() => handleCategoria("herramientas")}
          >
            <WrenchScrewdriverIcon className="icono" /> Herramientas
          </button>
          <button
            className="categoria-btn"
            onClick={() => handleCategoria("materiales")}
          >
            <BoltIcon className="icono" /> Materiales Eléctricos
          </button>
          <button
            className="categoria-btn"
            onClick={() => handleCategoria("construccion")}
          >
            <BuildingOffice2Icon className="icono" /> Construcción
          </button>

          <div className="categoria-separador">Acabados y protección</div>
          <button
            className="categoria-btn"
            onClick={() => handleCategoria("pinturas")}
          >
            <PaintBrushIcon className="icono" /> Pinturas
          </button>
          <button
            className="categoria-btn"
            onClick={() => handleCategoria("adhesivos")}
          >
            <ShieldCheckIcon className="icono" /> Adhesivos y Sellantes
          </button>
          <button
            className="categoria-btn"
            onClick={() => handleCategoria("seguridad")}
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

      {/* CARRITOO */}
      {/* Mini Carrito - Nuevo diseño */}
      <div
        ref={cartRef}
        className={`mini-cart-modern ${cartOpen ? "open" : ""}`}
      >
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingCartIcon className="cart-header-icon" />
            <h3 className="cart-titulo">Tu Carrito</h3>
            {/* <span className="cart-count-badge">hola</span> */}
          </div>
          <button className="close-cart-btn" onClick={closeCart}>
            <XMarkIcon className="icon" />
          </button>
        </div>
        {isEmpty ? (
          <p>El carrito esta vacio</p>
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
                      <span className="current-price">{producto.precio}</span>
                      {/* <span className="original-price">{formatPrice(item.originalPrice)}</span> */}

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
                  <span>Total con otros medios de pago:</span>
                  <span className="total-price">${cartTotal}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button className="cart-btn secondary">
                  <Link to="/carrito">Ir al carro</Link>
                </button>
                <button className="cart-btn primary">
                  Continuar con el pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </>
  );
}

export default Header2;

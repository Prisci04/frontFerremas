import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./view/LoginPage";
import RegisterPage from "./view/RegisterPage";
import NotFoundPage from "./view/NotFound";
import ProductosPage from "./view/ProductosPage";
import Header2 from "./components/Header2";
import Footer from "./components/Footer";
import InventarioPage from "./view/InventarioVendedor";
import Bodega from "./view/BodegaBodeguero";
import Carrito from "./view/Carrito";
import PagoPage from "./view/PagoPage";
import { useState, useEffect } from "react";
import SuccessPage from "./view/SuccessPage";
import FailurePage from "./view/FailurePage";
import PendingPage from "./view/PendingPage";
import AdminPage from "./view/AdminPage";
import InicioPage from "./view/InicioPage"
import { useAuth } from "./hooks/useAuth";
import OpenRouter from "./view/OpenRouter";
import PruebaTailwind from "./view/PruebaTailwind";
import DetalleProductoPage from "./view/DetalleProductoPage";
import GraciasCompra from "./view/GraciasCompra";
import MisPedidos from "./view/MisPedidos";


const getToken = () => localStorage.getItem("AUTH_TOKEN");

const initialCart = () => {
  const token = getToken();
  if (!token) return [];
  const localStorageCart = localStorage.getItem(`ferremasCart_${token}`);
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

function App() {
  //ESTADO CARRITO
  const [cart, setCart] = useState(initialCart);
  console.log("Guardando en localStorage:", cart);

  useEffect(() => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    localStorage.setItem(`ferremasCart_${token}`, JSON.stringify(cart));
  }
}, [cart]);

  const MAX_ITEMS = 5;

  const addToCart = (item) => {
    const itemIndex = cart.findIndex((producto) => producto._id === item._id);
    if (itemIndex >= 0) {
      if (cart[itemIndex].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const itemConCantidad = { ...item, quantity: 1 };
      setCart([...cart, itemConCantidad]);
    }
  };

  //Para incrementar
  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      //incrementar la cantidad por id
      //&& item.quantity < 5 para LIMITAR el incremento
      //se puede colcoar la cantidad asi o con una variable como MAX_ITEMS (que es 5)
      if (item._id === id && item.quantity < 5) {
        return {
          //retorno el item, pero la cantidad la modifico
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item._id === id && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }
  //Para eliminar del carrito
  function removeFromCart(id) {
    //filtra los productos cuyo ID sea diferente al ID que te estoy pasando
    setCart((prevCart) => prevCart.filter((producto) => producto._id !== id));
  }
  

  


  return (
    <BrowserRouter>
      <Header2
        cart={cart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart} 
      />
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/productos"
          element={<ProductosPage addToCart={addToCart} />}
        />
        <Route path="/open-router" element={<OpenRouter />} />

        <Route path="/admin" element={<AdminPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/bodega" element={<Bodega />} />
        
        <Route path="/producto/:id" element={<DetalleProductoPage addToCart={addToCart}/>} />
        <Route path="/gracias" element={<GraciasCompra />} />
        <Route path="/:clienteId/mis-pedidos" element={<MisPedidos />} />


        <Route
          path="/carrito"
          element={
            <Carrito
              cart={cart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
              
            />
          }
        />
        <Route path="/pago" element={<PagoPage cart={cart} />} />

        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/pending" element={<PendingPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

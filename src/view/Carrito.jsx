import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  CreditCardIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function Carrito({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  
  const subtotal = cart.reduce(
    (acumulador, producto) => acumulador + producto.precio * producto.quantity,
    0
  );

  const isEmpty = useMemo(() => cart.length === 0, [cart]);


  return (
    <div>
      <header>
        <div className="left-header">
          <Link to="/productos" className="back-button">
            <ArrowLeftIcon className="icon" />
          </Link>
        </div>
        <div className="center-title">
          <h1>Carrito de Compras</h1>
        </div>
      </header>

      <div className="container">
        <div className="products">
          {isEmpty ? (
            <p>El carrito esta vacio</p>
          ): (
            cart.map((producto) => (
            <div className="product-item" key={producto._id}>
              <img src={producto.imagen} alt={producto.nombre} />
              <div className="product-info">
                <h4>{producto.nombre}</h4>
                <div className="quantity">
                  <button onClick={() => decreaseQuantity(producto._id)}>
                    <MinusIcon className="icon" />
                  </button>
                  <span className="cantidad">{producto.quantity}</span>
                  <button onClick={() => increaseQuantity(producto._id)}>
                    <PlusIcon className="icon" />
                  </button>

                  <button className="remove-btn">
                          <TrashIcon className="icon-sm" onClick={() => removeFromCart(producto._id)} />
                        </button>
                </div>
              </div>
              <div className="price">
                <strong>${producto.precio * producto.quantity}</strong>
              </div>
            </div>
          ))

          )}
          
          
        </div>

        <div className="summary">
          <h3>Resumen de Compra</h3>
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${subtotal}</span>
          </div>
          <div className="summary-item">
            <span>Envío:</span>
            <span>Gratis</span>
          </div>
          <div className="summary-item">
            <span>Total:</span>
            <span>
              <strong>${subtotal}</strong>
            </span>
          </div>

          <div className="discount">
            <p>¿Tienes un cupón? Agrégalo en el pago.</p>
          </div>

          <Link to="/pago" className="continuar-pago">
            <CreditCardIcon className="icon" />Continuar con el pago
          </Link>
        </div>
      </div>
    </div>
  );
}

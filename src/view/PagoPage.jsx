import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  ArrowLeftIcon,
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router";

export default function PagoPage({ cart }) {
  const [metodoPago, setMetodoPago] = useState("mercado");
  const [tipoDespacho, setTipoDespacho] = useState("tienda");
  const [cupon, setCupon] = useState("");
  const [cuponValido, setCuponValido] = useState(null);
  const [mostrarDireccion, setMostrarDireccion] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rut: "",
    telefono: ""
  })

  useEffect(() => {
    setMostrarDireccion(tipoDespacho === "domicilio");
  }, [tipoDespacho]);

  const handleMetodoPago = (e) => {
    setMetodoPago(e.target.id);
  };

  const handleDespacho = (e) => {
    setTipoDespacho(e.target.value);
  };

  const aplicarCupon = () => {
    setCuponValido(cupon.toUpperCase() === "BIENVENIDA");
  };

  const subtotal = cart.reduce(
    (acumulador, producto) => acumulador + producto.precio * producto.quantity,
    0
  );

  const calcularTotal = () => {
    const descuento = cuponValido ? 7597 : 0;
    const envio = tipoDespacho === "domicilio" ? 3990 : 0;
    return subtotal - descuento + envio;
  };


  //ENVIO DE DATOS DEL FORM
  const handleChangeInput = async (inputId, nuevoValor) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData, 
        [inputId]: nuevoValor
      }

    });
    console.log(formData)

  }

  ///COMPRAAAA

  const fetchComprarPost = async (cart, formData) => {
    try {
      console.log(cart);
      const response = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        {
          items: cart,
          formData
        }
      );

      const data = response.data;
      // const { init_point } = response.data;
      window.location.href = data.init_point;
      return data;
      

    } catch (error) {
      console.error("Error al iniciar pago:", error);
    }

  }

  const fetchWebhook = async (data) => {
    try {
      // console.log(cart);
      const response = await axios.post(
        "http://localhost:3000/api/payment/webhook", data
       
      );

      const datosWebhook = response.data;   
      return datosWebhook;
      

    } catch (error) {
      console.error("Error en el webhook", error);
    }

  }

  const handleFinalizarCompra = async () => {
    const returnData =  await fetchComprarPost(cart, formData)

    const returnWebhook = await fetchWebhook(data)

    console.log("return data::",returnData);
    console.log("return webhook::",returnWebhook)
     
    
  };

  return (
    <div>
      <header>
        <div className="left-header">
          <Link to="/carrito" className="back-button">
            <ArrowLeftIcon className="icon" />
          </Link>
        </div>
      </header>

      <main className="checkout-container">
        <h2 className="checkout-title">Completa tu pago</h2>

        <div className="checkout-steps">
          <div className="step active">
            <div className="step-number">1</div>
            <div className="step-text">Carrito</div>
          </div>
          <div className="step-line active" />
          <div className="step active">
            <div className="step-number">2</div>
            <div className="step-text">Pago</div>
          </div>
          <div className="step-line" />
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-text">Confirmación</div>
          </div>
        </div>

        <div className="checkout-main-container">
          <div className="checkout-left-column">
            <div className="payment-method-box">
              <h3>Método de pago</h3>
              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    name="pago"
                    id="mercado"
                    checked={metodoPago === "mercado"}
                    onChange={handleMetodoPago}
                  />
                  <label htmlFor="mercado">
                    <img
                      src="/img/mercado-pago.png"
                      alt="Mercado Pago"
                      className="payment-logo"
                    />{" "}
                    Mercado Pago
                  </label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    name="pago"
                    id="transferencia"
                    checked={metodoPago === "transferencia"}
                    onChange={handleMetodoPago}
                  />
                  <label htmlFor="transferencia">
                    <img
                      src="/img/trasferencia.png"
                      alt="Transferencia"
                      className="payment-logo"
                    />{" "}
                    Transferencia Bancaria
                  </label>
                </div>
              </div>

              {metodoPago === "mercado" ? (
                <div className="card-form">
                  <p>
                    En el boton Finalizar compra te redirigiremos a mercado pago
                  </p>
                </div>
              ) : (
                <div className="transfer-info">
                  <div className="transfer-header">
                    <BanknotesIcon className="icon" />
                    <h4>Datos para transferencia</h4>
                  </div>
                  <div className="transfer-details">
                    <p>
                      <strong>Banco:</strong> BancoEstado
                    </p>
                    <p>
                      <strong>Tipo de cuenta:</strong> Cuenta Corriente
                    </p>
                    <p>
                      <strong>Número de cuenta:</strong> 123456789
                    </p>
                    <p>
                      <strong>Nombre:</strong> FERREMAS SPA
                    </p>
                    <p>
                      <strong>RUT:</strong> 76.123.456-7
                    </p>
                    <p>
                      <strong>Email:</strong> pagos@ferremas.cl
                    </p>
                  </div>
                  <div className="transfer-note">
                    <InformationCircleIcon className="icon" />
                    <p>
                      Una vez realizada la transferencia, envía el comprobante a{" "}
                      <strong>pagos@ferremas.cl</strong> indicando tu número de
                      pedido.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-divider"></div>

            <div className="checkout-form">
              <h3>Información de envío</h3>

              {/* FORM */}
              <form id="shipping-form" >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input type="text" id="nombre" value={formData.nombre} onChange={(evt) => handleChangeInput(evt.target.id, evt.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" id="email" value={formData.email} onChange={(evt) => handleChangeInput(evt.target.id, evt.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="rut">RUT</label>
                    <input type="text" id="rut" value={formData.rut} onChange={(evt) => handleChangeInput(evt.target.id, evt.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input type="tel" id="telefono" value={formData.telefono} onChange={(evt) => handleChangeInput(evt.target.id, evt.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="tipo-despacho">Tipo de despacho</label>
                  <select
                    id="tipo-despacho"
                    value={tipoDespacho}
                    onChange={(e) => setTipoDespacho(e.target.value)}
                  >
                    <option value="tienda">Retiro en tienda (Gratis)</option>
                    <option value="domicilio">
                      Despacho a domicilio ($3.990)
                    </option>
                  </select>
                </div>

                {mostrarDireccion && (
                  <div id="direccion-container">
                    <div className="form-group">
                      <label htmlFor="direccion">Dirección de envío</label>
                      <input type="text" id="direccion" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="comuna">Comuna</label>
                        <select id="comuna">
                          <option value="">Selecciona una comuna</option>
                          <option value="santiago">Santiago</option>
                          <option value="providencia">Providencia</option>
                          <option value="nunoa">Ñuñoa</option>
                          <option value="lascondes">Las Condes</option>
                          <option value="vitacura">Vitacura</option>
                          <option value="maipu">Maipú</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="region">Región</label>
                        <select id="region">
                          <option value="metropolitana">Metropolitana</option>
                          <option value="valparaiso">Valparaíso</option>
                          <option value="biobio">Bío Bío</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </form>
              {/* TERMINA FORM */}
            </div>
          </div>

          <div className="checkout-right-column">
            <div className="order-summary">
              <h3>Resumen de compra</h3>
              <div className="order-items">
                {cart.map((producto) => (
                  <div className="product-item" key={producto._id}>
                    <img src={producto.imagen} alt={producto.nombre} />
                    <div>
                      <h4>{producto.nombre}</h4>
                      <p className="item-price">{producto.precio}</p>
                      <p className="item-quantity">
                        Cantidad: {producto.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="coupon-section">
                <div className="coupon-form">
                  <input
                    type="text"
                    placeholder="Código de cupón"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value)}
                  />
                  <button onClick={aplicarCupon}>Aplicar</button>
                </div>
                {cuponValido === true && (
                  <div className="coupon-message">
                    <CheckCircleIcon className="icon" />
                    <span>Cupón BIENVENIDA aplicado: 10% de descuento</span>
                  </div>
                )}
                {cuponValido === false && (
                  <div className="coupon-message-error error">
                    <XCircleIcon className="icon" />
                    <span>Cupón inválido o expirado</span>
                  </div>
                )}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString("es-CL")}</span>
                </div>
                {cuponValido && (
                  <div className="total-row" id="discount-row">
                    <span>Descuento</span>
                    <span>-$7.597</span>
                  </div>
                )}
                <div className="total-row" id="shipping-row">
                  <span>Envío</span>
                  <span>
                    {tipoDespacho === "domicilio" ? "$3.990" : "Gratis"}
                  </span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${calcularTotal().toLocaleString("es-CL")}</span>
                </div>
              </div>

              <button className="btn-finalizar" onClick={handleFinalizarCompra}>
                <CheckCircleIcon className="icon-pago" /> Finalizar compra
              </button>
              <div className="secure-checkout">
                <LockClosedIcon className="icon" />
                <span>Pago seguro garantizado</span>
              </div>
              <div className="checkout-policies">
                <p>
                  Al finalizar la compra, aceptas nuestros{" "}
                  <a href="#">Términos y Condiciones</a> y{" "}
                  <a href="#">Política de Privacidad</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

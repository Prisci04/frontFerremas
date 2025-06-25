import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Producto({ producto, addToCart }) {
  const { id, nombre, imagen, marca, precio } = producto;

  return (
    <>
      <Link to={`/producto/${producto._id}`} className="producto-card">
        <img
          src={imagen || "https://via.placeholder.com/150?text=Sin+imagen"}
          alt={nombre}
        />
        <h4 className="producto-card-nombre">{nombre}</h4>
        <h4 className="producto-card-marca">{marca.nombre}</h4>
        <p className="producto-card-price">$ {precio}</p>
        <button
          className="producto-card-add-to-cart-btn"
          type="button"
          onClick={() => addToCart(producto)}
        >
          <ShoppingCartIcon className="producto-card-icon" /> Añadir al carrito
        </button>
      </Link>
    </>
  );
}

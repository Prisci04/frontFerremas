import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Producto({ producto, addToCart }) {
  const { id, nombre, imagen, marca, precio } = producto;

  return (
    <>
      <div className="product-card">
        <img src={imagen || "https://via.placeholder.com/150?text=Sin+imagen"} alt={nombre} />
        <h4>{nombre}</h4>
        <h4>{marca.nombre}</h4>
        <p className="price">{precio}</p>
        <button
          className="add-to-cart-btn"
          type="button"
          onClick={() => addToCart(producto)}
        >
          <ShoppingCartIcon className="icon" /> Añadir al carrito
        </button>
      </div>
    </>
  );
}

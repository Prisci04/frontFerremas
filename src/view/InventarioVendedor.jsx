import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoria } from "../api/categoria";
import { getMarca } from "../api/marca";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../api/productos";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null); // índice del producto en modo edición
  const [editedProducto, setEditedProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    marca: "",
    categoria: "",
    imagen: "",
  });

  const inicialValue = {
    nombre: "",
    descripcion: "",
    categoria: "",
    cantidad: "",
    precio: "",
    marca: "",
    imagen: "",
  };
  const [formData, setFormData] = useState(inicialValue);

  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useAuth();
  const navigate = useNavigate();


  // QUERIES: Productos, Categoria, Marca
  const {
    data: dataProductos,
    isError: isErrorProductos,
    isLoading: isLoadingProductos,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
    retry: 1,
  });

  const {
    data: dataCategoria,
    isError: isErrorCategoria,
    isLoading: isLoadingCategoria,
  } = useQuery({
    queryKey: ["categoria"],
    queryFn: getCategoria,
    retry: 1,
  });

  const {
    data: dataMarca,
    isError: isErrorMarca,
    isLoading: isLoadingMarca,
  } = useQuery({
    queryKey: ["marca"],
    queryFn: getMarca,
    retry: 1,
  });

  // MUTATIONS
  const { mutate } = useMutation({
    mutationFn: createProducto,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries(["productos"]);
      setFormData(inicialValue);
      setError(""); // limpiar errores
    },
    onError: (error) => {
      console.log(error.message);
      setError(error.response?.data?.message || "Hubo un error al crear el producto.");
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateProducto,
    onSuccess: (data) => {
      console.log("producto actualizado::", data);
      queryClient.invalidateQueries(["productos"]);
      setEditIndex(null);
      setEditedProducto(null);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries(["productos"]);
    },
    onError: (error) => {
      console.log("Error al eliminar:", error.message);
    },
  });

  // LÓGICA DEL USEEFFECT para roles y redireccionar
  useEffect(() => {
    if (!data || (data.role !== "admin" && data.role !== "vendedor")) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data, navigate]);

  if (isLoading) return <p>cargando</p>;

  if (data.role !== "admin" && data.role !== "vendedor") {
    return <p>No puede ver esta vista. Redirigiendo en 3 segundos...</p>;
  }


//para enviar el producto
  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      nombre,
      cantidad,
      categoria: { idCategoria },
      precio,
      marca: { idMarca },
      descripcion,
      imagen,
    } = formData;

    if (!nombre || !cantidad || !precio || !descripcion) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (isNaN(precio) || isNaN(cantidad)) {
    setError("El precio y el stock deben ser números.");
    return;
  }

    console.log("Datos a enviar:", formData);
    setError("");
    mutate(formData);
    console.log("datos:::", formData);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleEditClick = (index) => {
    const producto = dataProductos[index];
    console.log("Editando producto:::", producto);
    queryClient.invalidateQueries(["productos"]);
    setEditIndex(index);
    setEditedProducto({ ...producto });
  };

  const handleInputChangeEditar = (e) => {
    const { id, value } = e.target;
    setEditedProducto((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedProducto(null);
  };

  const handleSave = () => {
    if (!editedProducto || !editedProducto._id) {
      console.log("form data:", formData);
      console.error("No hay _id en el producto editado");
      return;
    }

    updateMutate(editedProducto);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ferremas"); // tu preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/da2cwvtus/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const imgData = await res.json();
      setFormData((prev) => ({ ...prev, imagen: imgData.secure_url })); // **aquí actualizas el estado con la URL**
      console.log("Imagen subida y formData actualizado:", updated);
      return updated;
    } catch (err) {
      console.error("Error subiendo la imagen:", err);
    }
  };

  if (dataProductos && dataCategoria && dataMarca)
    return (
      <div className="inventario-container">
        <header className="header2">
          <h1>Gestión de Inventario</h1>
        </header>

        <div className="inventario-ferremas-content">
        <button className="inventario-ferremas-agregar-btn" onClick={() => setMostrarFormulario((prev) => !prev)}>
          
          {mostrarFormulario ? "Ocultar Formulario" : "Agregar Producto"}
        </button>

        {mostrarFormulario && (
          <div className="inventario-ferremas-form-container">
            <h3 className="inventario-ferremas-form-title">Agregar Nuevo Producto</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="inventario-ferremas-form-grid">
                <div className="inventario-ferremas-form-group">
                  <label className="inventario-ferremas-form-label">Nombre del Producto</label>
                  <input
                    type="text"
                    className="inventario-ferremas-input"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre del producto"
                    required
                  />
                </div>

                <div className="inventario-ferremas-form-group">
                  <label className="inventario-ferremas-form-label">Categoría</label>
                  <select
                    className="inventario-ferremas-select"
                    id="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {dataCategoria.map((categoria) => (
                      <option value={categoria._id} key={categoria._id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inventario-ferremas-form-group">
                  <label className="inventario-ferremas-form-label">Marca</label>
                  <select
                    className="inventario-ferremas-select"
                    value={formData.marca}
                    id="marca"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar marca</option>
                    {dataMarca.map((marca) => (
                      <option value={marca._id} key={marca._id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inventario-ferremas-form-group">
                  <label className="inventario-ferremas-form-label">Stock</label>
                  <input
                    type="number"
                    className="inventario-ferremas-input"
                    min="0"
                    id="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    placeholder="Cantidad en stock"
                    required
                  />
                </div>

                <div className="inventario-ferremas-form-group">
                  <label className="inventario-ferremas-form-label">Precio</label>
                  <input
                    className="inventario-ferremas-input"
                    id="precio"
                    type="number"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="Precio del producto"
                    required
                  />
                </div>

                <div className="inventario-ferremas-form-group">
                  <label className="inventario-ferremas-form-label">Imagen del Producto</label>
                  <input
                    type="file"
                    className="inventario-ferremas-file-input"
                    name="imagen"
                    id="imagen"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="inventario-ferremas-form-group">
                <label className="inventario-ferremas-form-label">Descripción</label>
                <textarea
                  className="inventario-ferremas-textarea"
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción detallada del producto"
                  required
                />
              </div>

              <button className="inventario-ferremas-submit-btn" type="submit">
                Agregar Producto
              </button>
            </form>
          </div>
        )}

        <div className="inventario-ferremas-productos-section">
          <h3 className="inventario-ferremas-productos-title">Productos en Inventario</h3>
          <input
            type="text"
            className="inventario-ferremas-search-input"
            placeholder="Buscar producto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <table className="inventario-ferremas-table">
            <thead className="inventario-ferremas-tabla-nombres">
              <tr >
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dataProductos.map((producto, index) => (
                <tr key={producto._id}>
                  {editIndex === index ? (
                    <>
                      <td>
                        <input
                          className="inventario-ferremas-edit-input"
                          id="nombre"
                          value={editedProducto.nombre}
                          onChange={handleInputChangeEditar}
                        />
                      </td>
                      <td>
                        <textarea
                          className="inventario-ferremas-edit-textarea"
                          id="descripcion"
                          value={editedProducto.descripcion}
                          onChange={handleInputChangeEditar}
                        />
                      </td>
                      <td>
                        <select
                          className="inventario-ferremas-edit-select"
                          value={editedProducto.marca}
                          id="marca"
                          onChange={handleInputChangeEditar}
                        >
                          <option value="">Seleccionar marca</option>
                          {dataMarca.map((marca) => (
                            <option value={marca._id} key={marca._id}>
                              {marca.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="inventario-ferremas-edit-select"
                          id="categoria"
                          value={editedProducto.categoria}
                          onChange={handleInputChangeEditar}
                        >
                          <option value="">Seleccionar categoría</option>
                          {dataCategoria.map((categoria) => (
                            <option value={categoria._id} key={categoria._id}>
                              {categoria.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          className="inventario-ferremas-edit-input"
                          type="number"
                          id="cantidad"
                          value={editedProducto.cantidad}
                          onChange={handleInputChangeEditar}
                        />
                      </td>
                      <td>
                        <input
                          className="inventario-ferremas-edit-input"
                          type="number"
                          id="precio"
                          value={editedProducto.precio}
                          onChange={handleInputChangeEditar}
                        />
                      </td>
                      <td>
                        <button onClick={handleSave} className="inventario-ferremas-btn-guardar">
                          Guardar
                        </button>
                        <button onClick={handleCancel} className="inventario-ferremas-btn-cancelar">
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{producto.nombre}</td>
                      <td>{producto.descripcion}</td>
                      <td>{producto.marca.nombre}</td>
                      <td>
                        {dataMarca.find((cat) => cat._id === producto.categoria)?.nombre || "Sin categoría"}
                      </td>
                      <td>{producto.cantidad}</td>
                      <td>${producto.precio.toLocaleString("es-CL")}</td>
                      <td>
                        <button className="inventario-ferremas-btn-actualizar" onClick={() => handleEditClick(index)}>
                          <CheckCircleIcon className="icon" /> Actualizar
                        </button>
                        <button className="inventario-ferremas-btn-eliminar">
                          <TrashIcon className="icon" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    );
}

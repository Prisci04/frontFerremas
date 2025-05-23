import { useEffect, useState } from "react";
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
    },
    onError: (error) => {
      console.log(error.message);
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

  // Handlers

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

    console.log("Datos al enviar:", formData);

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
    setFormData(prev => ({ ...prev, imagen: imgData.secure_url })); // **aquí actualizas el estado con la URL**
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
          <div className="header2-right">
            <UserIcon className="icon" />
          </div>
        </header>

        <button
          className="agregar-producto-btn"
          onClick={() => setMostrarFormulario((prev) => !prev)}
        >
          <PlusCircleIcon className="icon" />{" "}
          {mostrarFormulario ? "Ocultar" : "Agregar Producto"}
        </button>

        {mostrarFormulario && (
          <form className="form-agregar-producto" onSubmit={handleSubmit}>
            <h3>Agregar Nuevo Producto</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nombre"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <textarea
                placeholder="Descripción"
                id="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={4}
              />

              <select id="categoria" onChange={handleChange} required>
                <option value="">Seleccionar categoría</option>
                {dataCategoria.map((categoria) => (
                  <option
                    value={categoria._id}
                    key={categoria._id}
                    onChange={handleChange}
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <input
                type="text"
                min="0"
                id="cantidad"
                placeholder="Stock"
                value={formData.cantidad}
                onChange={handleChange}
                required
              />
              <input
                id="precio"
                placeholder="Precio"
                type="text"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <select
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

              <input
                type="file"
                name="imagen"
                id="imagen"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <button className="btn-agregar-producto" type="submit">
              <p>Agregar Producto</p>
            </button>
          </form>
        )}

        <h3>Productos en Inventario</h3>
        <input
          type="text"
          className="search-box-inventario"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <table className="inventario-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataProductos.map((producto, index) => (
              <tr value={producto._id} key={producto._id}>
                {/* PARA ACTUALIZARLO */}
                {editIndex === index ? (
                  <>
                    <td className="border p-2">
                      <input
                        id="nombre"
                        value={editedProducto.nombre}
                        onChange={handleInputChangeEditar}
                        className="border px-2 py-1 w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <textarea
                        id="descripcion"
                        value={editedProducto.descripcion}
                        onChange={handleInputChangeEditar}
                        className="border px-2 py-1 w-full"
                      />
                    </td>

                    <td className="border p-2">
                      <select
                        value={editedProducto.marca}
                        id="marca"
                        onChange={handleInputChangeEditar}
                        required
                      >
                        <option value="">Seleccionar marca</option>
                        {dataMarca.map((marca) => (
                          <option
                            id={marca._id}
                            value={marca._id}
                            key={marca._id}
                          >
                            {marca.nombre}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border p-2">
                      <select
                        id="categoria"
                        value={editedProducto.categoria}
                        onChange={handleInputChangeEditar}
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        {dataCategoria.map((categoria) => (
                          <option
                            id={categoria._id}
                            value={categoria._id}
                            key={categoria._id}
                          >
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border p-2">
                      <input
                        type="text"
                        id="cantidad"
                        value={editedProducto.cantidad}
                        onChange={handleInputChangeEditar}
                        className="border px-2 py-1 w-full"
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        type="text"
                        id="precio"
                        value={editedProducto.precio}
                        onChange={handleInputChangeEditar}
                        className="border px-2 py-1 w-full"
                      />
                    </td>

                    <td className="border p-2">
                      <button onClick={handleSave} className="btn-actualizar">
                        Guardar
                      </button>
                      <button onClick={handleCancel} className="btn-actualizar">
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  // CUANDO LO MUESTRO
                  <>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>

                    <td>
                      {/* {(() => {
                        console.log("prudct marca", producto.marca);
                        console.log("data marca", dataMarca);
                      })()} */}

                      {dataMarca.find(
                        (marca) => marca._id === producto.marca._id
                      )?.nombre || "Sin marca"}
                    </td>

                    <td>
                      {dataCategoria.find(
                        (cat) => cat._id === producto.categoria
                      )?.nombre || "Sin categoría"}
                    </td>

                    <td>{producto.cantidad}</td>

                    <td>${producto.precio.toLocaleString("es-CL")}</td>
                    <td>
                      <button
                        className="btn-actualizar"
                        onClick={() => handleEditClick(index)}
                      >
                        <CheckCircleIcon className="icon" /> Actualizar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => deleteMutate(producto)}
                      >
                        <TrashIcon className="icon" />
                      </button>
                    </td>
                  </>
                )}

                {/* aca abajo*/}
                {/* ))} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

import React from "react";
import { useState, useEffect } from "react";
import {
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { registrar, getUserFerremas } from "../api/auth";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false);

  // Arreglo de roles
  const roles = ["vendedor", "bodeguero", "contador"];

  const inicialValue = {
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    role: roles
  };
  const [formData, setFormData] = useState(inicialValue);
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

//AGREGAR USUARIOS
  const { mutate } = useMutation({
      mutationFn: registrar,
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["usuarios"]);

        toast.success(data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        
        setFormData(inicialValue);
      },
      onError: (error) => {
        console.log(error.message);
      },
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, apellido, email, password, } = formData;

    if (!nombre || !apellido || !email || !password ) {
      setError("Por favor completa todos los campos.");
      return;
    }

    
    mutate(formData);

    // Resetear el formulario
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      rol: roles[0],
    });
    setShowForm(false);
  };


  //PARA MOSTRAR USUARIOS
    const {
      data: dataUsuarios,
      isError: isErrorUsuarios,
      isLoading: isLoadingUsuarios,
    } = useQuery({
      queryKey: ["usuarios"],
      queryFn: getUserFerremas,
      retry: 1,
    });

    const { data, isError, isLoading } = useAuth();
    const navigate = useNavigate()


  console.log(isError)

  

  if (isLoading)  return(
     <p>No puede ver esta vista</p>
    )
  console.log(data)


 useEffect(() => {
    if (data.role !== "admin" && data.role !== "vendedor") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [data, navigate]);

  if (data.role !== "admin" && data.role !== "vendedor") {
    return <p>No puede ver esta vista. Redirigiendo en 3 segundos...</p>;
  }


if (dataUsuarios)
    return (
    <>
      <div className="inventario-container">
        <header className="header2">
          <h1>Gestión de Usuarios</h1>
          <div className="header2-right">
            <UserIcon className="icon" />
          </div>
        </header>

        <div className="content">
          <button className="add-button" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : <>Agregar Usuario</>}
          </button>

          {showForm && (
            <div className="form-container">
              <h2>Nuevo Usuario</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rol</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {roles.map((rol) => (
                      <option key={rol} value={rol}>
                        {rol.charAt(0).toUpperCase() + rol.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="submit-button">
                  Guardar
                </button>
              </form>
            </div>
          )}
        </div>

        <h3>Usuarios ferremas</h3>
        
        <table className="inventario-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataUsuarios.map((usuario, index) => (
              <tr value={usuario._id} key={usuario._id}>
                {/* PARA ACTUALIZARLO */}
                
                 
                  <>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.role}</td>
                    

                    
                    <td>
                      <button
                        className="btn-actualizar"
                        
                      >
                        <CheckCircleIcon className="icon" /> Actualizar
                      </button>
                      <button
                        className="btn-eliminar"
                        
                      >
                        <TrashIcon className="icon" />
                      </button>
                    </td>
                  </>
               

                {/* aca abajo*/}
                {/* ))} */}
              </tr>
            ))}
          </tbody>
        </table>


        
      </div>
    </>
  );
}

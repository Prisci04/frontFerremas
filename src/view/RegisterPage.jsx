import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registrar } from "../api/auth";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const inicialValue = {
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(inicialValue);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: registrar,
    onSuccess: (data) => {
      console.log(data);
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
      navigate("/login");
      setFormData(inicialValue);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre, apellido, email, password, confirmar } = formData;

    if (!nombre || !apellido || !email || !password || !confirmar) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    mutate(formData);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/img/logoferremas-removebg.png"
            alt="Logo Ferremas"
            className="logo"
          />
          <h2>Crear Cuenta</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <div className="input-container">
              <input
                type="text"
                id="nombre"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="nombre">Apellido</label>
            <div className="input-container">
              <input
                type="text"
                id="apellido"
                placeholder="Ingresa tu apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="correo">Correo electrónico</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu correo"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container">
              <input
                type="password"
                id="password"
                placeholder="Ingresa una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <div className="input-container">
              <input
                type="password"
                id="confirmar"
                placeholder="Repite la contraseña"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Registrarse
          </button>
        </form>

        <div className="extra-links">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="register-link">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <div className="decoration-element"></div>
        <div className="decoration-element-2"></div>
      </div>
    </div>
  );
};

export default RegisterPage;

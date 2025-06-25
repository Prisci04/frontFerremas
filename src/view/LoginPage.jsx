import {useMutation, useQueryClient} from '@tanstack/react-query'
import { login } from '../api/auth'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'



const LoginPage = () => {

  const navigate = useNavigate()
  const [error, setError] = useState("");

  const queryClient = useQueryClient()

  const {mutate} = useMutation({
    //para llamar a la funcion
    mutationFn: login,
    //cuando funciona completamente
    onSuccess: (data)=> {
      console.log(data)
      queryClient.invalidateQueries(['user'])
      
      navigate('/')
    },
    onError: (error)=> {
      console.log(error.message)
      setError(error.message);
    }

  })
  

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const formData = Object.fromEntries(data.entries());
    console.log(data)
    console.log(formData)

    mutate(formData)

  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="/img/logoferremas-removebg.png" alt="Logo Ferremas" className="logo" />
          <h2>Iniciar Sesión</h2>
          <p className="welcome-text">¡Bienvenido de nuevo!</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <input type="text" id="email" name="email" placeholder="Ingresa tu email"  />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container">
              <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña"  />
            </div>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="extra-links">
          <p>
            <Link to='/register' className="register-link">Crear una cuenta nueva</Link>
          </p>
        </div>

        <div className="decoration-element"></div>
        <div className="decoration-element-2"></div>
      </div>
    </div>
  )
}

export default LoginPage

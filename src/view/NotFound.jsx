

function NotFoundPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/logoferremas.png" alt="Logo Ferremas" />
        <h2 style={{ color: "#ff729d" }}>¡Oops! Página no encontrada</h2>
        <p style={{ marginBottom: "30px" }}>La página que estás buscando no existe o fue movida.</p>
        <a href="/">
          <button>
            <i className="fas fa-arrow-left"></i> Volver al inicio
          </button>
        </a>
      </div>
    </div>
  )
}

export default NotFoundPage
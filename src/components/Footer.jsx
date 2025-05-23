import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h4>Centro de Ayuda</h4>
          <ul>
            <li><a href="#">Seguimiento de mis compras</a></li>
            <li><a href="#">Servicios postventa</a></li>
            <li><a href="#">Garantía de producto</a></li>
            <li><a href="#">Cambios y devoluciones</a></li>
            <li><a href="#">Medios de pago</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Mundo Ferremas</h4>
          <ul>
            <li><a href="#">Vende en Ferremas</a></li>
            <li><a href="#">Ofertas especiales</a></li>
            <li><a href="#">CyberFerre</a></li>
            <li><a href="#">Día del Constructor</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Nosotros</h4>
          <ul>
            <li><a href="#">Quiénes somos</a></li>
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Políticas de privacidad</a></li>
            <li><a href="#">Trabaja con nosotros</a></li>
          </ul>
        </div>
        <div className="footer-col redes">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <Facebook size={18} />
            <Instagram size={18} />
            <Twitter size={18} />
          </div>
          <h4>Medios de pago</h4>
          <div className="metodos-icons">
            
            <img src="/img/mercado-pago.png" alt="Mercado Pago" />
            <img src="/img/trasferencia.png" alt="Transferencia" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Ferremas. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
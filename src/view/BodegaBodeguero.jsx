import { useState } from 'react';
import {
  UserIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  CubeIcon
} from '@heroicons/react/24/solid';

const pedidosIniciales = [
  {
    numero: '1001',
    cliente: 'Juan Pérez',
    fecha: '10 mayo 2025',
    direccion: 'Av. Principal 123, Santiago',
    productos: ['Taladro Bosch x1', 'Set de Tornillos x2'],
    preparado: false
  },
  {
    numero: '1002',
    cliente: 'Carla Ríos',
    fecha: '11 mayo 2025',
    direccion: 'Calle Los Olmos 456, Providencia',
    productos: ['Pintura Blanca x3', 'Cinta Doble Contacto x1', 'Rodillo Profesional x1'],
    preparado: false
  },
  {
    numero: '1003',
    cliente: 'Roberto Gómez',
    fecha: '11 mayo 2025',
    direccion: 'Pasaje Las Flores 789, Ñuñoa',
    productos: ['Martillo Profesional x1', 'Clavos 2" x100', 'Sierra Manual x1'],
    preparado: false
  }
];

export default function BodegaPage() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [busqueda, setBusqueda] = useState('');

  const prepararPedido = (numero) => {
    const actualizados = pedidos.map(pedido =>
      pedido.numero === numero ? { ...pedido, preparado: true } : pedido
    );
    setPedidos(actualizados);
    alert(`Pedido #${numero} ha sido marcado como preparado`);
  };

  const filtrarPedidos = pedidos.filter(p =>
    p.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <header className="bodega-header">
        <div className="center-title">
          <h1>Gestión de Bodega</h1>
        </div>
        <div className="header-right">
          <div className="dropdown-user">
            <button className="dropdown-btn">
              <UserIcon className="h-6 w-6" />
            </button>
            <div className="dropdown-content">
              <a href="/logout">Cerrar sesión</a>
            </div>
          </div>
        </div>
      </header>

      <main className="pedidos-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por cliente o número de pedido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button>
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>

        {filtrarPedidos.map(pedido => (
          <div className="pedido-card" key={pedido.numero}>
            <h3>Pedido #{pedido.numero}</h3>
            <p><strong>Cliente:</strong> {pedido.cliente}</p>
            <p><strong>Fecha:</strong> {pedido.fecha}</p>
            <p><strong>Dirección:</strong> {pedido.direccion}</p>
            <p><strong>Productos:</strong></p>
            <ul>
              {pedido.productos.map((prod, idx) => (
                <li key={idx}>{prod}</li>
              ))}
            </ul>
            <button
              className={`btn-aceptar ${pedido.preparado ? 'aceptado' : ''}`}
              onClick={() => prepararPedido(pedido.numero)}
              disabled={pedido.preparado}
            >
              {pedido.preparado ? (
                <>
                  <CheckCircleIcon className="h-5 w-5" /> Pedido preparado
                </>
              ) : (
                <>
                  <CubeIcon className="h-5 w-5" /> Preparar pedido
                </>
              )}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
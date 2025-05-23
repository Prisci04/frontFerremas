// import { useState } from 'react';

// function CheckoutButton({ cartItems }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleCheckout = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch('http://localhost:5173/api/payment/create-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ items: cartItems }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Error al crear la orden');
//       }
      
//       const data = await response.json();
      
//       // Redirigir al usuario a la pÃ¡gina de pago de Mercado Pago
//       window.location.href = data.init_point;
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       {error && <div className="error-message">{error}</div>}
//       <button 
//         onClick={handleCheckout} 
//         disabled={isLoading || cartItems.length === 0}
//         className="checkout-button"
//       >
//         {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
//       </button>
//     </div>
//   );
// }

// export default CheckoutButton;
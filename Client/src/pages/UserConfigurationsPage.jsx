import React from 'react';

const CLIENT_ID = "4385724245174951"; // Usamos la variable de entorno para el CLIENT_ID
const REDIRECT_URI = 'https://genuine-elf-ca9b01.netlify.app/admin'; // URL de redirección

export const UserConfigurationsPage = () => {
  const handleConnect = () => {
    // Usamos el CLIENT_ID correctamente en la URL de autorización
    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = authUrl; // Redirige al usuario para autenticar su cuenta de Mercado Pago
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Configuración de usuario</h2>
      <p>Conectá tu cuenta de Mercado Pago para aceptar pagos desde tu propia cuenta.</p>
      <button
        onClick={handleConnect}
        style={{
          padding: '10px 20px',
          backgroundColor: '#00B1EA',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Conectar con Mercado Pago
      </button>
    </div>
  );
};

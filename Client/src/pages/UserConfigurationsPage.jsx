import React from 'react';
import { generatePKCECodes } from '../utils/pkce';

const CLIENT_ID = "500944473460848";
const REDIRECT_URI = "https://genuine-elf-ca9b01.netlify.app/conectmp";

export const UserConfigurationsPage = () => {
  const handleConnect = async () => {
    const { code_verifier, code_challenge } = await generatePKCECodes();

    // Guardás el code_verifier para usarlo después en el backend
    localStorage.setItem("mp_code_verifier", code_verifier);

    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${code_challenge}&code_challenge_method=S256`;

    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Configuración de usuario</h2>
      <p>Conectá tu cuenta de Mercado Pago para aceptar pagos desde tu propia cuenta.</p>
      <button onClick={handleConnect}>Conectar con Mercado Pago</button>
    </div>
  );
};

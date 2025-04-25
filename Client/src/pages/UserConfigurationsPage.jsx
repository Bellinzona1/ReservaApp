import { useState } from "react";
import axios from "axios";
import { generatePKCECodes } from "../utils/pkce";

export const UserConfigurationsPage = ({ user }) => {
  const [initPoint, setInitPoint] = useState(null);
  const token = localStorage.getItem("token");

  const handleConnect = async () => {
    const CLIENT_ID = "4385724245174951";
    const REDIRECT_URI = "https://genuine-elf-ca9b01.netlify.app/conectmp";
  
    const { code_verifier, code_challenge } = await generatePKCECodes(); // 👈 Usás tu función
    localStorage.setItem("mp_code_verifier", code_verifier); // 👈 Guardás solo el verifier
  
    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${code_challenge}&code_challenge_method=S256`;
  
    window.location.href = authUrl;
  };
  
  

  const handleGeneratePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/mercadopago/crear-preferencia",
        { userId_body: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInitPoint(response.data.init_point);
    } catch (error) {
      console.error("❌ Error al crear el botón de pago", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Configuración de Usuario</h2>
      <p>Tu cuenta: <strong>{user?.email}</strong></p>

      {!user?.mercadoPagoToken ? (
        <button onClick={handleConnect}>
          🔄 Conectar con Mercado Pago
        </button>
      ) : (
        <>
          <button onClick={handleGeneratePayment}>
            💳 Generar botón de pago
          </button>

          {initPoint && (
            <div style={{ marginTop: "1rem" }}>
              <a href={initPoint} target="_blank" rel="noopener noreferrer">
                Ir a pagar con Mercado Pago
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

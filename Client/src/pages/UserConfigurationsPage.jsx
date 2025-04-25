import { useState } from "react";
import axios from "axios";
import "../Styles/UserConfigurationsPage.css";
import { Navbar } from "../components/Navbar";

export const UserConfigurationsPage = ({ user }) => {
  const [initPoint, setInitPoint] = useState(null);
  const token = localStorage.getItem("token");

  const handleConnect = () => {
    const CLIENT_ID = "4385724245174951";
    const REDIRECT_URI = "https://genuine-elf-ca9b01.netlify.app/conectmp";
    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    window.location.reload();          // Recarga la página
  };

  return (
    <div className="home">
      <Navbar user={user} />

      <div className="userConfigurationsPage">
        <h2>Configuración de Usuario</h2>
        <p><strong>{user?.name}</strong></p>

        {!user?.mercadoPagoToken ? (
          <button onClick={handleConnect} style={{ backgroundColor: "#1313f5", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            🔄 Conectar con Mercado Pago
          </button>
        ) : (
          <>
            <p>Tu cuenta está conectada a Mercado Pago</p>

            {initPoint && (
              <div style={{ marginTop: "1rem" }}>
                <a href={initPoint} target="_blank" rel="noopener noreferrer">
                  Ir a pagar con Mercado Pago
                </a>
              </div>
            )}
          </>
        )}

        {/* Botón de Cerrar sesión */}
        <button 
          onClick={handleLogout} 
          style={{ marginTop: "2rem", backgroundColor: "#ff4d4f", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

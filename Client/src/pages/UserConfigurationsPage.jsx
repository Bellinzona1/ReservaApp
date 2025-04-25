import { useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";

export const UserConfigurationsPage = ({ user }) => {
  const [initPoint, setInitPoint] = useState(null);
  const token = localStorage.getItem("token");

  const handleConnect = async () => {
    const CLIENT_ID = "4385724245174951";
    const REDIRECT_URI = "https://genuine-elf-ca9b01.netlify.app/conectmp";

    const { code_verifier, code_challenge } = await generatePKCECodes();
    localStorage.setItem("mp_code_verifier", code_verifier);

    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${code_challenge}&code_challenge_method=S256`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleDesvincularMP = async () => {
    try {
      await axios.post(
        "https://genuine-elf-ca9b01.netlify.app/api/mercadopago/desconectar",
        { userId: user._id }, // 👈 Mandás el userId correctamente
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("mp_code_verifier"); // 👈 Eliminás el code_verifier
      alert("✅ Desvinculaste Mercado Pago correctamente");
      window.location.reload(); // Refrescás para actualizar los datos del usuario
    } catch (error) {
      console.error("❌ Error al desvincular Mercado Pago", error.response?.data || error.message);
      alert("Error al desvincular Mercado Pago");
    }
  };

  return (
    <div className="home">
      <Navbar user={user} />

      <div className="userConfigurationsPage" style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Configuración de Usuario</h2>
        <p><strong>{user?.name}</strong></p>

        {!user?.mercadoPagoToken ? (
          <button
            onClick={handleConnect}
            style={{ backgroundColor: "#1313f5", color: "white", padding: "10px", border: "none", borderRadius: "5px", marginBottom: "1rem", cursor: "pointer" }}
          >
            🔄 Conectar con Mercado Pago
          </button>
        ) : (
          <>
            <p>Tu cuenta está conectada a Mercado Pago</p>

            <button
              onClick={handleDesvincularMP}
              style={{ backgroundColor: "#f59e0b", color: "white", padding: "10px", border: "none", borderRadius: "5px", marginTop: "1rem", cursor: "pointer" }}
            >
              🔌 Desvincular Mercado Pago
            </button>
          </>
        )}

        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: "#ff4d4f", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

// Si no lo importaste arriba, te paso cómo importar tu generatePKCECodes
import { generatePKCECodes } from "../utils/pkce";

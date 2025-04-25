import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../Styles/ConectMpPage.css';
import axios from 'axios';

export const ConectMpPage = ({ user }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const code = params.get("code");
    const token = localStorage.getItem("token");
    const code_verifier = localStorage.getItem("mp_code_verifier");

    if (code && token && code_verifier && user && user._id) {
      setIsConnecting(true);

      axios.post("https://reservaapp-zg71.onrender.com/api/mercadopago/token", {
        code,
        code_verifier,
        userId_body: user._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        return axios.post("https://reservaapp-zg71.onrender.com/api/mercadopago/crear-preferencia", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
      .then(() => {
        setIsConnecting(false);
        setIsConnected(true);
      })
      .catch(err => {
        console.error("❌ Error", err.response?.data || err.message);
        setIsConnecting(false);
      });
    }
  }, [params, user]);

  // Manejar redirección cuando se conectó exitosamente
  useEffect(() => {
    if (isConnected && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isConnected && countdown === 0) {
      navigate("/");
    }
  }, [isConnected, countdown, navigate]);

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {isConnecting && (
        <div style={{ textAlign: "center" }}>
          <div className="spinner" />
          <p style={{ marginTop: "10px" }}>Cargando conexión con Mercado Pago...</p>
        </div>
      )}

      {isConnected && (
        <div style={{
          backgroundColor: "#28a745",
          color: "white",
          padding: "2rem",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h2>✅ Te conectaste correctamente con Mercado Pago</h2>
          <p>Te redireccionaremos en {countdown} segundos...</p>
        </div>
      )}
    </div>
  );
};

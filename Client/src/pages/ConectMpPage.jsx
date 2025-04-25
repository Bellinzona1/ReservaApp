import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ConectMpPage = ({ user }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    const code = params.get("code");
    const token = localStorage.getItem("token");
    const code_verifier = localStorage.getItem("mp_code_verifier");

    console.log("code", code);
    console.log("token", token);
    console.log("code_verifier", code_verifier);
    console.log("user", user);
    console.log("userId", user?._id);

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
      .then(res => {
        console.log("✅ Cuenta conectada", res.data);
        setIsConnecting(false);
        setConnected(true); // ✅ ya está conectado
      })
      .catch(err => {
        console.error("❌ Error", err.response?.data || err.message);
        setIsConnecting(false);
      });
    }
  }, [params, user]);

  useEffect(() => {
    if (connected) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      if (counter === 0) {
        clearInterval(timer);
        navigate("/"); // ✅ Redirige a la home
      }

      return () => clearInterval(timer);
    }
  }, [connected, counter, navigate]);

  if (!user) return <p>Cargando información del usuario...</p>;

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: connected ? "#d4edda" : "#f0f0f0", // ✅ fondo verde cuando se conecta
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "2rem"
    }}>
      {!connected && (
        <>
          <h2 style={{ color: "#333" }}>Conectando con Mercado Pago...</h2>
          {isConnecting && <p>Procesando conexión...</p>}
        </>
      )}

      {connected && (
        <>
          <h1 style={{ color: "#155724" }}>¡Conexión exitosa! ✅</h1>
          <p style={{ color: "#155724", fontSize: "18px" }}>
            Te vamos a redireccionar en {counter}...
          </p>
        </>
      )}
    </div>
  );
};

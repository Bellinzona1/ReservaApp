import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const ConectMpPage = ({ user }) => {
  const [params] = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);
  const [initPoint, setInitPoint] = useState(null);

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
        return axios.post("https://reservaapp-zg71.onrender.com/api/mercadopago/crear-preferencia", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
      .then(res => {
        setInitPoint(res.data.init_point);
        setIsConnecting(false);
      })
      .catch(err => {
        console.error("❌ Error", err.response?.data || err.message);
        setIsConnecting(false);
      });
    }
  }, [params, user]);

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div>
      <h2>Conectar con Mercado Pago</h2>
      {isConnecting && <p>Procesando conexión...</p>}
      {initPoint && (
        <a href={initPoint} target="_blank" rel="noopener noreferrer">
          <button>Pagar reserva en {user.emprendimiento?.nombre}</button>
        </a>
      )}
    </div>
  );
};

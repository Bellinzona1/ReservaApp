import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const ConectMpPage = ({user}) => {
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const token = localStorage.getItem("token");
    const code_verifier = localStorage.getItem("mp_code_verifier");


    console.log("user", user);

    if (code && token && code_verifier) {
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
      })
      .catch(err => {
        console.log(err);
        console.error("❌ Error al conectar", err.response?.data || err.message);
      });
    }
  }, [user]);

  return <p>Conectando con Mercado Pago...</p>;
};

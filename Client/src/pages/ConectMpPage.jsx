import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const ConectMpPage = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    console.log('Código recibido:', code);

    if (code) {
      // Llamada al backend para intercambiar el code por el access_token
      axios.post('https://reservaapp-zg71.onrender.com/api/mercadopago/token', { code })
        .then(response => {
          console.log('Cuenta vinculada con éxito', response.data);
          // Podés mostrar un mensaje o redirigir a otro lugar
        })
        .catch(error => {
          console.error('Error al vincular la cuenta de Mercado Pago', error);
        });
    }
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Conectando con Mercado Pago...</h2>
      <p>Estamos vinculando tu cuenta. Por favor, esperá un momento.</p>
    </div>
  );
};

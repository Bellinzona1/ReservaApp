import axios from "axios";

// Accede a la variable de entorno
const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export const MeProfile = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};

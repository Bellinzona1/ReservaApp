import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;


export const login = async (email, password) => {
  try {
    console.log("API_URL", API_URL);
    const response = await axios.post(`${API_URL}/LoginUser`, { email, password });
    return response.data; // Retorna el token u objeto de usuario
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};


export const Register = async (name, email, password) => {
  try {
        console.log("API_URL", API_URL);

    const response = await axios.post(`${API_URL}/RegisterUser`, {name, email, password });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en el registro");
  }
};





export const logout = () => {
  localStorage.removeItem("token");
};

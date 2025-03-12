import axios from "axios";



const API_URL = "http://localhost:8080/api/users";

export const MeProfile = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};
import axios from "axios";

const API_URL = "http://localhost:8080/api/turnos";

export const AddReserva = async (id,reserva) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/reservas`, reserva);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};




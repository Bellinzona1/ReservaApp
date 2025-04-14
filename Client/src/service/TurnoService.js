import axios from "axios";



const API_URL = `${import.meta.env.VITE_API_URL}/api/turnos`;


export const getTurnoConReservas = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/reservas`);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};

export const CreateTurno = async (id,turno) => {
  try {
    const response = await axios.post(`${API_URL}/${id}`, turno);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};


export const DeleteTurno = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};


export const EditTurno = async (id,turno) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, turno);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};
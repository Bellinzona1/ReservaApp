import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/emprendimientos/servicio`;


export const AddService = async (id,servicio) => {
  try {
    const response = await axios.post(`${API_URL}/${id}`, servicio);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};


export const DeleteService = async (id, servicio) => {
  try {
    console.log("Servicio a eliminar:", servicio);
    const response = await axios.delete(`${API_URL}/${id}`, {
      data: { servicio }  // <-- El servicio debe ir en la propiedad 'data'
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};

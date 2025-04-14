import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/emprendimientos`;


export const EmprendimientoCreateById = async (id,EmprendimientoUser) => {
  console.log("Emprendimiento:", EmprendimientoUser);
  try {
    const response = await axios.post(`${API_URL}/${id}`, EmprendimientoUser);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};


export const getEmprendimientoByUserId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};


export const putEmprendimientoByUserId = async (id,EmprendimientoUser) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, EmprendimientoUser);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};

export const getEmprendimientoByName = async (name) => {
  console.log("Nombre:", name);
  try {
    const response = await axios.get(`${API_URL}/getByname/${name}`);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Error en la autenticación";
  }
};
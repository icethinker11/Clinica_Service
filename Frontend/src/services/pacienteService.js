import axios from "axios";

const API_URL = "http://localhost:5000/api/pacientes"; // Ajusta el puerto si tu backend usa otro

// ✅ Obtener todos los pacientes
export const fetchPacientes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    throw error;
  }
};

// ✅ Actualizar datos de un paciente
export const updatePaciente = async (idPaciente, datos) => {
  try {
    const response = await axios.put(`${API_URL}/${idPaciente}`, datos);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    throw error;
  }
};

// ✅ Registrar un nuevo paciente (si lo necesitas)
export const createPaciente = async (datos) => {
  try {
    const response = await axios.post(API_URL, datos);
    return response.data;
  } catch (error) {
    console.error("Error al registrar paciente:", error);
    throw error;
  }
};

// ✅ Eliminar (o desactivar) un paciente
export const deletePaciente = async (idPaciente) => {
  try {
    const response = await axios.delete(`${API_URL}/${idPaciente}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    throw error;
  }
};

// ======================================
// 📦 Importar instancia base de Axios
// ======================================
import api from "./api";

// ======================================
// 🧩 Registro de usuario
// ======================================
export const registerUsuario = async (data) => {
  try {
    const response = await api.post("/usuarios/register", data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    throw error.response?.data || { error: "Error desconocido al registrar usuario" };
  }
};

// ======================================
// 🔐 Login de usuario (actualizado)
// ======================================
export const loginUsuario = async (data) => {
  try {
    const response = await api.post("/usuarios/login", data);

    // 🔹 Extraer datos completos incluyendo rol si el backend lo devuelve
    const usuario = {
      id_usuario: response.data.id_usuario,
      nombre: response.data.nombre,
      correo: response.data.correo,
      id_rol: response.data.id_rol || 1,   // Valor por defecto si no viene
      rol: response.data.rol || "",        // Nombre del rol, opcional
    };

    // Guarda el usuario completo en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Devuelve mensaje y usuario
    return {
      msg: response.data.msg,
      ...usuario,
    };

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    throw error.response?.data || { error: "Error desconocido al iniciar sesión" };
  }
};

// ======================================
// 🚪 Logout (cerrar sesión)
// ======================================
export const logoutUsuario = () => {
  localStorage.removeItem("usuario");
  window.location.href = "/login"; // Redirigir al login
};

// ======================================
// 👤 Obtener usuario logueado
// ======================================
export const getUsuarioActual = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
};


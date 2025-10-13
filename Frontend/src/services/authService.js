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

    // ✅ Incluye el rol que viene del backend
    const usuario = {
      id_usuario: response.data.id_usuario,
      nombre: response.data.nombre,
      correo: response.data.correo,
      rol: response.data.rol, // 🔥 Aquí estaba el problema
    };

    // Guarda todo el usuario (incluido el rol)
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Devuelve todos los datos junto con el mensaje
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

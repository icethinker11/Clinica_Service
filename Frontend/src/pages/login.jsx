import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";
import StatusPopup from "../components/StatusPopup";

export default function Login() {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [popup, setPopup] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const navigate = useNavigate();

  // ✅ Manejar cambios en los inputs
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Función de login principal
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUsuario(form);
      console.log("🔹 Respuesta del backend:", res);

      // ✅ Normaliza el rol antes de guardarlo
      const rolNormalizado = res?.rol?.trim()?.toUpperCase() || "SIN_ROL";

      // ✅ Guarda usuario en localStorage
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id_usuario: res.id_usuario,
          nombre: res.nombre,
          correo: res.correo,
          rol: rolNormalizado,
        })
      );

      // ✅ Muestra popup de éxito
      setPopup({
        visible: true,
        type: "success",
        title: "¡Éxito!",
        message: res?.msg || "Login exitoso",
      });
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      setPopup({
        visible: true,
        type: "error",
        title: "Error",
        message: err.response?.data?.msg || "Usuario o contraseña incorrectos",
      });
    }
  };

  // ✅ Cerrar popup y redirigir según el rol
  const handlePopupClose = () => {
    const wasSuccess = popup.type === "success";
    setPopup({ ...popup, visible: false });

    if (wasSuccess) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const rol = usuario?.rol || "SIN_ROL";

      console.log("👤 Rol detectado:", rol);

      switch (rol) {
        case "ADMINISTRADOR":
          navigate("/menuadmin");
          break;
        case "RECEPCIONISTA":
          navigate("/menurecepcionista");
          break;
        case "DOCTOR":
          navigate("/menudoctor");
          break;
        case "PACIENTE":
          navigate("/menupaciente");
          break;
        default:
          console.warn("⚠️ Rol no reconocido, redirigiendo al inicio.");
          navigate("/");
          break;
      }
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-5 bg-[url('/fondoprueba.jpg')] bg-cover bg-center">
      {/* Lado izquierdo decorativo */}
      <div className="col-span-3"></div>

      {/* Lado derecho con el formulario */}
      <div className="col-span-2 flex items-center justify-center bg-white bg-opacity-80 min-h-screen shadow-lg p-8">
        <form className="w-full max-w-md flex flex-col gap-4 text-black" onSubmit={handleLogin}>
          <img src="/logo.jpg" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-center text-[#4495C0]">INICIAR SESIÓN</h2>
          <p className="text-l text-center">
            Hola, bienvenido al sistema de Odontdent. Inicie sesión con sus credenciales.
          </p>

          <Input
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            icon={<FaUser />}
          />
          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            icon={<FaLock />}
          />

          <div className="text-right text-sm font-bold text-[#4495C0] cursor-pointer hover:underline">
            ¿Olvidaste tu contraseña?
          </div>

          <Button type="submit">Iniciar sesión</Button>

          <p className="text-sm text-center">
            ¿No tienes una cuenta aún?{" "}
            <Link to="/register" className="font-bold hover:underline text-[#4495C0]">
              Regístrate
            </Link>
          </p>
        </form>
      </div>

      {/* ✅ Popup de estado */}
      {popup.visible && (
        <StatusPopup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}

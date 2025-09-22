import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  // 1. AÑADIR UN NUEVO ESTADO PARA LOS MENSAJES
  const [mensaje, setMensaje] = useState("");
  const [esExito, setEsExito] = useState(false); // Para cambiar el color del mensaje

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUsuario(form);
      
      // En lugar de alert, actualizamos el estado del mensaje
      setMensaje(res.data.msg);
      setEsExito(true);

      localStorage.setItem("usuario", res.data.nombre);
      
      // La navegación se retrasa un poco para que el usuario vea el mensaje
      setTimeout(() => {
        navigate("/menu");
      }, 1500); // Espera 1.5 segundos
      
    } catch (err) {
      console.error(err);
      // Actualizamos el estado para el caso de error
      setMensaje("Usuario o contraseña incorrectos");
      setEsExito(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[url('/fondoprueba.jpg')] bg-cover bg-center">
      <div className="flex-1" />
      <div className="w-full md:w-2/5 min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-80 shadow-lg p-8 w-full h-full flex items-center">
          <form
            onSubmit={handleLogin}
            className="w-80 mx-auto flex flex-col space-y-4 text-black h-full justify-center"
          >
            <img src="/logo.jpg" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center text-[#4F7B8E]">BIENVENIDO</h2>
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

            <div className="text-right text-sm font-bold text-[#4F7B8E] cursor-pointer hover:underline">
              ¿Olvidaste tu contraseña?
            </div>

            <Button type="submit">Iniciar sesión</Button>

            {/* 2. MOSTRAR EL MENSAJE */}
            {mensaje && (
              <p
                className={`text-center text-sm font-bold ${
                  esExito ? "text-green-600" : "text-red-600"
                }`}
              >
                {mensaje}
              </p>
            )}

            <p className="text-sm text-center">
              ¿No tienes una cuenta aún?{" "}
              <Link to="/register" className="font-bold hover:underline text-[#4F7B8E]">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
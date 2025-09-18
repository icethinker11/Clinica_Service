import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({
    correo: "",
    password: "",   // 👈 corregido
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUsuario(form);
      alert(res.data.msg);

      localStorage.setItem("usuario", JSON.stringify(res.data));

      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[url('/fondologin.jpg')] bg-cover bg-center">
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
              name="password"   // 👈 corregido
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              icon={<FaLock />}
            />

            <div className="text-right text-sm font-bold text-[#4F7B8E] cursor-pointer hover:underline">
              ¿Olvidaste tu contraseña?
            </div>

            <Button type="submit">Iniciar sesión</Button>

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

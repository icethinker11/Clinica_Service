import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { FaUser, FaLock } from "react-icons/fa";  
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login con:", { username, password });
    // Aquí llamas a authService.login(username, password)
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/fondologin.jpg')] bg-cover bg-center">
      <div className=" bg-white bg-opacity-80 rounded-4xl shadow-lg p-8"  >
        <form
          onSubmit={handleLogin}
          className="w-80 flex flex-col space-y-4 text-[#4F7B8E]"
        >
          <img src="/logo.jpg" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center ">BIENVENIDO</h2>

          <Input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<FaUser />}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FaLock />}
          />

          <div className="text-right text-sm font-bold  cursor-pointer hover:underline">
            ¿Olvidaste tu contraseña?
          </div>

          <Button type="submit">Iniciar sesión</Button>
       
          <p className="text-sm text-center">
            ¿No tienes una cuenta aún?{" "}
            <Link to="/register" className="font-bold hover:underline">
              Registrate
            </Link>
          </p>
        </form>
        </div>
    </div>
  );
}
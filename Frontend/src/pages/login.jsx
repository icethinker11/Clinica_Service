import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
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
    <div className="flex h-screen">
      {/* Lado izquierdo con gradiente */}
      <div className="w-1/2 bg-gradient-to-b from-sky-600 to-sky-900" />

      {/* Lado derecho */}
      <div className="w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-80 flex flex-col space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">INICIAR SESIÒN</h2>
          <p className="text-sm text-center text-gray-600">
            Hola, bienvenido de vuelta, llena cada espacio usando tus datos.
          </p>

          <Input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right text-xs text-gray-500 cursor-pointer hover:underline">
            ¿Olvidaste tu contraseña?
          </div>

          <Button type="submit">Iniciar sesiòn</Button>
       
          <p className="text-sm text-center">
            ¿No tienes una cuenta aùn?{" "}
            <Link to="/register" className="font-bold hover:underline">
              Resgistrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
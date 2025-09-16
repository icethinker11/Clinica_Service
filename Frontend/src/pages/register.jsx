import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registro con:", form);
    // authService.register(form)
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-b from-sky-600 to-sky-900" />
      <div className="w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleRegister}
          className="w-80 flex flex-col space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">REGISTRARSE</h2>
          <p className="text-sm text-center text-gray-600">
            Crea una cuenta y empieza ya.
          </p>

          <Input name="username" placeholder="Usuario" onChange={handleChange} />
          <Input name="email" placeholder="Correo" onChange={handleChange} />
          <Input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
          <Input type="password" name="confirm" placeholder="Confirmar contraseña" onChange={handleChange} />

          <Button type="submit">Registrar</Button>

          <p className="text-sm text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-bold hover:underline">
              Iniciar sesiòn
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
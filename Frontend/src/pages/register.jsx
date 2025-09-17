import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    dni: "",
    fechadenacimiento: "",
    telefono: "",
    direccion: "",
    provincia: "",
    
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registro con:", form);
    // authService.register(form)
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/fondologin.jpg')] bg-cover bg-center">
      <div className=" bg-white bg-opacity-80 rounded-4xl shadow-lg p-8"  >
        <form
          onSubmit={handleRegister}
          className="w-140 flex flex-col gap-3 text-[#4F7B8E]"
        >
          <h2 className="text-2xl font-bold text-center">REGISTRARSE</h2>
          <p className="text-sm text-center">
            Rellena los campos con tus datos.
          </p>

          <div className="grid grid-cols-2 gap-3">
          <Input name="username" placeholder="Usuario" onChange={handleChange} icon={<FaUser/>}/>
          <Input name="email" placeholder="Correo" onChange={handleChange} icon={<FaEnvelope/>}/>
          <Input type="password" name="password" placeholder="Contraseña" onChange={handleChange} icon={<FaLock/>}/>
          <Input type="password" name="confirm" placeholder="Confirmar contraseña" onChange={handleChange} icon={<FaLock/>}/>
          <Input name="nombres" placeholder="Nombres" onChange={handleChange} icon={<FaUserTag  />}/>
          <Input name="apellidoPaterno" placeholder="Apellido paterno" onChange={handleChange} icon={<FaUserTag/>}/>
          <Input name="apellidoMaterno" placeholder="Apellido materno" onChange={handleChange} icon={<FaUserTag/>}/>
          <Input name="dni" placeholder="DNI" onChange={handleChange} icon={<FaIdCard/>}/>
          <Input type="date" name="fechadenacimiento" onChange={handleChange} />
          <Input name="telefono" placeholder="Teléfono" onChange={handleChange} icon={<FaPhone />}/>
          <Input name="direccion" placeholder="Dirección" onChange={handleChange} icon={<FaMapMarkerAlt  er/>}/>
          <Input name="provincia" placeholder="Provincia" onChange={handleChange} icon={<FaMapMarkerAlt />}/>

          </div>

          <Button type="submit">Registrar</Button>

          <p className="text-sm text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-bold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
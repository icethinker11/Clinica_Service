import { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";
import { registerUsuario } from "../services/authService"; // 👈 Servicio de API

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    nombres: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // 👇 Payload alineado con backend (usa "password")
      const payload = {
        dni: form.dni,
        nombre: form.nombres,
        apellido_paterno: form.apellidoPaterno,
        apellido_materno: form.apellidoMaterno,
        fecha_nacimiento: form.fechadenacimiento, // formato YYYY-MM-DD
        correo: form.email,
        direccion: form.direccion,
        provincia: form.provincia,
        telefono: form.telefono,
        password: form.password, // 👈 corregido
      };

      console.log("Payload enviado:", payload);

      const res = await registerUsuario(payload);
      alert(res.data.msg);
    } catch (err) {
      console.error(err);
      alert("Error al registrar usuario");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/fondoprueba.jpg')] bg-cover bg-center">
      <div className=" bg-white bg-opacity-80 rounded-4xl shadow-lg p-8">
        <form
          onSubmit={handleRegister}
          className="w-140 flex flex-col gap-3 text-[#4F7B8E]"
        >
          <h2 className="text-2xl font-bold text-center">REGISTRARSE</h2>
          <p className="text-sm text-center">Rellena los campos con tus datos.</p>

          <div className="grid grid-cols-2 gap-3">
            <Input name="email" value={form.email} placeholder="Correo" onChange={handleChange} icon={<FaEnvelope />} />
            <Input type="password" name="password" value={form.password} placeholder="Contraseña" onChange={handleChange} icon={<FaLock />} />
            <Input type="password" name="confirm" value={form.confirm} placeholder="Confirmar contraseña" onChange={handleChange} icon={<FaLock />} />
            <Input name="nombres" value={form.nombres} placeholder="Nombres" onChange={handleChange} icon={<FaUserTag />} />
            <Input name="apellidoPaterno" value={form.apellidoPaterno} placeholder="Apellido paterno" onChange={handleChange} icon={<FaUserTag />} />
            <Input name="apellidoMaterno" value={form.apellidoMaterno} placeholder="Apellido materno" onChange={handleChange} icon={<FaUserTag />} />
            <Input name="dni" value={form.dni} placeholder="DNI" onChange={handleChange} icon={<FaIdCard />} />
            <Input type="date" name="fechadenacimiento" value={form.fechadenacimiento} onChange={handleChange} />
            <Input name="telefono" value={form.telefono} placeholder="Teléfono" onChange={handleChange} icon={<FaPhone />} />
            <Input name="direccion" value={form.direccion} placeholder="Dirección" onChange={handleChange} icon={<FaMapMarkerAlt />} />
            <Input name="provincia" value={form.provincia} placeholder="Provincia" onChange={handleChange} icon={<FaMapMarkerAlt />} />
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

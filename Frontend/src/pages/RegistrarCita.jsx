import { useState, useEffect } from "react";
import Input from "../components/input";
import Button from "../components/button";

export default function RegistrarCita() {
  const [formData, setFormData] = useState({
    id_paciente: "",
    id_doctor: "",
    id_secretaria: "",
    fecha_cita: "",
    motivo: "",
    observaciones: "",
  });

  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/usuarios?rol=Paciente")
      .then(res => res.json())
      .then(setPacientes);

    fetch("http://localhost:5000/api/usuarios?rol=Doctor")
      .then(res => res.json())
      .then(setDoctores);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.mensaje);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Registrar Cita</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="id_paciente" value={formData.id_paciente} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Seleccione Paciente</option>
          {pacientes.map(p => (
            <option key={p.id_usuario} value={p.id_usuario}>{p.nombre}</option>
          ))}
        </select>

        <select name="id_doctor" value={formData.id_doctor} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Seleccione Doctor</option>
          {doctores.map(d => (
            <option key={d.id_usuario} value={d.id_usuario}>{d.nombre}</option>
          ))}
        </select>

        <Input type="datetime-local" name="fecha_cita" value={formData.fecha_cita} onChange={handleChange} label="Fecha y hora" />
        <Input type="text" name="motivo" value={formData.motivo} onChange={handleChange} label="Motivo de la cita" />
        <Input type="text" name="observaciones" value={formData.observaciones} onChange={handleChange} label="Observaciones" />

        <Button type="submit" text="Registrar Cita" />
      </form>
    </div>
  );
}

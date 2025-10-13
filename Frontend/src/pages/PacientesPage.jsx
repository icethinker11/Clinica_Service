import { useState, useEffect } from "react";
import Button from "../components/button";

export default function ModalEditarPaciente({ paciente, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id_usuario: "",
    nombre: "",
    dni: "",
    correo: "",
    telefono: "",
  });

  useEffect(() => {
    if (paciente) {
      setFormData(paciente);
    }
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Editar Paciente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">DNI:</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Correo:</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-1"
            />
          </div>

          <div className="flex justify-between mt-5">
            <Button type="submit" color="green">
              Guardar
            </Button>
            <Button type="button" color="red" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

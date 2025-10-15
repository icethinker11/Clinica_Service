import { useState, useEffect } from "react";
import DataTable from "../components/table";
import Input from "../components/input";
import Button from "../components/button";
import ConfirmPopup from "../components/confirmpopup";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Opciones() {
  const [opciones, setOpciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formOpcion, setFormOpcion] = useState({ nombre: "", url_menu: "", descripcion: "", estado_registro: "ACTIVO" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState({ show: false, action: null, params: null, message: "" });

  // =========================
  // 🔹 Cargar opciones
  // =========================
  useEffect(() => {
    fetchOpciones();
  }, []);

  const fetchOpciones = async () => {
    try {
      const res = await fetch(`${API_URL}/opciones`);
      const data = await res.json();
      setOpciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando opciones:", err);
    }
  };

  // =========================
  // 🔹 CRUD Opciones
  // =========================
  const handleAddOpcionClick = () => {
    setFormOpcion({ nombre: "", url_menu: "", descripcion: "", estado_registro: "ACTIVO" });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleInputOpcionChange = (e) => setFormOpcion({ ...formOpcion, [e.target.name]: e.target.value });

  const handleSaveOpcion = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_URL}/opciones/${editingId}` : `${API_URL}/opciones`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formOpcion),
      });

      if (!res.ok) throw new Error("Error al guardar opción");

      await fetchOpciones();
      handleCancel();
    } catch (err) {
      console.error("Error guardando opción:", err);
    }
  };

  const handleEditOpcion = (id) => {
    const o = opciones.find(o => o.id_opcion_menu === id);
    setFormOpcion(o);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteOpcion = async (id) => {
    try {
      await fetch(`${API_URL}/opciones/${id}`, { method: "DELETE" });
      await fetchOpciones();
      handleCancelConfirm();
    } catch (err) {
      console.error("Error eliminando opción:", err);
    }
  };

  const requestConfirmation = (message, action, params = null) => {
    setConfirmPopup({ show: true, message, action, params });
  };

  const handleConfirm = async () => {
    if (confirmPopup.action) {
      await confirmPopup.action(confirmPopup.params);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmPopup({ show: false, action: null, params: null, message: "" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  // =========================
  // 🔹 Columnas y acciones
  // =========================
  const opcionColumns = [
    { label: "Nombre", field: "nombre" },
    { label: "URL", field: "url_menu" },
    { label: "Descripción", field: "descripcion" },
    { label: "Estado", field: "estado_registro" },
  ];

  const opcionActions = [
    { icon: <FaEdit className="text-blue-500 cursor-pointer" />, onClick: (row) => handleEditOpcion(row.id_opcion_menu) },
    { icon: <FaTrash className="text-red-500 cursor-pointer" />, onClick: (row) => requestConfirmation("¿Seguro que deseas eliminar esta opción?", handleDeleteOpcion, row.id_opcion_menu) },
  ];

  // =========================
  // 🔹 Render
  // =========================
  return (
    <div>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Opciones</h2>
        <Button onClick={handleAddOpcionClick} icon={<FaPlus />}>Agregar Opción</Button>
      </div>

      {/* Tabla */}
      <DataTable title="Opciones" data={opciones} columns={opcionColumns} actions={opcionActions} />

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 overflow-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto border border-gray-100 my-10">
            <div className="px-6 py-4 border-b text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {isEditing ? "Editar" : "Registrar"} Opción
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <Input
                label="Nombre de la Opción"
                name="nombre"
                value={formOpcion.nombre}
                onChange={handleInputOpcionChange}
                placeholder="Ej. Reportes, Citas, Doctores"
              />

              <Input
                label="URL del Menú"
                name="url_menu"
                value={formOpcion.url_menu}
                onChange={handleInputOpcionChange}
                placeholder="/reportes"
              />

              <Input
                label="Descripción"
                name="descripcion"
                value={formOpcion.descripcion}
                onChange={handleInputOpcionChange}
                placeholder="Descripción breve de la opción"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado_registro"
                  value={formOpcion.estado_registro}
                  onChange={handleInputOpcionChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 border-gray-300"
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500">
                  Cancelar
                </Button>
                <Button onClick={handleSaveOpcion}>
                  {isEditing ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Popup */}
      {confirmPopup.show && (
        <ConfirmPopup
          message={confirmPopup.message}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      )}
    </div>
  );
}


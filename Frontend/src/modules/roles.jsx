import { useState, useEffect } from "react";
import DataTable from "../components/table";
import Input from "../components/input";
import Button from "../components/button";
import ConfirmPopup from "../components/confirmpopup";
import StatusPopup from "../components/statuspopup";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formRole, setFormRole] = useState({ nombre_perfil: "", descripcion: "", estado_registro: "ACTIVO" });
  const [errorsRole, setErrorsRole] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });
  const [confirmPopup, setConfirmPopup] = useState({ show: false, action: null, message: "", params: null });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/roles`);
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando roles:", err);
    }
  };

  // =========================
  // Formulario y Validación
  // =========================
  const handleAddRoleClick = () => {
    setFormRole({ nombre_perfil: "", descripcion: "", estado_registro: "ACTIVO" });
    setIsEditing(false);
    setShowForm(true);
    setErrorsRole({});
  };

  const handleInputRoleChange = (e) => setFormRole({ ...formRole, [e.target.name]: e.target.value });

  const validateRoleForm = () => {
    const newErrors = {};
    if (!formRole.nombre_perfil.trim()) newErrors.nombre_perfil = "El nombre del perfil es obligatorio.";
    if (!formRole.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    setErrorsRole(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRole = async () => {
    if (!validateRoleForm()) return;

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_URL}/roles/${editingId}` : `${API_URL}/roles`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formRole),
      });

      if (!res.ok) throw new Error("Error al guardar rol");

      await fetchRoles();
      handleCancel();
      showPopup("success", isEditing ? "Rol actualizado ✅" : "Rol registrado ✅");
    } catch (err) {
      console.error("Error guardando rol:", err);
      showPopup("error", `Ocurrió un error: ${err.message}`);
    }
  };

  const handleEditRole = (id) => {
    const r = roles.find(r => r.id_rol === id);
    setFormRole(r);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
    setErrorsRole({});
  };

  const requestConfirmation = (message, action, params = null) => {
    setConfirmPopup({ show: true, message, action, params });
  };

  const handleConfirmAction = async () => {
    if (confirmPopup.action) {
      await confirmPopup.action(confirmPopup.params);
    }
    setConfirmPopup({ show: false, message: "", action: null, params: null });
  };

  const handleCancelAction = () => {
    setConfirmPopup({ show: false, message: "", action: null, params: null });
  };

  const handleDeleteRole = async (id) => {
    try {
      await fetch(`${API_URL}/roles/${id}`, { method: "DELETE" });
      await fetchRoles();
      showPopup("warning", "Rol eliminado ⚠️");
    } catch (err) {
      console.error("Error eliminando rol:", err);
      showPopup("error", `Error eliminando rol: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setErrorsRole({});
  };

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 3000);
  };

  // =========================
  // Columnas y acciones
  // =========================
  const roleColumns = [
    { label: "Nombre del perfil", field: "nombre_perfil" },
    { label: "Descripción", field: "descripcion" },
    { label: "Estado", field: "estado_registro" },
  ];

  const roleActions = [
    { icon: <FaEdit className="text-blue-500 cursor-pointer" />, onClick: (row) => handleEditRole(row.id_rol) },
    {
      icon: <FaTrash className="text-red-500 cursor-pointer" />,
      onClick: (row) => requestConfirmation("¿Desea eliminar este rol?", handleDeleteRole, row.id_rol),
    },
  ];

  // =========================
  // Render
  // =========================
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Roles</h2>
        <Button onClick={handleAddRoleClick} icon={<FaPlus />}>Agregar Rol</Button>
      </div>

      <DataTable title="Roles" data={roles} columns={roleColumns} actions={roleActions} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 overflow-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto border border-gray-100 my-10">
            <div className="px-6 py-4 border-b text-center">
              <h2 className="text-2xl font-semibold text-gray-800">{isEditing ? "Editar" : "Registrar"} Rol</h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveRole(); }} className="p-6 space-y-6">
              {Object.keys(errorsRole).length > 0 && (
                <div className="bg-red-50 border border-red-400 text-red-600 rounded-lg p-3 text-sm">
                  Por favor corrige los campos antes de continuar.
                </div>
              )}

              <section>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Perfil *</label>
                <input
                  type="text"
                  name="nombre_perfil"
                  value={formRole.nombre_perfil}
                  onChange={handleInputRoleChange}
                  placeholder="Ejemplo: Recepcionista, Doctor..."
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errorsRole.nombre_perfil ? "border-red-500" : "border-gray-300"}`}
                />
              </section>

              <section>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formRole.descripcion}
                  onChange={handleInputRoleChange}
                  placeholder="Descripción del rol"
                  rows="3"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errorsRole.descripcion ? "border-red-500" : "border-gray-300"}`}
                />
              </section>

              <section>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado_registro"
                  value={formRole.estado_registro}
                  onChange={handleInputRoleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 border-gray-300"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </section>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">{isEditing ? "Actualizar Rol" : "Registrar Rol"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {popup.show && <StatusPopup type={popup.type} message={popup.message} />}
      {confirmPopup.show && (
        <ConfirmPopup
          message={confirmPopup.message}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}
    </div>
  );
}

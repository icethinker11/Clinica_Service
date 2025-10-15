import { useState, useEffect } from "react";
import DataTable from "../components/table";
import Input from "../components/input";
import Button from "../components/button";
import StatusPopup from "../components/statuspopup";
import ConfirmPopup from "../components/confirmpopup";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUser,
  FaLock,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ACTIVO");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [formUser, setFormUser] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    dni: "",
    fecha_nacimiento: "",
    correo: "",
    password: "",
    telefono: "",
    direccion: "",
    provincia: "",
    id_rol: "",
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    action: null,
    message: "",
    params: null,
  });

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      const data = await res.json();
      const formattedData = data.map(u => ({
        ...u,
        fecha_nacimiento: u.fecha_nacimiento || "",
      }));
      setUsers(Array.isArray(formattedData) ? formattedData : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/roles`);
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando roles:", err);
    }
  };

  const filteredUsers = users.filter(u => u.estado_registro === filterStatus);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormUser({ ...formUser, [name]: value });
    let error = "";
    if (name === "dni" && !/^[0-9]{8}$/.test(value)) error = "DNI debe tener 8 dígitos.";
    if (name === "correo" && !/\S+@\S+\.\S+/.test(value)) error = "Correo inválido.";
    if (name === "password" && value.length > 0 && value.length < 8)
      error = "Contraseña mínimo 8 caracteres.";
    if (name === "fecha_nacimiento" && !value) error = "Debe ingresar una fecha de nacimiento.";
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[0-9]{8}$/.test(formUser.dni)) newErrors.dni = "DNI debe tener 8 dígitos.";
    if (!formUser.correo.includes("@")) newErrors.correo = "Correo inválido.";
    if (!formUser.fecha_nacimiento) newErrors.fecha_nacimiento = "Debe ingresar una fecha de nacimiento.";
    if (!formUser.id_rol) newErrors.id_rol = "Debe seleccionar un rol.";
    if (!isEditing && (!formUser.password || formUser.password.length < 8))
      newErrors.password = "Contraseña mínimo 8 caracteres.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUserClick = () => {
    setFormUser({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      dni: "",
      fecha_nacimiento: "",
      correo: "",
      password: "",
      telefono: "",
      direccion: "",
      provincia: "",
      id_rol: "",
    });
    setIsEditing(false);
    setShowForm(true);
    setErrors({});
  };

  const handleEditUser = (id) => {
    const u = users.find(u => u.id_usuario === id);
    setFormUser({
      nombre: u.nombre || "",
      apellido_paterno: u.apellido_paterno || "",
      apellido_materno: u.apellido_materno || "",
      dni: u.dni || "",
      fecha_nacimiento: u.fecha_nacimiento || "",
      correo: u.correo || "",
      password: "",
      telefono: u.telefono || "",
      direccion: u.direccion || "",
      provincia: u.provincia || "",
      id_rol: u.id_rol || "",
    });
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
    setErrors({});
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setErrors({});
  };

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 3000);
  };

  // ===== Confirm Actions =====
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

  // ===== User actions =====
  const handleDeleteUser = async (id) => {
    await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
    await fetchUsuarios();
    showPopup("warning", "Usuario desactivado correctamente ");
  };

  const handleActivateUser = async (id) => {
    await fetch(`${API_URL}/usuarios/${id}/activar`, { method: "PUT" });
    await fetchUsuarios();
    showPopup("success", "Usuario reactivado correctamente ");
  };

  const handlePermanentDeleteUser = async (id) => {
    await fetch(`${API_URL}/usuarios/${id}/delete`, { method: "DELETE" });
    await fetchUsuarios();
    showPopup("error", "Usuario eliminado permanentemente 🗑️");
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${API_URL}/usuarios/${editingId}`
        : `${API_URL}/usuarios/register`;

      const payload = { ...formUser };
      if (isEditing && payload.password === "") delete payload.password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error guardando usuario");
      }

      await fetchUsuarios();
      handleCancel();
      showPopup("success", isEditing ? "Usuario actualizado con éxito" : "Usuario registrado con éxito");
    } catch (err) {
      console.error(err);
      showPopup("error", `Ocurrió un error: ${err.message}`);
    }
  };

  const userColumns = [
    { label: "Nombre", field: "nombre" },
    { label: "Apellido Paterno", field: "apellido_paterno" },
    { label: "Correo", field: "correo" },
    { label: "Rol", field: "rol" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Usuarios</h2>
        <Button onClick={handleAddUserClick} icon={<FaUserPlus />}>
          Agregar Usuario
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilterStatus("ACTIVO")}
          className={`px-4 py-2 rounded-lg ${filterStatus === "ACTIVO" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Activos
        </button>
        <button
          onClick={() => setFilterStatus("INACTIVO")}
          className={`px-4 py-2 rounded-lg ${filterStatus === "INACTIVO" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        >
          Inactivos
        </button>
      </div>

      <DataTable
        title={`Usuarios ${filterStatus}`}
        data={filteredUsers}
        columns={userColumns}
        actions={[
          {
            icon: filterStatus === "ACTIVO" ? (
              <FaTrash className="text-red-500 cursor-pointer" />
            ) : (
              <FaUserPlus className="text-green-500 cursor-pointer" />
            ),
            onClick: (row) =>
              filterStatus === "ACTIVO"
                ? requestConfirmation("¿Desea desactivar este usuario?", handleDeleteUser, row.id_usuario)
                : requestConfirmation("¿Desea reactivar este usuario?", handleActivateUser, row.id_usuario),
          },
          ...(filterStatus === "ACTIVO"
            ? [
                {
                  icon: <FaEdit className="text-blue-500 cursor-pointer" />,
                  onClick: (row) => handleEditUser(row.id_usuario),
                },
              ]
            : [
                {
                  icon: <FaTrash className="text-gray-700 cursor-pointer" />,
                  onClick: (row) =>
                    requestConfirmation("Eliminar usuario permanentemente?", handlePermanentDeleteUser, row.id_usuario),
                },
              ]),
        ]}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6">
            <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Editar Usuario" : "Registrar Usuario"}</h2>
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-400 text-red-600 rounded-lg p-3 text-sm mb-3">
                Corrige los campos antes de continuar.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input label="Nombre" name="nombre" value={formUser.nombre} onChange={handleInputChange} placeholder="Ingrese el nombre" icon={<FaUser className="text-gray-400" />} />
              <Input label="Apellido Paterno" name="apellido_paterno" value={formUser.apellido_paterno} onChange={handleInputChange} placeholder="Ingrese apellido paterno" icon={<FaUser className="text-gray-400" />} />
              <Input label="Apellido Materno" name="apellido_materno" value={formUser.apellido_materno} onChange={handleInputChange} placeholder="Ingrese apellido materno" icon={<FaUser className="text-gray-400" />} />
              <Input label="DNI" name="dni" value={formUser.dni} onChange={handleInputChange} placeholder="Ej: 12345678" icon={<FaIdCard className="text-gray-400" />} error={errors.dni} />
              <Input label="Fecha de Nacimiento" type="date" name="fecha_nacimiento" value={formUser.fecha_nacimiento} onChange={handleInputChange} icon={<FaCalendarAlt className="text-gray-400" />} error={errors.fecha_nacimiento} />
              <Input label="Correo" name="correo" value={formUser.correo} onChange={handleInputChange} placeholder="correo@ejemplo.com" icon={<FaEnvelope className="text-gray-400" />} error={errors.correo} />
              <Input label="Contraseña" type="password" name="password" value={formUser.password} onChange={handleInputChange} placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Mínimo 8 caracteres"} icon={<FaLock className="text-gray-400" />} error={errors.password} />
              <Input label="Teléfono" name="telefono" value={formUser.telefono} onChange={handleInputChange} placeholder="Ej: 987654321" icon={<FaPhone className="text-gray-400" />} />
              <Input label="Dirección" name="direccion" value={formUser.direccion} onChange={handleInputChange} placeholder="Ingrese dirección" icon={<FaHome className="text-gray-400" />} />
              <Input label="Provincia" name="provincia" value={formUser.provincia} onChange={handleInputChange} placeholder="Ingrese provincia" icon={<FaMapMarkerAlt className="text-gray-400" />} />

              <div className="relative w-full">
                <select name="id_rol" value={formUser.id_rol || ""} onChange={(e) => setFormUser({ ...formUser, id_rol: parseInt(e.target.value) })} className="w-full border rounded-lg px-10 py-2">
                  <option value="">Seleccione un rol</option>
                  {roles.map((r) => (
                    <option key={r.id_rol} value={r.id_rol}>{r.nombre_perfil}</option>
                  ))}
                </select>
                <FaUserShield className="absolute left-3 top-2.5 text-gray-400" />
                {errors.id_rol && <p className="text-red-500 text-sm mt-1">{errors.id_rol}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500">Cancelar</Button>
              <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">{isEditing ? "Actualizar" : "Registrar"}</Button>
            </div>
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

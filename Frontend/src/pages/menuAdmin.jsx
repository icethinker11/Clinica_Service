import { useState, useEffect } from "react";
import PanelPrincipal from "./PanelPrincipal";
import SidebarItem from "../components/sidebaritem";
import DataTable from "../components/table";
import Input from "../components/input";
import Button from "../components/button";
import { logoutUsuario, getUsuarioActual } from "../services/authService";
import {
  FaHome, FaUserPlus, FaUserTag, FaFileAlt,
  FaSignOutAlt, FaEdit, FaTrash, FaPlus
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Menu() {
  const usuario = getUsuarioActual();
  const username = usuario?.nombre || "Usuario";

  const [activePage, setActivePage] = useState("inicio");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ACTIVO");

  const [roles, setRoles] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [errorsRole, setErrorsRole] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Formularios
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
  id_rol: "", // 👈 importante
});


  const [formRole, setFormRole] = useState({
    nombre_perfil: "",
    descripcion: "",
    estado_registro: "ACTIVO",
  });

  const [formOpcion, setFormOpcion] = useState({
    nombre: "",
    url_menu: "",
    descripcion: "",
    estado_registro: "ACTIVO",
  });

  // =========================
  // 🔹 Cargar datos
  // =========================
  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
    fetchOpciones();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  // Filtrar usuarios activos o inactivos según el filtro seleccionado
const filteredUsers = users.filter(
  (u) => u.estado_registro === filterStatus
);


  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/roles`);
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando roles:", err);
    }
  };

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
  // 🔹 CRUD Usuarios
  // =========================
  const handleAddUserClick = () => {
    setFormType("usuario");
    setFormUser({
      nombre: "", apellido_paterno: "", apellido_materno: "", dni: "",
      fecha_nacimiento: "", correo: "", password: "", telefono: "",
      direccion: "", provincia: ""
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!/^[0-9]{8}$/.test(formUser.dni)) newErrors.dni = "El DNI debe tener exactamente 8 dígitos.";
    if (!formUser.correo.includes("@")) newErrors.correo = "Correo inválido. Falta el '@'.";
    if (!formUser.password || formUser.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    if (!formUser.id_rol) newErrors.id_rol = "Debe seleccionar un rol.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormUser({ ...formUser, [name]: value });

  // 🔍 Validación en tiempo real
  let error = "";

  if (name === "dni" && !/^[0-9]{8}$/.test(value))
    error = "El DNI debe tener exactamente 8 dígitos.";
  if (name === "correo" && !/\S+@\S+\.\S+/.test(value))
    error = "Correo electrónico inválido.";
  if (name === "password" && value.length > 0 && value.length < 8)
    error = "La contraseña debe tener al menos 8 caracteres.";

  setErrors({ ...errors, [name]: error });
};


  const handleSaveUser = async () => {
  if (!validateForm()) return; // 🔒 Evita guardar si hay errores

  try {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${API_URL}/usuarios/${editingId}`
      : `${API_URL}/usuarios/register`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formUser),
    });

    if (!res.ok) throw new Error("Error al guardar usuario");

    await fetchUsuarios();
    handleCancel();
  } catch (err) {
    console.error("❌ Error guardando usuario:", err);
  }
};

const handleActivateUser = async (id) => {
  if (!window.confirm("¿Deseas reactivar este usuario?")) return;

  try {
    const res = await fetch(`${API_URL}/usuarios/${id}/activar`, { method: "PUT" });

    if (!res.ok) throw new Error("Error al activar usuario");

    await fetchUsuarios(); // refresca la tabla
  } catch (err) {
    console.error("❌ Error activando usuario:", err);
    alert("Ocurrió un error al activar el usuario.");
  }
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
    password: "", // se deja vacío para no sobrescribir
    telefono: u.telefono || "",
    direccion: u.direccion || "",
    provincia: u.provincia || "",
    id_rol: u.id_rol || "", // 🔥 importante
  });
  
  setFormType("usuario");
  setIsEditing(true);
  setEditingId(id);
  setShowForm(true);
};


const handleDeleteUser = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

  try {
    const res = await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Error al eliminar usuario");

    await fetchUsuarios();
  } catch (err) {
    console.error("❌ Error eliminando usuario:", err);
    alert("Ocurrió un error al eliminar el usuario.");
  }
};


  // =========================
  // 🔹 CRUD Roles
  // =========================
  const handleAddRoleClick = () => {
    setFormType("rol");
    setFormRole({ nombre_perfil: "", descripcion: "", estado_registro: "ACTIVO" });
    setIsEditing(false);
    setShowForm(true);
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
    } catch (err) {
      console.error("Error guardando rol:", err);
    }
  };


  const handleEditRole = (id) => {
    const r = roles.find(r => r.id_rol === id);
    setFormType("rol");
    setFormRole(r);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este rol?")) {
      await fetch(`${API_URL}/roles/${id}`, { method: "DELETE" });
      fetchRoles();
    }
  };

  // =========================
  // 🔹 CRUD Opciones
  // =========================
  const handleAddOpcionClick = () => {
    setFormType("opcion");
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
    setFormType("opcion");
    setFormOpcion(o);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteOpcion = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta opción?")) {
      await fetch(`${API_URL}/opciones/${id}`, { method: "DELETE" });
      fetchOpciones();
    }
  };

  const handlePermanentDeleteUser = async (id) => {
  if (!window.confirm("⚠️ ¿Seguro que deseas eliminar este usuario permanentemente?")) return;

  try {
    const res = await fetch(`${API_URL}/usuarios/${id}/delete`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar definitivamente");

    await fetchUsuarios(); // 🔄 refresca la tabla
    alert("🧹 Usuario eliminado permanentemente.");
  } catch (err) {
    console.error("❌ Error eliminando definitivamente:", err);
    alert("Ocurrió un error al eliminar el usuario permanentemente.");
  }
};


  // =========================
  // 🔹 Columnas Tablas
  // =========================
    const userColumns = [
    { label: "Nombre", field: "nombre" },
    { label: "Apellido Paterno", field: "apellido_paterno" },
    { label: "Correo", field: "correo" },
    { label: "Rol", field: "rol" }, // 👈 Nueva columna
  ];

  const roleColumns = [
    { label: "Nombre del perfil", field: "nombre_perfil" },
    { label: "Descripción", field: "descripcion" },
    { label: "Estado", field: "estado_registro" },
  ];

  const opcionColumns = [
    { label: "Nombre", field: "nombre" },
    { label: "URL", field: "url_menu" },
    { label: "Descripción", field: "descripcion" },
    { label: "Estado", field: "estado_registro" },
  ];

  const userActions = [
    { icon: <FaEdit className="text-blue-500 cursor-pointer" />, onClick: (row) => handleEditUser(row.id_usuario) },
    { icon: <FaTrash className="text-red-500 cursor-pointer" />, onClick: (row) => handleDeleteUser(row.id_usuario) },
  ];

  const roleActions = [
    { icon: <FaEdit className="text-blue-500 cursor-pointer" />, onClick: (row) => handleEditRole(row.id_rol) },
    { icon: <FaTrash className="text-red-500 cursor-pointer" />, onClick: (row) => handleDeleteRole(row.id_rol) },
  ];

  const opcionActions = [
    { icon: <FaEdit className="text-blue-500 cursor-pointer" />, onClick: (row) => handleEditOpcion(row.id_opcion_menu) },
    { icon: <FaTrash className="text-red-500 cursor-pointer" />, onClick: (row) => handleDeleteOpcion(row.id_opcion_menu) },
  ];

  // =========================
  // 🔹 Sidebar Dinámico
  // =========================
  const basePages = ["usuarios", "roles", "opciones"];

  const sidebarItems = [
    { icon: FaHome, label: "Inicio", page: "inicio" },
    { icon: FaUserPlus, label: "Usuarios", page: "usuarios" },
    { icon: FaUserTag, label: "Roles", page: "roles" },
    { icon: FaFileAlt, label: "Opciones", page: "opciones" },
    ...opciones
      .filter(op => op.url_menu && !basePages.includes(op.url_menu.replace("/", "")))
      .map(op => ({
        icon: FaFileAlt,
        label: op.nombre,
        page: op.url_menu.replace("/", ""),
      })),
  ];

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleLogout = () => logoutUsuario();

  // =========================
  // 🖥️ Renderizado
  // =========================
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#81ADFF] text-gray-800 flex flex-col py-8 px-4">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.jpg" alt="Logo" className="w-16 h-16 mb-2 rounded-2xl" />
          <span className="font-extrabold underline text-lg">ODONTDENT</span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label || item.page}   // 👈 Usamos una propiedad única y estable
              icon={item.icon}
              label={item.label}
              onClick={() => setActivePage(item.page)}
              hoverColor="#5c7bb4"
            />
          ))}

          </ul>
        </nav>

        <div className="mt-8 w-full bg-[#466eb8] text-white rounded">
          <SidebarItem icon={FaSignOutAlt} label="Cerrar sesión" onClick={handleLogout} hoverColor="#ee4e4e" />
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 bg-gray-100 p-6">
        {activePage === "inicio" && (
          <PanelPrincipal username={username} users={users} roles={roles} opciones={opciones} setActivePage={setActivePage} />
        )}

        {activePage === "usuarios" && (
          <div>
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Usuarios</h2>
              <Button onClick={handleAddUserClick} icon={<FaPlus />}>Agregar Usuario</Button>
            </div>

            {/* Filtro de estado */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilterStatus("ACTIVO")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "ACTIVO"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFilterStatus("INACTIVO")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "INACTIVO"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Inactivos
              </button>
            </div>

            {/* Tabla filtrada */}
            <DataTable
              title={`Usuarios ${filterStatus === "ACTIVO" ? "Activos" : "Inactivos"}`}
              data={filteredUsers}
              columns={userColumns}
              actions={[
                // 🗑️ Desactivar o Reactivar
                {
                  icon:
                    filterStatus === "ACTIVO" ? (
                      <FaTrash className="text-red-500 cursor-pointer" title="Desactivar usuario" />
                    ) : (
                      <FaUserPlus className="text-green-500 cursor-pointer" title="Reactivar usuario" />
                    ),
                  onClick: (row) =>
                    filterStatus === "ACTIVO"
                      ? handleDeleteUser(row.id_usuario)
                      : handleActivateUser(row.id_usuario),
                },

                // ✏️ Editar (solo si activo)
                ...(filterStatus === "ACTIVO"
                  ? [
                      {
                        icon: <FaEdit className="text-blue-500 cursor-pointer" title="Editar usuario" />,
                        onClick: (row) => handleEditUser(row.id_usuario),
                      },
                    ]
                  : []),

                // ❌ Eliminar permanente (solo si está INACTIVO)
                ...(filterStatus === "INACTIVO"
                  ? [
                      {
                        icon: <FaTrash className="text-gray-700 cursor-pointer" title="Eliminar definitivamente" />,
                        onClick: (row) => handlePermanentDeleteUser(row.id_usuario),
                      },
                    ]
                  : []),
              ]}
            />

          </div>
        )}


        {activePage === "roles" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Roles</h2>
              <Button onClick={handleAddRoleClick} icon={<FaPlus />}>Agregar Rol</Button>
            </div>
            <DataTable title="Roles" data={roles} columns={roleColumns} actions={roleActions} />
          </div>
        )}

        {activePage === "opciones" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Opciones</h2>
              <Button onClick={handleAddOpcionClick} icon={<FaPlus />}>Agregar Opción</Button>
            </div>
            <DataTable title="Opciones" data={opciones} columns={opcionColumns} actions={opcionActions} />
          </div>
        )}
      </main>

      {/* MODAL GENERAL */}
{showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 overflow-auto p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto border border-gray-100 my-10">
      
      {/* ENCABEZADO */}
      <div className="px-6 py-4 border-b text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isEditing ? "Editar" : "Registrar"}{" "}
          {formType === "usuario" ? "Usuario" : formType === "rol" ? "Rol" : "Opción"}
        </h2>
      </div>

      {/* FORMULARIO USUARIO */}
      {formType === "usuario" && (
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 👈 Evita recargar la página
            handleSaveUser();
          }}
          className="p-6 space-y-6"
        >
          {/* ESTADO PARA ERRORES */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-400 text-red-600 rounded-lg p-3 text-sm">
              Por favor corrige los campos marcados en rojo antes de continuar.
            </div>
          )}

          {/* DATOS DE CUENTA */}
          <section>
            <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">Datos de Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  value={formUser.correo}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.correo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  value={formUser.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
          </section>

          {/* INFORMACIÓN PERSONAL */}
          <section>
            <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI *</label>
                <input
                  name="dni"
                  value={formUser.dni}
                  onChange={handleInputChange}
                  placeholder="8 dígitos"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.dni ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
              </div>

              <input name="nombre" value={formUser.nombre} onChange={handleInputChange} placeholder="Nombre" className="input-field" />
              <input name="apellido_paterno" value={formUser.apellido_paterno} onChange={handleInputChange} placeholder="Apellido Paterno" className="input-field" />
              <input name="apellido_materno" value={formUser.apellido_materno} onChange={handleInputChange} placeholder="Apellido Materno" className="input-field" />
              <input type="date" name="fecha_nacimiento" value={formUser.fecha_nacimiento} onChange={handleInputChange} className="input-field" />
              <input name="telefono" value={formUser.telefono} onChange={handleInputChange} placeholder="Teléfono" className="input-field" />
            </div>
          </section>

          {/* CONTACTO */}
          <section>
            <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input name="provincia" value={formUser.provincia} onChange={handleInputChange} placeholder="Provincia" className="input-field" />
              <input name="direccion" value={formUser.direccion} onChange={handleInputChange} placeholder="Dirección" className="input-field" />
            </div>
          </section>

          {/* ROL */}
          <section>
            <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">Asignación de Rol</h3>
            <select
              name="id_rol"
              value={formUser.id_rol || ""}
              onChange={(e) => setFormUser({ ...formUser, id_rol: parseInt(e.target.value) })}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errors.id_rol ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione un rol</option>
              {roles.map((r) => (
                <option key={r.id_rol} value={r.id_rol}>
                  {r.nombre_perfil}
                </option>
              ))}
            </select>
            {errors.id_rol && <p className="text-red-500 text-xs mt-1">{errors.id_rol}</p>}
          </section>

          {/* BOTONES */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Registrar Cuenta
            </button>
          </div>
        </form>
      )}

      {/* FORMULARIO ROL */}
      {formType === "rol" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveRole();
          }}
          className="p-6 space-y-6"
        >
          {/* Encabezado */}
          {Object.keys(errorsRole).length > 0 && (
            <div className="bg-red-50 border border-red-400 text-red-600 rounded-lg p-3 text-sm">
              Por favor corrige los campos antes de continuar.
            </div>
          )}

          {/* Información del Rol */}
          <section>
            <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">
              Información del Rol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Perfil *
                </label>
                <input
                  type="text"
                  name="nombre_perfil"
                  value={formRole.nombre_perfil}
                  onChange={handleInputRoleChange}
                  placeholder="Ejemplo: Recepcionista, Doctor..."
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errorsRole.nombre_perfil ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errorsRole.nombre_perfil && (
                  <p className="text-red-500 text-xs mt-1">{errorsRole.nombre_perfil}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado_registro"
                  value={formRole.estado_registro}
                  onChange={handleInputRoleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 border-gray-300"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>
            </div>
          </section>

          {/* Descripción */}
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formRole.descripcion}
              onChange={handleInputRoleChange}
              placeholder="Ejemplo: Rol encargado de atención al cliente."
              rows="3"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                errorsRole.descripcion ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errorsRole.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errorsRole.descripcion}</p>
            )}
          </section>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isEditing ? "Actualizar Rol" : "Registrar Rol"}
            </button>
          </div>
        </form>
      )}

      {/* FORMULARIO OPCIÓN */}
      {formType === "opcion" && (
  <div className="p-6 space-y-4">
    <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">Datos de la Opción</h3>

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
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
)}
    </div>
  </div>
)}

    </div>
  );
}












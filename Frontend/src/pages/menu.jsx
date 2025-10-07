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
  const [roles, setRoles] = useState([]);
  const [opciones, setOpciones] = useState([]);

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

  const handleInputChange = (e) => setFormUser({ ...formUser, [e.target.name]: e.target.value });

  const handleSaveUser = async () => {
  try {
    console.log("Datos enviados:", formUser); // 👈 Verifica que incluya id_rol

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
    console.error("Error guardando usuario:", err);
  }
};


  const handleEditUser = (id) => {
    const u = users.find(u => u.id_usuario === id);
    setFormType("usuario");
    setFormUser(u);
    setIsEditing(true);
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
      fetchUsuarios();
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

  const handleSaveRole = async () => {
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Usuarios</h2>
              <Button onClick={handleAddUserClick} icon={<FaPlus />}>Agregar Usuario</Button>
            </div>
            <DataTable title="Usuarios" data={users} columns={userColumns} actions={userActions} />
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Editar" : "Registrar"}{" "}
              {formType === "usuario" ? "Usuario" : formType === "rol" ? "Rol" : "Opción"}
            </h2>

            {formType === "usuario" && (
              <>
                <Input
                  label="Nombre"
                  name="nombre"
                  value={formUser.nombre}
                  onChange={handleInputChange}
                />
                <Input
                  label="Apellido Paterno"
                  name="apellido_paterno"
                  value={formUser.apellido_paterno}
                  onChange={handleInputChange}
                />
                <Input
                  label="Correo"
                  name="correo"
                  value={formUser.correo}
                  onChange={handleInputChange}
                />

                <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
                  Rol
                </label>
                <select
                  name="id_rol"
                  value={formUser.id_rol || ""}
                  onChange={(e) =>
                    setFormUser({ ...formUser, id_rol: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((r) => (
                    <option key={r.id_rol} value={r.id_rol}>
                      {r.nombre_perfil}
                    </option>
                  ))}
                </select>
              </>
            )}


            {formType === "rol" && (
              <>
                <Input label="Nombre del Perfil" name="nombre_perfil" value={formRole.nombre_perfil} onChange={handleInputRoleChange} />
                <Input label="Descripción" name="descripcion" value={formRole.descripcion} onChange={handleInputRoleChange} />
              </>
            )}

            {formType === "opcion" && (
              <>
                <Input label="Nombre" name="nombre" value={formOpcion.nombre} onChange={handleInputOpcionChange} />
                <Input label="URL Menú" name="url_menu" value={formOpcion.url_menu} onChange={handleInputOpcionChange} />
                <Input label="Descripción" name="descripcion" value={formOpcion.descripcion} onChange={handleInputOpcionChange} />
                <Input label="Estado" name="estado_registro" value={formOpcion.estado_registro} onChange={handleInputOpcionChange} />
              </>
            )}

            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500">Cancelar</Button>
              <Button onClick={
                formType === "usuario" ? handleSaveUser :
                formType === "rol" ? handleSaveRole :
                handleSaveOpcion
              }>
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}












import { useState } from "react";
import SidebarItem from "../components/sidebaritem";
import Input from "../components/input";
import Button from "../components/button";
import HeaderSection from "../components/headersection";
import DataTable from "../components/table";
import { 
  FaHome, FaUserPlus, FaUserTag, FaFileAlt, FaSignOutAlt, 
  FaEdit, FaTrash, FaUser, FaIdCard, FaEnvelope, FaLock, 
  FaPhone, FaMapMarkerAlt, FaUserShield, FaUsers, FaCogs 
} from "react-icons/fa";

// Panel principal
function PanelPrincipal({ username, users, roles, opciones, setActivePage }) {
  return (
    <>
      <HeaderSection 
        title="PANEL ADMINISTRADOR"
        description={`Bienvenido, ${username}. Aquí tienes un resumen del sistema.`}
        username={username}
      />
      <div className="p-8">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <FaUsers className="text-blue-500 text-4xl" />
            <div>
              <h3 className="font-semibold">Usuarios</h3>
              <p className="text-2xl">{users.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <FaUserShield className="text-green-500 text-4xl" />
            <div>
              <h3 className="font-semibold">Roles</h3>
              <p className="text-2xl">{roles.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <FaCogs className="text-purple-500 text-4xl" />
            <div>
              <h3 className="font-semibold">Opciones</h3>
              <p className="text-2xl">{opciones.length}</p>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <h2 className="text-xl font-bold mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setActivePage("usuarios")}
            className="bg-blue-100 hover:bg-blue-200 p-6 rounded-xl shadow cursor-pointer text-center"
          >
            <FaUsers className="text-blue-600 text-3xl mb-2 mx-auto" />
            <h3 className="font-semibold">Gestionar Usuarios</h3>
          </div>
          <div
            onClick={() => setActivePage("roles")}
            className="bg-green-100 hover:bg-green-200 p-6 rounded-xl shadow cursor-pointer text-center"
          >
            <FaUserShield className="text-green-600 text-3xl mb-2 mx-auto" />
            <h3 className="font-semibold">Gestionar Roles</h3>
          </div>
          <div
            onClick={() => setActivePage("opciones")}
            className="bg-purple-100 hover:bg-purple-200 p-6 rounded-xl shadow cursor-pointer text-center"
          >
            <FaCogs className="text-purple-600 text-3xl mb-2 mx-auto" />
            <h3 className="font-semibold">Gestionar Opciones</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Menu() {
  const [activePage, setActivePage] = useState("inicio");
  const username = localStorage.getItem("usuario") || "Usuario";
  const [search, setSearch] = useState("");

  // Datos de usuarios
  const [users, setUsers] = useState([
    { id: 1, nombres: "Alvaro", apellidoPaterno: "Arroyo", apellidoMaterno: "Gomez", dni:"12345678", fechadenacimiento:"1999-01-01", correo:"alvaro@mail.com", password:"1234", telefono:"987654321", direccion:"Av Siempre Viva", provincia:"Lima", rol: "Admin", estado: "Activo" },
    { id: 2, nombres: "Maria", apellidoPaterno: "Lopez", apellidoMaterno: "Diaz", dni:"87654321", fechadenacimiento:"2000-05-10", correo:"maria@mail.com", password:"abcd", telefono:"999111222", direccion:"Jr Central", provincia:"Cusco", rol: "Usuario", estado: "Inactivo" },
  ]);

  // Datos de roles
  const [roles, setRoles] = useState([
    { id: 1, rol: "Admin", descripcion: "Administrador total", usuarios: 1, estado: "Activo" },
    { id: 2, rol: "Usuario", descripcion: "Usuario normal", usuarios: 1, estado: "Activo" },
  ]);

  // Datos de opciones
  const [opciones, setOpciones] = useState([
    { id: 1, nombre: "Inicio", url: "/inicio", descripcion: "Página principal", orden: 1, estado: "Activo" },
    { id: 2, nombre: "Usuarios", url: "/usuarios", descripcion: "Gestión de usuarios", orden: 2, estado: "Activo" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formUser, setFormUser] = useState({
    nombres: "", apellidoPaterno: "", apellidoMaterno: "", dni: "", fechadenacimiento: "",
    correo: "", password: "", telefono: "", direccion: "", provincia: "", rol: "Usuario", estado: "Activo",
  });

  const [formRole, setFormRole] = useState({ rol: "", descripcion: "", estado: "Activo" });
  const [formOpcion, setFormOpcion] = useState({ nombre:"", url:"", descripcion:"", orden:"", estado:"Activo" });

  const handleLogout = () => { localStorage.removeItem("usuario"); window.location.href = "/login"; };
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleCancel = () => { setShowForm(false); setIsEditing(false); setEditingId(null); };

  // === Funciones Usuarios ===
  const handleAddUserClick = () => { setIsEditing(false); setFormUser({ nombres:"", apellidoPaterno:"", apellidoMaterno:"", dni:"", fechadenacimiento:"", correo:"", password:"", telefono:"", direccion:"", provincia:"", rol:"Usuario", estado:"Activo" }); setShowForm(true); };
  const handleInputChange = (e) => setFormUser({ ...formUser, [e.target.name]: e.target.value });
  const handleSaveUser = () => {
    if(isEditing) setUsers(users.map(u => u.id === editingId ? {...formUser, id: editingId} : u));
    else setUsers([...users, {...formUser, id: users.length ? Math.max(...users.map(u=>u.id))+1 : 1}]);
    setShowForm(false); setIsEditing(false); setEditingId(null);
  };
  const handleEditUser = (id) => { const u = users.find(u=>u.id===id); setFormUser(u); setIsEditing(true); setEditingId(id); setShowForm(true); };
  const handleDeleteUser = (id) => { if(window.confirm("¿Seguro que quieres eliminar este usuario?")) setUsers(users.filter(u=>u.id!==id)); };
  const filteredUsers = users.filter(u => `${u.nombres} ${u.apellidoPaterno} ${u.apellidoMaterno}`.toLowerCase().includes(search.toLowerCase()));
  const userColumns = [
    { label:"Nombre", field:"nombres" }, { label:"Apellido Paterno", field:"apellidoPaterno" },
    { label:"Apellido Materno", field:"apellidoMaterno" }, { label:"Rol", field:"rol" }, { label:"Estado", field:"estado" }
  ];
  const userActions = [
    { icon:<FaEdit className="text-blue-500 cursor-pointer"/>, onClick:(row)=>handleEditUser(row.id) },
    { icon:<FaTrash className="text-red-500 cursor-pointer"/>, onClick:(row)=>handleDeleteUser(row.id) },
  ];

  // === Funciones Roles ===
  const handleAddRoleClick = () => { setIsEditing(false); setFormRole({rol:"", descripcion:"", estado:"Activo"}); setShowForm(true); };
  const handleInputRoleChange = (e) => setFormRole({...formRole, [e.target.name]: e.target.value});
  const handleSaveRole = () => {
    if(isEditing) setRoles(roles.map(r => r.id===editingId ? {...formRole, id:editingId} : r));
    else setRoles([...roles, {...formRole, id: roles.length ? Math.max(...roles.map(r=>r.id))+1 : 1, usuarios:0}]);
    setShowForm(false); setIsEditing(false); setEditingId(null);
  };
  const handleEditRole = (id) => { const r=roles.find(r=>r.id===id); setFormRole(r); setIsEditing(true); setEditingId(id); setShowForm(true); };
  const handleDeleteRole = (id) => { if(window.confirm("¿Seguro que quieres eliminar este rol?")) setRoles(roles.filter(r=>r.id!==id)); };
  const filteredRoles = roles.filter(r=> r.rol.toLowerCase().includes(search.toLowerCase()) || r.descripcion.toLowerCase().includes(search.toLowerCase()));
  const roleColumns = [
    {label:"Rol", field:"rol"}, {label:"Descripción", field:"descripcion"}, {label:"Usuarios", field:"usuarios"}, {label:"Estado", field:"estado"}
  ];
  const roleActions = [
    { icon:<FaEdit className="text-blue-500 cursor-pointer"/>, onClick:(row)=>handleEditRole(row.id) },
    { icon:<FaTrash className="text-red-500 cursor-pointer"/>, onClick:(row)=>handleDeleteRole(row.id) },
  ];

  // === Funciones Opciones ===
  const handleAddOpcionClick = () => { setIsEditing(false); setFormOpcion({nombre:"", url:"", descripcion:"", orden:"", estado:"Activo"}); setShowForm(true); };
  const handleInputOpcionChange = (e) => setFormOpcion({...formOpcion, [e.target.name]: e.target.value});
  const handleSaveOpcion = () => {
    if(isEditing) setOpciones(opciones.map(o => o.id===editingId ? {...formOpcion, id:editingId} : o));
    else setOpciones([...opciones, {...formOpcion, id: opciones.length ? Math.max(...opciones.map(o=>o.id))+1 : 1}]);
    setShowForm(false); setIsEditing(false); setEditingId(null);
  };
  const handleEditOpcion = (id) => { const o=opciones.find(o=>o.id===id); setFormOpcion(o); setIsEditing(true); setEditingId(id); setShowForm(true); };
  const handleDeleteOpcion = (id) => { if(window.confirm("¿Seguro que quieres eliminar esta opción?")) setOpciones(opciones.filter(o=>o.id!==id)); };
  const filteredOpciones = opciones.filter(o=> o.nombre.toLowerCase().includes(search.toLowerCase()) || o.url.toLowerCase().includes(search.toLowerCase()));
  const opcionColumns = [
    {label:"ID", field:"id"}, {label:"Nombre", field:"nombre"}, {label:"URL/Ruta", field:"url"}, 
    {label:"Descripción", field:"descripcion"}, {label:"Orden", field:"orden"}, {label:"Estado", field:"estado"}
  ];
  const opcionActions = [
    { icon:<FaEdit className="text-blue-500 cursor-pointer"/>, onClick:(row)=>handleEditOpcion(row.id) },
    { icon:<FaTrash className="text-red-500 cursor-pointer"/>, onClick:(row)=>handleDeleteOpcion(row.id) },
  ];

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
            <SidebarItem icon={FaHome} label="Panel principal" onClick={()=>setActivePage("inicio")} hoverColor="#5c7bb4"/>
            <SidebarItem icon={FaUserPlus} label="Mantenimiento de usuarios" onClick={()=>setActivePage("usuarios")} hoverColor="#5c7bb4"/>
            <SidebarItem icon={FaUserTag} label="Mantenimiento de roles" onClick={()=>setActivePage("roles")} hoverColor="#5c7bb4"/>
            <SidebarItem icon={FaFileAlt} label="Mantenimiento de opciones" onClick={()=>setActivePage("opciones")} hoverColor="#5c7bb4"/>
          </ul>
        </nav>
        <div className="mt-8 w-full bg-[#466eb8] text-white rounded">
          <SidebarItem icon={FaSignOutAlt} label="Cerrar sesión" onClick={handleLogout} hoverColor="#ee4e4e"/>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100">
        {activePage==="inicio" && <PanelPrincipal username={username} users={users} roles={roles} opciones={opciones} setActivePage={setActivePage} />}

        {/* USUARIOS */}
        {activePage==="usuarios" && (
          <>
            <HeaderSection title="GESTIÓN DE USUARIOS" description="Aquí se podrán gestionar las cuentas de los usuarios." username={username} />
            {!showForm ? (
              <div className="p-8">
                <div className="flex gap-4 mb-4 items-center">
                  <Input placeholder="Buscar usuario..." value={search} onChange={handleSearchChange} className="flex-grow max-w-lg" icon={<FaUser />} />
                  <Button onClick={handleAddUserClick}>Añadir usuario</Button>
                </div>
                <DataTable columns={userColumns} data={filteredUsers} actions={userActions} />
              </div>
            ) : (
              <div className="p-8">
                <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-center">{isEditing ? "Editar Usuario" : "Añadir Nuevo Usuario"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="nombres" placeholder="Nombres" value={formUser.nombres} onChange={handleInputChange} icon={<FaUser />} />
                    <Input name="apellidoPaterno" placeholder="Apellido Paterno" value={formUser.apellidoPaterno} onChange={handleInputChange} icon={<FaUser />} />
                    <Input name="apellidoMaterno" placeholder="Apellido Materno" value={formUser.apellidoMaterno} onChange={handleInputChange} icon={<FaUser />} />
                    <Input name="dni" placeholder="DNI" value={formUser.dni} onChange={handleInputChange} icon={<FaIdCard />} />
                    <Input type="date" name="fechadenacimiento" placeholder="Fecha de Nacimiento" value={formUser.fechadenacimiento} onChange={handleInputChange} icon={<FaIdCard />} />
                    <Input name="correo" placeholder="Correo" value={formUser.correo} onChange={handleInputChange} icon={<FaEnvelope />} />
                    <Input type="password" name="password" placeholder="Contraseña" value={formUser.password} onChange={handleInputChange} icon={<FaLock />} />
                    <Input name="telefono" placeholder="Teléfono" value={formUser.telefono} onChange={handleInputChange} icon={<FaPhone />} />
                    <Input name="direccion" placeholder="Dirección" value={formUser.direccion} onChange={handleInputChange} icon={<FaMapMarkerAlt />} />
                    <Input name="provincia" placeholder="Provincia" value={formUser.provincia} onChange={handleInputChange} icon={<FaMapMarkerAlt />} />
                    <Input name="rol" placeholder="Rol" value={formUser.rol} onChange={handleInputChange} icon={<FaUserShield />} />
                  </div>
                  <div className="flex justify-between gap-4 mt-2">
                    <Button onClick={handleCancel} bgColor="#f87171" hoverColor="#ef4444">Cancelar</Button>
                    <Button onClick={handleSaveUser} bgColor={isEditing ? "#60a5fa" : "#4ade80"} hoverColor={isEditing ? "#2563eb" : "#16a34a"}>
                      {isEditing ? "Guardar Cambios" : "Guardar Usuario"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ROLES */}
        {activePage==="roles" && (
          <>
            <HeaderSection title="GESTIÓN DE ROLES" description="Aquí se podrán gestionar los roles del sistema." username={username} />
            {!showForm ? (
              <div className="p-8">
                <div className="flex gap-4 mb-4 items-center">
                  <Input placeholder="Buscar rol..." value={search} onChange={handleSearchChange} className="flex-grow max-w-lg" />
                  <Button onClick={handleAddRoleClick}>Añadir rol</Button>
                </div>
                <DataTable columns={roleColumns} data={filteredRoles} actions={roleActions} />
              </div>
            ) : (
              <div className="p-8">
                <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-center">{isEditing ? "Editar Rol" : "Añadir Nuevo Rol"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="rol" placeholder="Rol" value={formRole.rol} onChange={handleInputRoleChange} />
                    <Input name="descripcion" placeholder="Descripción" value={formRole.descripcion} onChange={handleInputRoleChange} />
                    <Input name="estado" placeholder="Estado" value={formRole.estado} onChange={handleInputRoleChange} />
                  </div>
                  <div className="flex justify-between gap-4 mt-2">
                    <Button onClick={handleCancel} bgColor="#f87171" hoverColor="#ef4444">Cancelar</Button>
                    <Button onClick={handleSaveRole} bgColor={isEditing ? "#60a5fa" : "#4ade80"} hoverColor={isEditing ? "#2563eb" : "#16a34a"}>
                      {isEditing ? "Guardar Cambios" : "Guardar Rol"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* OPCIONES */}
        {activePage==="opciones" && (
          <>
            <HeaderSection title="GESTIÓN DE OPCIONES" description="Aquí se podrán gestionar las opciones del sistema." username={username} />
            {!showForm ? (
              <div className="p-8">
                <div className="flex gap-4 mb-4 items-center">
                  <Input placeholder="Buscar opción..." value={search} onChange={handleSearchChange} className="flex-grow max-w-lg" />
                  <Button onClick={handleAddOpcionClick}>Añadir opción</Button>
                </div>
                <DataTable columns={opcionColumns} data={filteredOpciones} actions={opcionActions} />
              </div>
            ) : (
              <div className="p-8">
                <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-center">{isEditing ? "Editar Opción" : "Añadir Nueva Opción"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="nombre" placeholder="Nombre" value={formOpcion.nombre} onChange={handleInputOpcionChange} />
                    <Input name="url" placeholder="URL/Ruta" value={formOpcion.url} onChange={handleInputOpcionChange} />
                    <Input name="descripcion" placeholder="Descripción" value={formOpcion.descripcion} onChange={handleInputOpcionChange} />
                    <Input name="orden" placeholder="Orden" value={formOpcion.orden} onChange={handleInputOpcionChange} />
                    <Input name="estado" placeholder="Estado" value={formOpcion.estado} onChange={handleInputOpcionChange} />
                  </div>
                  <div className="flex justify-between gap-4 mt-2">
                    <Button onClick={handleCancel} bgColor="#f87171" hoverColor="#ef4444">Cancelar</Button>
                    <Button onClick={handleSaveOpcion} bgColor={isEditing ? "#60a5fa" : "#4ade80"} hoverColor={isEditing ? "#2563eb" : "#16a34a"}>
                      {isEditing ? "Guardar Cambios" : "Guardar Opción"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

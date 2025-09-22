import { FaUserPlus, FaEdit, FaUserSlash, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import SidebarItem from "../components/sidebaritem";
import Input from "../components/input";
import Button from "../components/button";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";
import HeaderSection from "../components/headersection";

export default function Menu() {
  const [activePage, setActivePage] = useState("inicio");
  const username = localStorage.getItem("usuario") || "Usuario";
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
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
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4F7B8E] text-white flex flex-col py-8 px-4">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.jpg" alt="Logo" className="w-16 h-16 mb-2 rounded-full" />
          <span className="font-bold text-lg">Odontdent</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <SidebarItem icon={FaUserPlus} label="Crear cuentas" onClick={() => setActivePage("crear")} />
            <SidebarItem icon={FaEdit} label="Editar datos" onClick={() => setActivePage("editar")} />
            <SidebarItem icon={FaUserSlash} label="Desactivar cuentas" onClick={() => setActivePage("desactivar")} />
            <SidebarItem icon={FaFileAlt} label="Generar reportes" onClick={() => setActivePage("reportes")} />
          </ul>
        </nav>
        <div className="mt-8">
          <button
            className="flex items-center gap-2 w-full bg-[#1f3541] hover:bg-[#922525] p-2 rounded cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100">
        {/* Imagen de cabecera */}
        <div className="w-full mb-6">
          <img
            src="/cabecera.jpg"
            alt="Cabecera"
            className="w-full h-48 object-cover shadow"
          />
        </div>

        <div className="px-8">
          {/* contenido por opcion */}
          {activePage === "inicio" && (
            <div>
              <HeaderSection title="PANEL PRINCIPAL" username={username} />
              <div className="text-center">
                <p>Selecciona una opción del menú para comenzar.</p>
              </div>
            </div>
          )}

          {activePage === "crear" && (
            <div>
              <HeaderSection title="CREAR CUENTAS" username={username} underline/>
              <div className="flex justify-center">
                <p>Aquí va el formulario para registrar nuevas cuentas.</p>
              </div>
            </div>
          )}

          {activePage === "editar" && (
            <div>
              <HeaderSection title="EDITAR DATOS" username={username} underline />
              <p className="mb-10 text-left">
                Aquí se podrán modificar los datos de los usuarios.
              </p>

              <form
                onSubmit={handleRegister}
                className="w-full max-w-6xl bg-[#d8e0e2] p-8 rounded-lg shadow-md flex flex-col items-center gap-6 text-[#112229] mx-auto"
              >
                <div className="grid grid-cols-2 gap-6 max-w-4xl w-full">
                  <Input name="username" placeholder="Usuario" onChange={handleChange} icon={<FaUser />} />
                  <Input name="email" placeholder="Correo" onChange={handleChange} icon={<FaEnvelope />} />
                  <Input type="password" name="password" placeholder="Contraseña" onChange={handleChange} icon={<FaLock />} />
                  <Input name="nombres" placeholder="Nombres" onChange={handleChange} icon={<FaUserTag />} />
                  <Input name="apellidoPaterno" placeholder="Apellido paterno" onChange={handleChange} icon={<FaUserTag />} />
                  <Input name="apellidoMaterno" placeholder="Apellido materno" onChange={handleChange} icon={<FaUserTag />} />
                  <Input type="date" name="fechadenacimiento" onChange={handleChange} />
                  <Input name="telefono" placeholder="Teléfono" onChange={handleChange} icon={<FaPhone />} />
                  <Input name="direccion" placeholder="Dirección" onChange={handleChange} icon={<FaMapMarkerAlt />} />
                  <Input name="provincia" placeholder="Provincia" onChange={handleChange} icon={<FaMapMarkerAlt />} />
                </div>

                <Button type="submit">Guardar Cambios</Button>
              </form>
            </div>
          )}

          {activePage === "desactivar" && (
            <div>
              <HeaderSection title="DESACTIVAR CUENTAS" username={username} underline/>
              <div className="flex justify-center">
                <p>Aquí puedes inhabilitar cuentas de usuarios.</p>
              </div>
            </div>
          )}

          {activePage === "reportes" && (
            <div>
              <HeaderSection title="GENERAR REPORTES" username={username} underline/>
              <div className="flex justify-center">
                <p>Aquí se podrán visualizar y descargar reportes.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

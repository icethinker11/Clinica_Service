// src/components/PanelPrincipal.jsx
import { FaUsers, FaUserShield, FaCogs } from "react-icons/fa";
import HeaderSection from "../components/headersection";

export default function PanelPrincipal({ username, users, roles, opciones, setActivePage }) {
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

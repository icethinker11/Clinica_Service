import { useState } from "react";
import SidebarItem from "../components/sidebaritem";
import HeaderSection from "../components/headersection";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutUsuario } from "../services/authService";

export default function PlantillaMenu({
  username,
  sidebarItems,
  children,

  // 🔹 HEADER
  headerInfo = {},           // Información dinámica por menú
  headerBgColor = "#4E85EB",
  headerUserBgColor = "#184bac",
  headerTextColor = "white",

  // 🔹 SIDEBAR
  sidebarBgColor = "#81ADFF",
  sidebarTextColor = "gray-800",
  sidebarHoverColor = "#5c7bb4",
  sidebarLogoutBgColor = "#466eb8",
  sidebarLogoutHoverColor = "#ee4e4e",
  sidebarLogoutTextColor = "white",
}) {
  const [activePage, setActivePage] = useState("inicio");

  const handleLogout = () => logoutUsuario();

  // Extraer título y descripción según página activa
  const { title, description } =
    headerInfo[activePage] || Object.values(headerInfo)[0] || { title: "", description: "" };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🔹 SIDEBAR */}
      <aside
        className="w-64 flex flex-col py-8 px-4"
        style={{ backgroundColor: sidebarBgColor, color: sidebarTextColor }}
      >
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.jpg" alt="Logo" className="w-16 h-16 mb-2 rounded-2xl" />
          <span className="font-extrabold underline text-lg">ODONTDENT</span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                onClick={() => setActivePage(item.page)}
                hoverColor={sidebarHoverColor}
              />
            ))}
          </ul>
        </nav>

        <div className="mt-8 w-full rounded" style={{ backgroundColor: sidebarLogoutBgColor }}>
          <SidebarItem
            icon={FaSignOutAlt}
            label="Cerrar sesión"
            onClick={handleLogout}
            hoverColor={sidebarLogoutHoverColor}
            textColor={sidebarLogoutTextColor}
          />
        </div>
      </aside>

      {/* 🔹 CONTENEDOR PRINCIPAL */}
      <main className="flex-1 flex flex-col">
        {/* CABECERA FIJA con HeaderSection y colores ajustables */}
        <HeaderSection
          title={title}
          description={description}
          username={username}
          underline={false}
          bgColor={headerBgColor}
          userBgColor={headerUserBgColor}
          textColor={headerTextColor}
        />

        {/* CONTENIDO PRINCIPAL */}
        <section className="flex-1 p-6 overflow-y-auto">
          {children(activePage, setActivePage)}
        </section>
      </main>
    </div>
  );
}



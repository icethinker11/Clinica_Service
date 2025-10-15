import { FaHome, FaCalendarAlt, FaUsers, FaUserMd, FaFileAlt } from "react-icons/fa";
import { getUsuarioActual } from "../services/authService";
import PlantillaMenu from "../components/plantillamenu";

// ==============================
// 🏠 Panel principal (inicio)
// ==============================
const PanelPrincipal = ({ username }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Bienvenido, {username}</h2>
    <p className="text-gray-700">Este es el panel principal del recepcionista.</p>
  </div>
);

// ==============================
// 🧩 Menu Recepcionista
// ==============================
export default function MenuRecepcionista() {
  const usuario = getUsuarioActual();
  const username = usuario?.nombre || "Recepcionista";

  // Definir las opciones del menú
  const sidebarItems = [
    { icon: FaHome, label: "Inicio", page: "inicio" },
    { icon: FaCalendarAlt, label: "Citas", page: "citas" },
  ];

  // Información dinámica para el header según la página activa
  const headerInfo = {
    inicio: { title: "PANEL DE RECEPCIONISTA", description: "Bienvenido al sistema Odontdent." },
    citas: { title: "GESTIÓN DE CITAS", description: "Administra y organiza las citas de los pacientes." },
  };

  // Renderizar el contenido según la página activa
  const renderPage = (activePage) => {
    switch (activePage) {
      case "inicio":
        return <PanelPrincipal username={username} />;
      case "citas":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Citas</h2>
            <p>Aquí se gestionan las citas de los pacientes.</p>
          </div>
        );
      default:
        return <PanelPrincipal username={username} />;
    }
  };

  return (
    <PlantillaMenu
      username={username}
      sidebarItems={sidebarItems}
      headerInfo={headerInfo}

      // 🔹 HEADER
      headerBgColor="#7C4DFF"        // Fondo del header
      headerUserBgColor="#5E35B1"    // Recuadro del usuario
      headerTextColor="white"        // Color del texto

      // 🔹 SIDEBAR
      sidebarBgColor="#A58AF3"       // Fondo del sidebar
      sidebarTextColor="white"       // Texto del sidebar
      sidebarHoverColor="#BA68C8"    // Hover de los items
      sidebarLogoutBgColor="#8C65FA" // Fondo logout
      sidebarLogoutHoverColor="#AB47BC" // Hover logout
      sidebarLogoutTextColor="white"    // Texto logout
    >
      {(activePage) => renderPage(activePage)}
    </PlantillaMenu>
  );
}
import { useState, useEffect } from "react";
import { FaHome, FaUsersCog, FaUserShield, FaCogs } from "react-icons/fa";
import { getUsuarioActual } from "../services/authService";
import PlantillaMenu from "../components/plantillamenu";

import Usuarios from "../modules/usuarios";
import Roles from "../modules/roles";
import Opciones from "../modules/opciones";
import PanelAdmin from "../modules/paneladmin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MenuAdmin() {
  const usuario = getUsuarioActual();
  const username = usuario?.nombre || "Administrador";

  //  Estados de datos
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [opciones, setOpciones] = useState([]);

  //  Carga de datos al inicio
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

  const sidebarItems = [
    { icon: FaHome, label: "Inicio", page: "inicio" },
    { icon: FaUsersCog, label: "Usuarios", page: "usuarios" },
    { icon: FaUserShield, label: "Roles", page: "roles" },
    { icon: FaCogs, label: "Opciones", page: "opciones" },
  ];

  const headerInfo = {
    inicio: {
      title: "PANEL ADMINISTRADOR",
      description: `Bienvenido, ${username}. Aquí tienes un resumen general del sistema.`,
    },
    usuarios: {
      title: "MANTENIMIENTO DE USUARIOS",
      description: "Administra los usuarios registrados del sistema.",
    },
    roles: {
      title: "MANTENIMIENTO DE ROLES",
      description: "Gestiona los roles y permisos asignados a los usuarios.",
    },
    opciones: {
      title: "MANTENIMIENTO DE OPCIONES",
      description: "Configura las opciones disponibles del sistema.",
    },
  };

  const renderPage = (activePage) => {
    switch (activePage) {
      case "inicio":
        return <PanelAdmin username={username} users={users} roles={roles} opciones={opciones} />;
      case "usuarios":
        return <Usuarios users={users} />; // 🔹 opcional: pasar datos
      case "roles":
        return <Roles roles={roles} />; // 🔹 opcional: pasar datos
      case "opciones":
        return <Opciones opciones={opciones} />; // 🔹 opcional: pasar datos
      default:
        return <PanelAdmin username={username} users={users} roles={roles} opciones={opciones} />;
    }
  };

  return (
    <PlantillaMenu
      username={username}
      sidebarItems={sidebarItems}
      headerInfo={headerInfo}
      headerBgColor="#4E85EB"
      headerUserBgColor="#0D47A1"
      headerTextColor="white"
      sidebarBgColor="#81ADFF"
      sidebarTextColor="white"
      sidebarHoverColor="#42A5F5"
      sidebarLogoutBgColor="#1E88E5"
      sidebarLogoutHoverColor="#1565C0"
      sidebarLogoutTextColor="white"
    >
      {(activePage, setActivePage) => renderPage(activePage)}
    </PlantillaMenu>
  );
}





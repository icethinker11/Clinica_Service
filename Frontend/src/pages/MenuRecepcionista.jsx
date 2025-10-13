import { FaUserEdit, FaCalendarPlus } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import SidebarItem from "../components/sidebaritem";

export default function MenuRecepcionista() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#4495C0] text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Recepcionista</h2>

        <SidebarItem to="/menurecepcionista/pacientes" icon={FaUserEdit} label="Pacientes" />
        <SidebarItem to="/menurecepcionista/citas" icon={FaCalendarPlus} label="Citas" />
      </aside>

      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}


import { useState } from "react";

export default function SidebarItem({ icon: Icon, label, onClick, hoverColor = "#e5e7eb" }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <li
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200
                  ${isHover ? "scale-[1.02] shadow-md" : ""}`}
      style={{
        backgroundColor: isHover ? hoverColor : "transparent",
      }}
    >
      {/* Ícono */}
      <Icon
        className={`text-lg ${isHover ? "text-white" : "text-gray-700"} transition-colors duration-200`}
      />

      {/* Etiqueta */}
      <span
        className={`font-medium ${isHover ? "text-white" : "text-gray-800"} transition-colors duration-200`}
      >
        {label}
      </span>
    </li>
  );
}

import { useState } from "react";

export default function SidebarItem({ icon: Icon, label, onClick, hoverColor = "#e5e7eb" }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <li
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex items-center gap-2 cursor-pointer p-2 rounded transition-colors"
      style={{
        backgroundColor: isHover ? hoverColor : "transparent",
      }}
    >
      <Icon />
      <span>{label}</span>
    </li>
  );
}
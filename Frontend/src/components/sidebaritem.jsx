import { useState } from "react";

export default function SidebarItem({
  icon: Icon,
  label,
  onClick,
  hoverColor = "#5c7bb4",
  textColor = "white",
  active = false,
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <li>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200
                    ${active ? "font-bold shadow-md scale-[1.02]" : ""}
                    ${!active && isHover ? "scale-[1.01]" : ""}`}
        style={{
          backgroundColor: active
            ? hoverColor
            : isHover
            ? hoverColor
            : "transparent",
          color: textColor,
        }}
      >
        {Icon && (
          <Icon
            className={`text-lg transition-colors duration-200 ${
              isHover || active ? "text-white" : "text-gray-700"
            }`}
          />
        )}
        <span
          className={`font-medium transition-colors duration-200 ${
            isHover || active ? "text-white" : "text-gray-800"
          }`}
        >
          {label}
        </span>
      </button>
    </li>
  );
}

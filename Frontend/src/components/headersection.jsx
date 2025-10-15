import { FaUserCircle } from "react-icons/fa";

export default function HeaderSection({
  title,
  description,
  username,
  underline = false,
  bgColor = "#4E85EB",       // Color de fondo de la cabecera
  userBgColor = "#184bac",   // Color de fondo del recuadro de usuario
  textColor = "white"        // Color de texto
}) {
  return (
    <div className={`flex items-center justify-between mb-1 p-7`} style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Columna izquierda: título + descripción */}
      <div>
        <h2 className={`text-2xl font-bold ${underline ? "underline" : ""}`}>
          {title}
        </h2>
        {description && <p className="text-m mt-1">{description}</p>}
      </div>

      {/* Columna derecha: usuario */}
      <div className="flex items-center gap-2 px-4 py-2 rounded" style={{ backgroundColor: userBgColor, color: textColor }}>
        <FaUserCircle className="text-xl" />
        <span className="font-semibold">{username}</span>
      </div>
    </div>
  );
}
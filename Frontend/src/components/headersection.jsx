import { FaUserCircle } from "react-icons/fa";

export default function HeaderSection({ title, description, username, underline = false }) {
  return (
    <div className="bg-[#4E85EB] flex items-center justify-between text-white mb-1 p-7">
      {/* Columna izquierda: título + descripción */}
      <div>
        <h2
          className={`text-2xl font-bold  ${
            underline ? "underline" : ""
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className="text-m mt-1">{description}</p>
        )}
      </div>

      {/* Columna derecha: usuario */}
      <div className="flex items-center gap-2 text-white bg-[#184bac] px-4 py-2 rounded">
        <FaUserCircle className="text-xl " />
        <span className="font-semibold ">{username}</span>
      </div>
    </div>
  );
}
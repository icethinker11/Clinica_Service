import Button from "./button"; // Tu componente Button
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function StatusPopup({ type = "success", title, message, onClose }) {
  const isSuccess = type === "success";

  // Detectar click fuera del contenido
  const handleClickOutside = (e) => {
    if (e.target.dataset.popupBackground) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      data-popup-background
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        {/* Icono */}
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <FaCheckCircle className="text-green-500 text-6xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-6xl" />
          )}
        </div>

        {/* Título */}
        <h2 className="text-xl font-bold mb-2">{title}</h2>

        {/* Mensaje */}
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Botón usando colores dinámicos */}
        <Button
          onClick={onClose}
          bgColor={isSuccess ? "#28a745" : "#dc3545"}
          hoverColor={isSuccess ? "#218838" : "#c82333"}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

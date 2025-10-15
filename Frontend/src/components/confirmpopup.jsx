import Button from "./button";

export default function ConfirmPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={onCancel} className="bg-gray-400 hover:bg-gray-500">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
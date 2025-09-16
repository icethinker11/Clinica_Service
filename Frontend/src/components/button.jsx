export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition "
    >
      {children}
    </button>
  );
}
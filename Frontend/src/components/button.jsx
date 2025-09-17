export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-[#4F7B8E]  text-white py-2 rounded-md hover:bg-[#77a6ba] transition cursor-pointer"
    >
      {children}
    </button>
  );
}
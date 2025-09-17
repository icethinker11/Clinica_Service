export default function Input({ type = "text", placeholder, icon, value, onChange }) {
  return (
    <div className="flex items-center border rounded-full px-3 py-2 mb-2">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 outline-none bg-transparent"
      />
      {icon && <span className="ml-2">{icon}</span>}
    </div>
  );
}
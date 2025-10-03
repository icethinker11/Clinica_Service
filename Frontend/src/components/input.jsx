export default function Input({ icon, ...props }) {
  return (
    <div className="flex items-center border p-2 rounded bg-white mb-1.5">
      {icon && <span className="mr-2 text-gray-500">{icon}</span>}
      <input
        className="flex-1 bg-transparent outline-none"
        {...props}   
      />
    </div>
  );
}

export default function Button({ 
  children, 
  onClick, 
  type = "button", 
  bgColor = "#4495C0", 
  hoverColor = "#266b99" 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ backgroundColor: bgColor }}
      className={`w-60 self-center text-white py-2 rounded-md transition cursor-pointer hover:bg-[${hoverColor}]`}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverColor}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = bgColor}
    >
      {children}
    </button>
  );
}
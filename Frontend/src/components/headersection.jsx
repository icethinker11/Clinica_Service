import { FaUserCircle } from "react-icons/fa";

export default function HeaderSection({ title, username, underline = false }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <h2
        className={`text-2xl font-bold text-[#4F7B8E] ${
          underline ? "underline" : ""
        }`}
      >
        {title}
      </h2>
      <div className="flex items-center gap-2 bg-[#d4e8ed] px-4 py-2 rounded">
        <FaUserCircle className="text-xl text-black" />
        <span className="font-semibold text-black">{username}</span>
      </div>
    </div>
  );
}
export default function SidebarItem({ icon: Icon, label, onClick }) {
    return (
        <li
            onClick={onClick}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#3a5a6b] p-2 rounded"
        >
            <Icon /> <span>{label}</span>
        </li>
    );
}
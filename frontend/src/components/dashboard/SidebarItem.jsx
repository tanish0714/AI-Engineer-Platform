import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon, title, to }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `
                flex
                items-center
                gap-4
                px-4
                py-3
                rounded-xl
                transition-all
                ${
                    isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-zinc-800 text-zinc-300"
                }
                `
            }
        >
            {icon}

            <span>{title}</span>
        </NavLink>
    );
};

export default SidebarItem;
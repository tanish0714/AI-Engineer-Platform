const Input = ({ className = "", ...props }) => {
    return (
        <input
            {...props}
            className={`
            w-full
            rounded-2xl
            bg-zinc-900
            border
            border-white/10
            px-4
            py-3
            outline-none
            focus:border-blue-500
            transition-all
            ${className}
        `}
        />
    );
};

export default Input;
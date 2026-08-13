const Button = ({
    children,
    className = "",
    ...props
}) => {
    return (
        <button
            {...props}
            className={`
            px-5
            py-3
            rounded-2xl
            bg-blue-600
            hover:bg-blue-500
            active:scale-95
            transition-all
            duration-300
            font-medium
            text-white
            ${className}
        `}
        >
            {children}
        </button>
    );
};

export default Button;
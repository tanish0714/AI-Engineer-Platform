const Button = ({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  onClick,
}) => {
  const baseStyle =
    "rounded-xl px-5 py-3 font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30",

    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white",

    outline:
      "border border-slate-600 hover:border-indigo-500 text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
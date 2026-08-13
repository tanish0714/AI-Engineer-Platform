const Card = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`
        w-full
        rounded-3xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-6
        backdrop-blur-xl
        sm:p-7
        ${hover
          ? "transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/20 hover:bg-white/[0.04]"
          : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
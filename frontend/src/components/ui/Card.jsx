const Card = ({ children }) => {
  return (
    <div
      className="
      bg-[#111827]
      border
      border-white/10
      rounded-2xl
      p-8
      shadow-xl
      "
    >
      {children}
    </div>
  );
};

export default Card;
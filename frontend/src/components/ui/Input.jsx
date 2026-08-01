const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
      w-full
      rounded-xl
      bg-slate-900
      border
      border-slate-700
      px-4
      py-3
      text-white
      outline-none
      transition
      focus:border-indigo-500
      focus:ring-2
      focus:ring-indigo-500/20
      "
    />
  );
};

export default Input;
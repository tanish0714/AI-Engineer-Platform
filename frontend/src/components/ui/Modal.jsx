import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div
        className={`w-full ${sizes[size]} rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl`}
      >

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-white/10"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>

        </div>

        {/* Body */}

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default Modal;
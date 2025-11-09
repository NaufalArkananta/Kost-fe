import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isShow: boolean;
  onClose?: () => void;
};

const Modal = ({ children, isShow, onClose }: Props) => {
  if (!isShow) return null;

  return (
    <div
      className="fixed inset-0 z-[1024] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // klik area luar modal untuk menutup
    >
      <div
        className="relative w-11/12 md:w-1/2 lg:w-2/5 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()} // cegah modal tertutup saat klik dalam
      >
        {/* Tombol close */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ×
          </button>
        )}

        {/* Konten modal */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

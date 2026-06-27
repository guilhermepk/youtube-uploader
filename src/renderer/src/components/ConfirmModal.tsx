import toast from 'react-hot-toast';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const showConfirmModal = ({ title, message, onConfirm, onCancel }: ConfirmModalProps) => {
  toast.custom(
    (t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5`}
      >
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (onCancel) onCancel();
            }}
            className="w-full border border-transparent rounded-none rounded-bl-lg px-4 py-3 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="w-full border border-transparent border-l border-gray-200 rounded-none rounded-br-lg px-4 py-3 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 transition-colors focus:outline-none"
          >
            Confirmar
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity, // Impede que o toast suma sozinho
      position: 'top-center',
      id: 'confirm-modal', // Evita que múltiplos modais abram empilhados
    }
  );
};
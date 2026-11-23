import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../features/ui/uiSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-900',
    error: 'border-red-200 dark:border-red-900',
    info: 'border-sky-200 dark:border-sky-900',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border text-sm text-neutral-800 dark:text-neutral-100 ${
        borders[toast.type] || borders.info
      } animate-in fade-in slide-in-from-top-2 duration-200`}
    >
      {icons[toast.type] || icons.info}
      <p className="flex-1 text-xs font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={(id) => dispatch(removeToast(id))}
        />
      ))}
    </div>
  );
};

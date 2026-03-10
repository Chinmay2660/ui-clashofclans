import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const TOAST_DURATION = 3500;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts }) => {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 max-w-[90vw] sm:max-w-md"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border
            text-sm font-medium text-white transition-all duration-200
            ${t.type === 'success' ? 'bg-gem-500/90 border-gem-400/50' : ''}
            ${t.type === 'error' ? 'bg-war-500/90 border-war-400/50' : ''}
            ${t.type === 'info' ? 'bg-amber-500/90 border-amber-400/50' : ''}
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

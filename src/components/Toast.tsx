import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type ToastCallback = (toast: ToastMessage) => void;

class ToastManager {
  private listeners: Set<ToastCallback> = new Set();

  subscribe(callback: ToastCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  show(message: string, type: ToastType = "info", duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toastItem = { id, message, type, duration };
    this.listeners.forEach((cb) => cb(toastItem));
  }

  success(message: string, duration?: number) {
    this.show(message, "success", duration);
  }

  error(message: string, duration?: number) {
    this.show(message, "error", duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, "warning", duration);
  }

  info(message: string, duration?: number) {
    this.show(message, "info", duration);
  }
}

export const toast = new ToastManager();

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
    });
    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none no-print">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const { message, type, duration } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-slate-900/90 border-emerald-500/30 shadow-emerald-950/20",
          icon: <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />,
          glow: "before:bg-emerald-500/10",
        };
      case "error":
        return {
          bg: "bg-slate-900/90 border-rose-500/30 shadow-rose-950/20",
          icon: <AlertCircle className="size-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />,
          glow: "before:bg-rose-500/10",
        };
      case "warning":
        return {
          bg: "bg-slate-900/90 border-amber-500/30 shadow-amber-950/20",
          icon: <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />,
          glow: "before:bg-amber-500/10",
        };
      case "info":
      default:
        return {
          bg: "bg-slate-900/90 border-blue-500/30 shadow-blue-950/20",
          icon: <Info className="size-5 text-blue-400 shrink-0 mt-0.5" />,
          glow: "before:bg-blue-500/10",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
      className={`pointer-events-auto relative flex items-start gap-3 px-4 py-3.5 border rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl ${styles.bg} ${styles.glow} before:absolute before:inset-0 before:opacity-20 before:-z-10`}
    >
      {styles.icon}
      <div className="flex-1 pr-3">
        <p className="text-xs font-semibold text-slate-100 leading-normal break-words whitespace-pre-line text-left">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white hover:bg-white/5 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
      >
        <X className="size-4" />
      </button>
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[3px] ${
          type === "success" ? "bg-emerald-500" :
          type === "error" ? "bg-rose-500" :
          type === "warning" ? "bg-amber-500" :
          "bg-blue-500"
        }`}
      />
    </motion.div>
  );
}

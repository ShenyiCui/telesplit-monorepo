import React from "react";
import Toast, { ToastProps } from "./Toast";

export interface ToastData extends Omit<ToastProps, "onDismiss"> {}

interface ToastContainerProps {
  position?: "top" | "bottom";
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top",
  toasts,
  onDismiss,
}) => {
  // If at the top, new toasts push existing ones down.
  // At the bottom, new toasts push them upward.
  const sortedToasts = position === "top" ? toasts : [...toasts].reverse();

  return (
    <div
      className={`fixed inset-x-0 pointer-events-none p-4 ${
        position === "top"
          ? "top-0 flex flex-col items-start space-y-2"
          : "bottom-0 flex flex-col-reverse items-end space-y-2"
      }`}
    >
      {sortedToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full">
          <Toast {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

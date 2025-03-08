import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string | React.ReactNode;
  duration?: number; // in milliseconds, default is 3000
  onDismiss: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  {
    container: string;
    icon: JSX.Element;
    titleClass: string;
    dismissButton: string;
  }
> = {
  success: {
    container: "rounded-md bg-green-50 p-4",
    icon: (
      <CheckCircleIcon aria-hidden="true" className="h-5 w-5 text-green-400" />
    ),
    titleClass: "text-sm font-medium text-green-800",
    dismissButton:
      "rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50",
  },
  warning: {
    container: "rounded-md bg-yellow-50 p-4",
    icon: (
      <ExclamationTriangleIcon
        aria-hidden="true"
        className="h-5 w-5 text-yellow-400"
      />
    ),
    titleClass: "text-sm font-medium text-yellow-800",
    dismissButton:
      "rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100 focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50",
  },
  error: {
    container: "rounded-md bg-red-50 p-4",
    icon: <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />,
    titleClass: "text-sm font-medium text-red-800",
    dismissButton:
      "rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50",
  },
  info: {
    container: "rounded-md bg-blue-50 p-4",
    icon: (
      <InformationCircleIcon
        aria-hidden="true"
        className="h-5 w-5 text-blue-400"
      />
    ),
    titleClass: "text-sm text-blue-700",
    dismissButton:
      "rounded-md bg-blue-50 p-1.5 text-blue-500 hover:bg-blue-100 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50",
  },
};

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set an individual timer once when this toast mounts.
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const handleDismiss = () => {
    setVisible(false);
    // Delay removal to allow fade-out animation
    setTimeout(() => onDismiss(id), 300);
  };

  if (!visible) return null;

  const styles = toastStyles[type];

  return (
    <div
      className={`${styles.container} transition-opacity duration-300 ease-out`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex">
        <div className="shrink-0">{styles.icon}</div>
        <div className="ml-3 flex-1">
          {title && <p className={styles.titleClass}>{title}</p>}
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleDismiss}
              className={styles.dismissButton}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;

// src/components/Toast.js

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message, { autoClose: 1000 }),
  warning: (message) => toast.warning(message),
};

export const ToastProvider = () => (
  <ToastContainer position="top-right" autoClose={2000} />
);

export default Toast;

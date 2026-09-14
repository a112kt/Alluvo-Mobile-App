import { ToastRef } from "../Components/NotificationToast";

let toastRef: ToastRef | null = null;

export const setToastRef = (ref: ToastRef | null) => {
  toastRef = ref;
};

export const showToast = (title: string, message: string, onPress?: () => void, type?: 'success' | 'warning' | 'error' | 'info') => {
  if (toastRef) {
    toastRef.show(title, message, onPress, type);
  } else {
    console.warn("ToastRef not set. Make sure NotificationToast is rendered in the root component.");
  }
};

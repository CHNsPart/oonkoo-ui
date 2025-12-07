"use client";

import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

// Simple toast state management
const toastListeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

function notify() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

function addToast(options: ToastOptions): string {
  const id = Math.random().toString(36).substring(2, 9);
  const toast: Toast = {
    id,
    title: options.title,
    description: options.description,
    variant: options.variant || "default",
  };

  toasts = [...toasts, toast];
  notify();

  // Auto-remove after duration
  const duration = options.duration ?? 5000;
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, duration);

  return id;
}

function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const [, setToastsState] = useState<Toast[]>([]);

  // Subscribe to toast updates
  useState(() => {
    const handleUpdate = (newToasts: Toast[]) => setToastsState(newToasts);
    toastListeners.add(handleUpdate);
    return () => {
      toastListeners.delete(handleUpdate);
    };
  });

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, []);

  const dismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}

export { type Toast, type ToastOptions };

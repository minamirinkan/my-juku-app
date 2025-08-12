// src/components/ToastProvider.jsx
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastStyles.css'; // ← カスタムCSSを読み込み

// カスタムエラーToast
export const showErrorToast = (message) => {
    toast.error(message, {
        toastId: 'custom-error-toast',
        className: 'custom-toast',
        bodyClassName: 'custom-toast-body',
        position: 'top-center', // centerにもできる（下に紹介）
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
    });
};

export const ToastProvider = () => {
    return <ToastContainer />;
};

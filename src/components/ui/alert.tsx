"use client";

import { useEffect } from "react";
import { FiCheckCircle, FiXCircle } from "./icons";

type AlertType = "success" | "error";

interface AlertProps {
    type: AlertType;
    message: string;
    onClose: () => void;
}

const alertConfig = {
    success: {
        icon: FiCheckCircle,
        className: "bg-green-50 border-green-200 text-green-700",
    },
    error: {
        icon: FiXCircle,
        className: "bg-red-50 border-red-200 text-red-700",
    }
};

export default function Alert({ type, message, onClose, }: AlertProps) {
    const { icon: Icon, className } = alertConfig[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div role="alert" className={`w-full h-11 font-ui text-sm mt-2 flex justify-center items-center gap-2 ${className}`}>
            <Icon size={12} color="currentColor" />
            <p className="">{message}</p>
        </div>
    );
}
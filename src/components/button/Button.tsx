import React, { forwardRef } from "react";
import { ButtonProps } from "./types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, variant = "primary", className = "", ...props }, ref) => {
    const variantClasses = {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-500 text-white hover:bg-gray-600",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
      <button
        ref={ref}
        className={`${className} ${variantClasses[variant]} `}
        {...props}
      >
        {label}
      </button>
    );
  }
);

Button.displayName = "Button";

import React from "react";
import "./PrimaryButton.css";

export default function PrimaryButton({
  children,
  onClick,
  variant = "blue",
  size = "md",
  icon,
  disabled = false,
  className = "",
  type = "button",
}) {
  const buttonClass = `primary-button primary-button-${variant} primary-button-${size} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="primary-button-icon">{icon}</span>}
      {children}
    </button>
  );
}

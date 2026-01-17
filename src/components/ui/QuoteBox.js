import React from "react";
import "./QuoteBox.css";

export default function QuoteBox({ children, className = "" }) {
  return (
    <div className={`quote-box ${className}`}>
      <span className="quote-icon">💬</span>
      <span className="quote-text">"{children}"</span>
    </div>
  );
}

// Styles globaux pour l'application
// Ces styles peuvent être importés et utilisés si nécessaire

export const colors = {
  primary: "#667eea",
  secondary: "#764ba2",
  success: "#2ecc71",
  danger: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",
  light: "#f7f7f7",
  dark: "#2c3e50",
};

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "40px",
};

export const borderRadius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
};

// Animation pour les événements
export const animations = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

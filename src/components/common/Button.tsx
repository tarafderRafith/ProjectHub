import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

function Button({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`hub-button hub-button-${variant} hub-button-${size} ${
        fullWidth ? "hub-button-full" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
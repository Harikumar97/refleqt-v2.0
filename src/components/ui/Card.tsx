/**
 * Card Component
 * Reusable card component for consistent styling
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "info" | "warning" | "error" | "success";
  padding?: "sm" | "md" | "lg";
}

export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
}: CardProps) {
  const variantStyles = {
    default: "bg-gray-800 border-gray-700",
    info: "bg-blue-900/20 border-blue-700",
    warning: "bg-yellow-900/20 border-yellow-700",
    error: "bg-red-900/20 border-red-700",
    success: "bg-green-900/20 border-green-700",
  };

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`border rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Status Indicator Components
 * Badges, dots, and status displays for navigation and UI
 */

interface StatusDotProps {
  status: "success" | "warning" | "error" | "info" | "processing";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function StatusDot({
  status,
  size = "md",
  animated = true,
}: StatusDotProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <span
      className={`
        ${sizeClasses[size]}
        status-dot ${status}
        ${animated && (status === "success" || status === "processing") ? "animate-pulse" : ""}
      `}
    />
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "new" | "beta" | "pro" | "count";
  className?: string;
}

export function Badge({
  children,
  variant = "count",
  className = "",
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>{children}</span>
  );
}

interface NavStatusProps {
  status: "running" | "processing" | "completed" | "error";
  label?: string;
}

export function NavStatus({ status, label }: NavStatusProps) {
  const statusConfig = {
    running: { icon: "●", className: "text-green-400 animate-pulse" },
    processing: { icon: "⚡", className: "text-yellow-400 animate-pulse" },
    completed: { icon: "✓", className: "text-green-400" },
    error: { icon: "✕", className: "text-red-400" },
  };

  const config = statusConfig[status];

  return (
    <span className={`text-sm ${config.className}`} title={label}>
      {config.icon}
    </span>
  );
}

interface LiveIndicatorProps {
  active?: boolean;
  label?: string;
}

export function LiveIndicator({
  active = true,
  label = "Live",
}: LiveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-300 rounded-full">
      <StatusDot status="success" size="sm" animated={active} />
      <span className="text-xs font-semibold text-green-700">{label}</span>
    </div>
  );
}

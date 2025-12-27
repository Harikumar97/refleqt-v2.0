/**
 * Empty State Component
 * Consistent empty state display across pages
 */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-lg">
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

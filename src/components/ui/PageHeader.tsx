/**
 * Page Header Component
 * Consistent header for all portal pages
 * Following MOSIP Guideline #1: Detailed task information upfront
 */

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  info?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  info,
}: PageHeaderProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          {description && (
            <p className="text-sm text-gray-300">{description}</p>
          )}
        </div>
        {actions && <div className="ml-4">{actions}</div>}
      </div>
      {info && <div className="mt-4">{info}</div>}
    </div>
  );
}

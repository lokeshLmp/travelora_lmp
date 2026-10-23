import React from 'react';
import { Compass, RefreshCw } from 'lucide-react';

export default function EmptyState({
  title = 'No Results Found',
  description = "We couldn't find any matches for your search criteria. Try adjusting your filters or search terms.",
  actionText = 'Reset Filters',
  onAction
}) {
  return (
    <div className="card-premium p-12 text-center max-w-lg mx-auto flex flex-col items-center space-y-4 my-8 bg-white">
      <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
        <Compass className="w-8 h-8 text-secondary" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm">{description}</p>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-outline text-xs gap-1.5 font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

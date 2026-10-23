import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DemoBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
      <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
      <span>Demo Mode Active</span>
    </div>
  );
}

import React from 'react';
import { Compass } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-secondary animate-spin"></div>
        <Compass className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

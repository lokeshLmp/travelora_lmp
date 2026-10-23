import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="card-premium p-6 flex flex-col justify-between h-full bg-white relative">
      <Quote className="absolute right-5 top-5 w-8 h-8 text-slate-100 -z-0" />
      
      <div className="space-y-3 relative z-10">
        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
              }`}
            />
          ))}
          <span className="ml-2 text-xs font-bold text-slate-700">{review.rating}.0</span>
        </div>

        {/* Comment */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
          "{review.comment}"
        </p>
      </div>

      {/* User Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">{review.name}</h4>
              <CheckCircle className="w-3 h-3 text-emerald-500" title="Verified Traveler" />
            </div>
            <p className="text-[11px] text-slate-400">{review.destination}</p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
      </div>
    </div>
  );
}

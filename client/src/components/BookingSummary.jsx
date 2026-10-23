import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { ShieldCheck, Tag, Info } from 'lucide-react';

export default function BookingSummary({ calculation, promoCode, onApplyPromo, promoError, promoSuccess }) {
  const {
    basePrice,
    travellerCount,
    baseSubtotal,
    roomCost,
    insuranceCost,
    subtotal,
    taxes,
    serviceFee,
    discount,
    total
  } = calculation;

  return (
    <div className="card-premium p-6 bg-white space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Price Breakdown</h3>
        <span className="text-xs font-semibold text-secondary bg-secondary-light px-2.5 py-0.5 rounded-full">
          Transparent Pricing
        </span>
      </div>

      <div className="space-y-3 text-xs sm:text-sm text-slate-600">
        {/* Package Rate */}
        <div className="flex justify-between items-center">
          <span>
            Package Rate ({formatCurrency(basePrice)} × {travellerCount} {travellerCount > 1 ? 'travellers' : 'traveller'})
          </span>
          <span className="font-semibold text-slate-800">{formatCurrency(baseSubtotal)}</span>
        </div>

        {/* Accommodation Upgrade */}
        {roomCost > 0 && (
          <div className="flex justify-between items-center">
            <span>Room / Hotel Upgrade</span>
            <span className="font-semibold text-slate-800">+{formatCurrency(roomCost)}</span>
          </div>
        )}

        {/* Travel Insurance */}
        {insuranceCost > 0 && (
          <div className="flex justify-between items-center">
            <span>Comprehensive Travel Insurance</span>
            <span className="font-semibold text-slate-800">+{formatCurrency(insuranceCost)}</span>
          </div>
        )}

        {/* GST / Taxes */}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            Goods & Services Tax (12% GST)
            <Info className="w-3 h-3 text-slate-400 cursor-help" title="Standard Government Tax" />
          </span>
          <span className="font-semibold text-slate-800">{formatCurrency(taxes)}</span>
        </div>

        {/* Platform Service Fee */}
        <div className="flex justify-between items-center">
          <span>Platform Convenience Fee</span>
          <span className="font-semibold text-slate-800">{formatCurrency(serviceFee)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Promo Discount Applied
            </span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      {/* Promo Code Input (if handler provided) */}
      {onApplyPromo && (
        <div className="pt-2">
          <form onSubmit={onApplyPromo} className="flex gap-2">
            <input
              type="text"
              name="promo"
              placeholder="Promo code (e.g. TRAVEL500)"
              className="input-field !py-1.5 text-xs uppercase uppercase-placeholder"
              defaultValue={promoCode}
            />
            <button type="submit" className="btn-outline !py-1.5 !px-3 text-xs shrink-0 font-semibold">
              Apply
            </button>
          </form>
          {promoSuccess && (
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ {promoSuccess}</p>
          )}
          {promoError && (
            <p className="text-[11px] text-red-500 font-semibold mt-1">✕ {promoError}</p>
          )}
        </div>
      )}

      {/* Total Amount */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Final Total Payable</span>
            <span className="text-[11px] text-emerald-600 font-semibold">All taxes & fees included</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
        <span>100% Safe & Secure Payment with instant confirmation voucher</span>
      </div>
    </div>
  );
}

import React from 'react';
import { Input } from "@/components/ui/input";

export default function SSNInput({ value, onChange, isValid, error, isProcessing, isSubscribed = true }) {
  const formatSSN = (val) => {
    const numbers = val.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  const handleChange = (e) => {
    const formatted = formatSSN(e.target.value);
    onChange(formatted);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-blue-400 via-gray-400 to-blue-500 bg-[length:200%_auto] animate-gradient opacity-0 focus-within:opacity-100 transition-opacity duration-300">
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9-]*"
            value={value}
            onChange={handleChange}
            placeholder="000-00-0000"
            maxLength={11}
            autoComplete="off"
            disabled={isProcessing}
            readOnly={!isSubscribed && value.length === 11}
            className="h-16 text-xl font-mono tracking-[0.3em] text-center bg-[hsl(0,0%,9%)] border-0 text-white placeholder:text-gray-700 rounded-xl disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <Input
            type="text"
            value={value}
            tabIndex={-1}
            disabled
            className="h-16 text-xl font-mono tracking-[0.3em] text-center bg-white/5 border-white/10 text-white placeholder:text-gray-700 rounded-xl opacity-0 peer-focus:opacity-0"
          />
        </div>
        
        {value.length === 11 && !isProcessing && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {isValid ? (
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
            )}
          </div>
        )}
        
        {isProcessing && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {!value && !error && (
        <div className="text-center">
          <p className="text-xs text-gray-600">
            Type all 9 digits — analysis runs automatically
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <span>{error}</span>
        </div>
      )}

      {value.length > 0 && !error && (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <button onClick={handleClear} className="hover:text-white transition-colors">
            Clear
          </button>
          <div className="flex items-center gap-1.5">
            <span>Encrypted</span>
          </div>
        </div>
      )}
    </div>
  );
}
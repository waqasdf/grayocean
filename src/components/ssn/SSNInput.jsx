import React from "react";
import { Input } from "@/components/ui/input";

export default function SSNInput({
  value,
  onChange,
  isValid,
  error,
  isProcessing,
  isSubscribed = true,
}) {
  const formatSSN = (val) => {
    const numbers = val.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  const borderColor = error
    ? "var(--go-error-border)"
    : value.length === 11 && isValid
      ? "var(--go-success-border)"
      : "var(--go-input-border)";

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          type="tel"
          inputMode="numeric"
          pattern="[0-9-]*"
          value={value}
          onChange={(e) => onChange(formatSSN(e.target.value))}
          placeholder="000-00-0000"
          maxLength={11}
          autoComplete="off"
          disabled={isProcessing}
          readOnly={!isSubscribed && value.length === 11}
          className="h-12 text-[16px] font-mono tracking-[0.2em] text-center rounded-lg border focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 transition-[border-color,box-shadow] duration-200"
          style={{
            background: "var(--go-input-bg)",
            borderColor,
            color: "var(--go-input-text)",
            boxShadow:
              value.length === 11 && isValid && !error
                ? "0 0 0 3px rgba(76, 183, 130, 0.15)"
                : undefined,
          }}
        />

        {value.length === 11 && !isProcessing && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: isValid ? "var(--go-success)" : "var(--go-error)" }}
            />
          </div>
        )}

        {isProcessing && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div className="go-app-spinner" />
          </div>
        )}
      </div>

      {!value && !error && (
        <p className="text-center text-[14px]" style={{ color: "var(--go-text-muted)" }}>
          Type all 9 digits — analysis runs automatically
        </p>
      )}

      {error && (
        <div
          className="text-center text-[14px] rounded-xl px-4 py-2.5"
          style={{
            color: "var(--go-error)",
            background: "var(--go-error-fill)",
            border: "1px solid var(--go-error-border)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { CURRENCY_SYMBOLS } from "@/config/constants";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value?: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      currency = "TRY",
      placeholder = "0.00",
      disabled = false,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const upper = currency.toUpperCase();
    const symbol = CURRENCY_SYMBOLS[upper] ?? upper;

    return (
      <div className={cn("relative", className)}>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          {symbol}
        </span>
        <Input
          ref={ref}
          id={id}
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-8 tabular-nums"
          {...rest}
        />
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

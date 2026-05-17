import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  fromDate,
  toDate,
  className,
  id,
}: DatePickerProps) {
  const dateMatchers: Array<{ before?: Date; after?: Date }> = [];
  if (fromDate) dateMatchers.push({ before: fromDate });
  if (toDate) dateMatchers.push({ after: toDate });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={dateMatchers.length > 0 ? dateMatchers : undefined}
          startMonth={fromDate}
          endMonth={toDate}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

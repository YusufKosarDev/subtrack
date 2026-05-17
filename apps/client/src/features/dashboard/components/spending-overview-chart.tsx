import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import type { MonthlyProjectionEntry } from "@/lib/analytics";

interface SpendingOverviewChartProps {
  data: MonthlyProjectionEntry[];
  currency: string;
  className?: string;
}

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function SpendingOverviewChart({
  data,
  currency,
  className,
}: SpendingOverviewChartProps) {
  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          className="stroke-border opacity-30"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          width={60}
          tickFormatter={(value: number) =>
            formatCurrencyCompact(value, currency)
          }
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          content={
            <ChartTooltipContent
              hideLabel={false}
              formatter={(value) => formatCurrency(Number(value), currency)}
            />
          }
        />
        <Bar
          dataKey="total"
          fill="var(--chart-1)"
          radius={[8, 8, 0, 0]}
          maxBarSize={64}
        />
      </BarChart>
    </ChartContainer>
  );
}

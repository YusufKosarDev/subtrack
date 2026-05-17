import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
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
  const average =
    data.length === 0
      ? 0
      : data.reduce((sum, d) => sum + d.total, 0) / data.length;

  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart
        data={data}
        margin={{ top: 16, right: 12, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="spendingBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.3} />
          </linearGradient>
        </defs>
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
        {average > 0 && (
          <ReferenceLine
            y={average}
            stroke="var(--primary)"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{
              value: `avg ${formatCurrencyCompact(average, currency)}`,
              position: "insideTopRight",
              fill: "var(--muted-foreground)",
              fontSize: 11,
            }}
          />
        )}
        <Bar
          dataKey="total"
          fill="url(#spendingBarGradient)"
          radius={[8, 8, 0, 0]}
          maxBarSize={64}
          animationDuration={700}
          animationBegin={50}
        />
      </BarChart>
    </ChartContainer>
  );
}

import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format";
import { getCategoryColor } from "@/config/chart-colors";
import type { CategoryBreakdownEntry } from "@/lib/analytics";

interface CategoryBreakdownChartProps {
  data: CategoryBreakdownEntry[];
  currency: string;
  className?: string;
  maxCategories?: number;
}

interface PieEntry {
  category: string;
  total: number;
  count: number;
  fill: string;
}

export function CategoryBreakdownChart({
  data,
  currency,
  className,
  maxCategories = 6,
}: CategoryBreakdownChartProps) {
  const { entries, total, config } = useMemo(() => {
    let top = data.slice(0, maxCategories);
    const rest = data.slice(maxCategories);
    if (rest.length > 0) {
      const otherTotal = rest.reduce((s, e) => s + e.total, 0);
      const otherCount = rest.reduce((s, e) => s + e.count, 0);
      top = [...top, { category: "Other", total: otherTotal, count: otherCount }];
    }
    const sum = top.reduce((s, e) => s + e.total, 0);
    const colored: PieEntry[] = top.map((entry, idx) => ({
      ...entry,
      fill: getCategoryColor(idx),
    }));
    const cfg: ChartConfig = {};
    colored.forEach((entry) => {
      cfg[entry.category] = {
        label: entry.category,
        color: entry.fill,
      };
    });
    return { entries: colored, total: sum, config: cfg };
  }, [data, maxCategories]);

  return (
    <ChartContainer config={config} className={className}>
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name) => [
                formatCurrency(Number(value), currency),
                String(name),
              ]}
            />
          }
        />
        <Pie
          data={entries}
          dataKey="total"
          nameKey="category"
          innerRadius={75}
          outerRadius={130}
          paddingAngle={3}
          strokeWidth={2}
          animationBegin={50}
          animationDuration={600}
        >
          {entries.map((entry) => (
            <Cell key={entry.category} fill={entry.fill} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (
                viewBox &&
                typeof viewBox === "object" &&
                "cx" in viewBox &&
                "cy" in viewBox
              ) {
                const cx = Number(viewBox.cx);
                const cy = Number(viewBox.cy);
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={cx}
                      y={cy - 8}
                      className="fill-foreground text-xl font-bold tabular-nums"
                    >
                      {formatCurrency(total, currency)}
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 14}
                      className="fill-muted-foreground text-xs"
                    >
                      monthly
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="category" />}
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ChartContainer>
  );
}

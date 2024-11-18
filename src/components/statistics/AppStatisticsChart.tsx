import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

interface AppStatisticsChartProps {
  appStats: Array<{
    app: string;
    total: number;
    active: number;
    revenue: number;
  }> | null;
}

export const AppStatisticsChart = ({ appStats }: AppStatisticsChartProps) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Assinaturas por App</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ChartContainer
          config={{
            active: { theme: { light: "#22c55e", dark: "#22c55e" } },
            total: { theme: { light: "#64748b", dark: "#64748b" } },
          }}
        >
          <BarChart data={appStats || []}>
            <XAxis dataKey="app" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="active" name="Ativas" fill="var(--color-active)" />
            <Bar dataKey="total" name="Total" fill="var(--color-total)" />
          </BarChart>
        </ChartContainer>
      </div>
    </CardContent>
  </Card>
);
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  accentColor?: string;
}

export function StatCard({ label, value, icon: Icon, accentColor }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs uppercase tracking-wide">{label}</CardTitle>
        {Icon && (
          <Icon
            className={cn("h-4 w-4 text-muted-foreground")}
            style={accentColor ? { color: accentColor } : undefined}
          />
        )}
      </CardHeader>
      <CardContent>
        <p className="font-mono text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

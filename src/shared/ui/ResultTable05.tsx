
import { type FC } from "react";
import { cn } from "../utils";
import { formatPercent, formatUplift, formatPValue, formatNumber } from "../utils";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";

export interface ResultTable05Props {
  data: Record<string, unknown>;
  onAction?: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
  compact?: boolean;
  className?: string;
}

export const ResultTable05: FC<ResultTable05Props> = ({
  data, onAction, onSelect, selected = false, compact = false, className,
}) => {
  const id = String(data.id ?? "unknown");
  return (
    <Card
      className={cn("transition-all cursor-pointer hover:shadow-md", selected && "ring-2 ring-brand-500", className)}
      onClick={() => onSelect?.(id)}
      padding={!compact}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{String(data.name ?? data.title ?? id)}</p>
          <p className="mt-0.5 text-xs text-slate-500">{String(data.status ?? data.type ?? "")}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {data.uplift != null && (
            <span className={cn("text-sm font-semibold tabular-nums", Number(data.uplift) >= 0 ? "text-emerald-600" : "text-red-600")}>
              {formatUplift(Number(data.uplift))}
            </span>
          )}
          {data.pValue != null && <span className="text-xs text-slate-500">p={formatPValue(Number(data.pValue))}</span>}
          {data.status != null && (
            <Badge variant={data.status === "running" || data.status === "completed" ? "success" : data.status === "paused" ? "warning" : "default"}>
              {String(data.status)}
            </Badge>
          )}
        </div>
      </div>
      {!compact && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">{String(data.createdAt ?? "")}</span>
          {onAction && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onAction(id); }}>Manage</Button>}
        </div>
      )}
    </Card>
  );
};
export default ResultTable05;

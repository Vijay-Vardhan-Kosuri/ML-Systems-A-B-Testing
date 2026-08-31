import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Input, Badge, Spinner } from "@/shared/ui";
import { formatRelative } from "@/shared/utils";
import { fetchExperiments } from "@/services/experimentsService";

export function ExperimentsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["experiments", search],
    queryFn: () => fetchExperiments({ search: search || undefined, pageSize: 50 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Experiments</h1>
          <p className="text-sm text-slate-500">Create and manage A/B tests and ML experiments.</p>
        </div>
        <Button>New Experiment</Button>
      </div>
      <div className="max-w-sm">
        <Input placeholder="Search experiments..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {isLoading ? <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.data ?? []).map((exp) => (
            <Card key={exp.id} className="transition hover:shadow-md hover:border-brand-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{exp.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{exp.description}</p>
                </div>
                <Badge variant={exp.status === "running" ? "success" : exp.status === "paused" ? "warning" : exp.status === "completed" ? "info" : "default"}>
                  {exp.status}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-slate-500">Owner: {exp.ownerName}</p>
              <p className="text-xs text-slate-400">{formatRelative(exp.updatedAt)} · {exp.trafficPercent}% traffic</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {exp.tags.map((t) => <Badge key={t} variant="default">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

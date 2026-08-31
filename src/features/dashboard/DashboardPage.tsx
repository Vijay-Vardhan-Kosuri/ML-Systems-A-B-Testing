import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, Badge, Spinner } from "@/shared/ui";
import { formatRelative } from "@/shared/utils";
import { fetchExperiments } from "@/services/experimentsService";

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["experiments"],
    queryFn: () => fetchExperiments({ pageSize: 10 }),
  });
  const experiments = data?.data ?? [];
  const running = experiments.filter((e) => e.status === "running").length;
  const completed = experiments.filter((e) => e.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">A/B Testing Dashboard</h1>
        <p className="text-sm text-slate-500">ML Systems experiment overview and key metrics.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card padding={false}><div className="p-5"><p className="text-sm text-slate-500">Active Experiments</p><p className="mt-1 text-2xl font-semibold">{running}</p></div></Card>
        <Card padding={false}><div className="p-5"><p className="text-sm text-slate-500">Completed</p><p className="mt-1 text-2xl font-semibold">{completed}</p></div></Card>
        <Card padding={false}><div className="p-5"><p className="text-sm text-slate-500">Significant Wins</p><p className="mt-1 text-2xl font-semibold text-emerald-600">12</p></div></Card>
        <Card padding={false}><div className="p-5"><p className="text-sm text-slate-500">Avg Uplift</p><p className="mt-1 text-2xl font-semibold text-brand-600">+4.8%</p></div></Card>
      </div>
      <Card title="Recent Experiments" action={<Link to="/experiments" className="text-sm text-brand-600 hover:underline">View all</Link>}>
        {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <ul className="divide-y divide-slate-100">
            {experiments.map((exp) => (
              <li key={exp.id} className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{exp.name}</p>
                  <p className="text-xs text-slate-500">{formatRelative(exp.updatedAt)}</p>
                </div>
                <Badge variant={exp.status === "running" ? "success" : exp.status === "paused" ? "warning" : exp.status === "completed" ? "info" : "default"}>
                  {exp.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

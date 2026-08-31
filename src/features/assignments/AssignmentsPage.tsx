import { Card, Button } from "@/shared/ui";

export function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-sm text-slate-500">Manage assignments for ML A/B testing experiments.</p>
        </div>
        <Button>New</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} title={`Assignments Item ${i}`} description="Experiment platform controls.">
            <p className="text-sm text-slate-600">
              Production-ready assignments management for ML systems experiment platform.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartments, useCreateDepartment, useDeleteDepartment } from "@/hooks/use-departments";
import { Trash2, Plus } from "lucide-react";

export default function AdminDepartmentsPage() {
  const { data, isLoading } = useDepartments();
  const createDepartment = useCreateDepartment();
  const deleteDepartment = useDeleteDepartment();
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createDepartment.mutateAsync(name.trim());
    setName("");
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Delete this department? Users assigned to it will simply become unassigned — nothing else is deleted."
    );
    if (!confirmed) return;
    deleteDepartment.mutate(id);
  };

  return (
    <>
      <Topbar title="Departments" />

      <div className="space-y-4 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add department</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="e.g. Network Operations"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={createDepartment.isPending || !name.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All departments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)
            ) : data?.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No departments yet.</p>
            ) : (
              data?.data.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
                >
                  <span className="text-sm font-medium">{d.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(d.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
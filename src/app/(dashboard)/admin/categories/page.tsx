"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-tickets";
import { Trash2, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createCategory.mutateAsync({ name: name.trim() });
    setName("");
  };

  return (
    <>
      <Topbar title="Categories" />

      <div className="space-y-4 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add category</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="e.g. VPN & Remote Access"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={createCategory.isPending || !name.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)
            ) : data?.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              data?.data.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
                >
                  <span className="text-sm font-medium">{c.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteCategory.mutate(c.id)}
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

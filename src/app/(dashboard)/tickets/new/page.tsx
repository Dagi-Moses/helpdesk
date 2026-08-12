"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicketSchema, CreateTicketInput } from "@/lib/validations/ticket";
import { useCategories, useCreateTicket } from "@/hooks/use-tickets";

export default function NewTicketPage() {
  const router = useRouter();
  const { data: categoriesRes } = useCategories();
  const createTicket = useCreateTicket();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  const onSubmit = async (data: CreateTicketInput) => {
    const res = await createTicket.mutateAsync(data);
    router.push(`/tickets/${res.data.id}`);
  };

  return (
    <>
      <Topbar title="New ticket" />

      <div className="p-6">
        <Card className="mx-auto max-w-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Briefly describe the issue" {...register("title")} />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="What's happening? Include steps to reproduce, error messages, or anything else that'll help support resolve this quickly."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesRes?.data.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createTicket.isPending}>
                {createTicket.isPending ? "Submitting…" : "Submit ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

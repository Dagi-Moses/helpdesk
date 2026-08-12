"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers, useCreateUser, useDeactivateUser } from "@/hooks/use-users";
import { Role } from "@/lib/types";
import { initials } from "@/lib/utils";
import { UserPlus } from "lucide-react";

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export default function AdminUsersPage() {
  const { data, isLoading } = useUsers();
  const createUser = useCreateUser();
  const deactivateUser = useDeactivateUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({ defaultValues: { role: "SUPPORT_AGENT" } });

  const onSubmit = async (data: CreateUserForm) => {
    await createUser.mutateAsync(data);
    reset();
    setDialogOpen(false);
  };

  return (
    <>
      <Topbar title="Users" />

      <div className="space-y-4 p-6">
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                New user
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create user</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" {...register("firstName", { required: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" {...register("lastName", { required: true })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Temporary password</Label>
                  <Input id="password" type="password" {...register("password", { required: true, minLength: 8 })} />
                  {errors.password && <p className="text-xs text-destructive">At least 8 characters</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUPPORT_AGENT">Support agent</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createUser.isPending}>
                  {createUser.isPending ? "Creating…" : "Create user"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-14" />)
            ) : (
              data?.data.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials(u.firstName, u.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{u.role}</Badge>
                    {!u.isActive ? (
                      <Badge variant="secondary">Inactive</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deactivateUser.mutate(u.id)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

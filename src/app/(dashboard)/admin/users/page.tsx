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
import {
  useUsers,
  useCreateUser,
  useDeactivateUser,
  useReactivateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users";
import { useDepartments } from "@/hooks/use-departments";
import { useAuth } from "@/lib/auth-context";
import { Role, User } from "@/lib/types";
import { initials } from "@/lib/utils";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";

const NO_DEPARTMENT = "__none__";

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  departmentId?: string;
}

interface EditUserForm {
  firstName: string;
  lastName: string;
  role: Role;
  departmentId: string;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { data, isLoading } = useUsers();
  const { data: departmentsRes } = useDepartments();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deactivateUser = useDeactivateUser();
  const reactivateUser = useReactivateUser();
  const deleteUser = useDeleteUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const createForm = useForm<CreateUserForm>({ defaultValues: { role: "SUPPORT_AGENT" } });
  const editForm = useForm<EditUserForm>();

  const onCreate = async (data: CreateUserForm) => {
    await createUser.mutateAsync({
       ...data,
      departmentId: data.departmentId === NO_DEPARTMENT ? undefined : data.departmentId ,
     
    });
    createForm.reset();
    setCreateOpen(false);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    editForm.reset({
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      departmentId: u.departmentId ?? NO_DEPARTMENT,
    });
  };

  const onEdit = async (data: EditUserForm) => {
    if (!editingUser) return;
    await updateUser.mutateAsync({
      id: editingUser.id,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        departmentId: data.departmentId === NO_DEPARTMENT ? null : data.departmentId,
      },
    });
    setEditingUser(null);
  };

  const handleDelete = async (u: User) => {
    const confirmed = window.confirm(
      `Permanently delete ${u.firstName} ${u.lastName}? This can't be undone, and only works if they have no ticket history.`
    );
    if (!confirmed) return;
    try {
      await deleteUser.mutateAsync(u.id);
    } catch (err) {
      // useDeleteUser already toasts the error; nothing else to do here.
    }
  };

  return (
    <>
      <Topbar title="Users" />

      <div className="space-y-4 p-6">
        <div className="flex justify-end">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
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
              <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" {...createForm.register("firstName", { required: true })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" {...createForm.register("lastName", { required: true })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...createForm.register("email", { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...createForm.register("password", { required: true, minLength: 8 })}
                  />
                  {createForm.formState.errors.password && (
                    <p className="text-xs text-destructive">At least 8 characters</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Controller
                      control={createForm.control}
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
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Controller
                      control={createForm.control}
                      name="departmentId"
                      render={({ field }) => (
                        <Select value={field.value ?? NO_DEPARTMENT} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={NO_DEPARTMENT}>None</SelectItem>
                            {departmentsRes?.data.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
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
              data?.data.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
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
                          {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {u.email} {u.department && `· ${u.department.name}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{u.role}</Badge>
                      {!u.isActive && <Badge variant="secondary">Inactive</Badge>}

                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(u)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      {!isSelf && (
                        <>
                          {u.isActive ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deactivateUser.mutate(u.id)}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => reactivateUser.mutate(u.id)}>
                              Reactivate
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(u)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-firstName">First name</Label>
                <Input id="edit-firstName" {...editForm.register("firstName", { required: true })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-lastName">Last name</Label>
                <Input id="edit-lastName" {...editForm.register("lastName", { required: true })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Controller
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                        <SelectItem value="SUPPORT_AGENT">Support agent</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Controller
                  control={editForm.control}
                  name="departmentId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NO_DEPARTMENT}>None</SelectItem>
                        {departmentsRes?.data.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}



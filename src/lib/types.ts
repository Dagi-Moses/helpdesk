export type Role = "EMPLOYEE" | "SUPPORT_AGENT" | "ADMIN";

export type TicketStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING_FOR_USER"
  | "RESOLVED"
  | "CLOSED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  departmentId?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Comment {
  id: string;
  body: string;
  ticketId: string;
  authorId: string;
  author: Pick<User, "id" | "firstName" | "lastName" | "role">;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketHistoryEntry {
  id: string;
  ticketId: string;
  userId: string;
  user: Pick<User, "id" | "firstName" | "lastName">;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  category: Category | null;
  createdBy: Pick<User, "id" | "firstName" | "lastName" | "email">;
  assignedTo: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  history?: TicketHistoryEntry[];
  attachments?: Attachment[];
}

export interface EmployeeStats {
  total: number;
  open: number;
  resolved: number;
}

export interface AgentStats {
  assigned: number;
  critical: number;
  pending: number;
  completedToday: number;
}

export interface AdminStats {
  total: number;
  open: number;
  resolved: number;
  closed: number;
}

export type DashboardStats = EmployeeStats | AgentStats | AdminStats;

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page?: number; limit?: number; total?: number };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

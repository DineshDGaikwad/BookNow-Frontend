export interface ApprovalRequest {
  id: string;
  approvalType: 'Venue' | 'Event' | 'Show' | 'Organizer';
  targetEntityId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  payloadSnapshot: string;
  remarks?: string;
  reviewedByAdminId?: string;
  requestedByUserId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  actionType: 'UserSuspended' | 'UserActivated' | 'RoleChanged' | 'ApprovalGranted' | 'ApprovalRejected' | 'SystemSettingUpdated';
  targetEntity: string;
  targetEntityId: string;
  description: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  oldValues?: string;
  newValues?: string;
  actorId: string;
  actorType: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  isEditable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  pendingApprovals: number;
  totalUsers: number;
  activeEvents: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    events: number;
    revenue: number;
  };
}

export interface ApprovalActionRequest {
  adminId: string;
  remarks?: string;
}

export interface AdminUser {
  userId: string;
  email: string;
  name?: string;
  role: string;
  accountStatus: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  businessName?: string;
  phoneNumber?: string;
  city?: string;
}

export interface PaginatedUsers {
  users: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
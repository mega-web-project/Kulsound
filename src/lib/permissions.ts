
export type Permission = 
  | 'view_overview'
  | 'manage_users'
  | 'manage_tracks'
  | 'manage_verifications'
  | 'manage_reports'
  | 'manage_settings'
  | 'view_revenue';

export type AdminRoleType = 'super_admin' | 'moderator' | 'support' | 'admin';

export interface RolePermissions {
  role: AdminRoleType;
  permissions: Permission[];
}

export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRoleType, Permission[]> = {
  super_admin: [
    'view_overview',
    'manage_users',
    'manage_tracks',
    'manage_verifications',
    'manage_reports',
    'manage_settings',
    'view_revenue'
  ],
  moderator: [
    'view_overview',
    'manage_tracks',
    'manage_reports'
  ],
  support: [
    'view_overview',
    'manage_users',
    'manage_verifications'
  ],
  admin: [
    'view_overview',
    'manage_users',
    'manage_tracks',
    'manage_verifications',
    'manage_reports'
  ]
};

export const hasPermission = (role: AdminRoleType, permission: Permission): boolean => {
  return DEFAULT_ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

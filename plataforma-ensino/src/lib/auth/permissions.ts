import { User } from '@/types'

export type Permission = 
  | 'admin.view'
  | 'admin.users.view'
  | 'admin.users.create'
  | 'admin.users.edit'
  | 'admin.users.delete'
  | 'admin.courses.view'
  | 'admin.courses.create'
  | 'admin.courses.edit'
  | 'admin.courses.delete'
  | 'admin.courses.publish'
  | 'admin.enrollments.view'
  | 'admin.enrollments.create'
  | 'admin.enrollments.edit'
  | 'admin.enrollments.delete'
  | 'admin.reports.view'
  | 'admin.settings.view'
  | 'admin.settings.edit'
  | 'admin.settings.manage'
  | 'instructor.courses.view'
  | 'instructor.courses.create'
  | 'instructor.courses.edit'
  | 'instructor.lessons.create'
  | 'instructor.lessons.edit'
  | 'instructor.lessons.delete'
  | 'student.courses.view'
  | 'student.progress.view'
  | 'student.progress.update'

export const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'admin.view',
    'admin.users.view',
    'admin.users.create',
    'admin.users.edit',
    'admin.users.delete',
    'admin.courses.view',
    'admin.courses.create',
    'admin.courses.edit',
    'admin.courses.delete',
    'admin.courses.publish',
    'admin.enrollments.view',
    'admin.enrollments.create',
    'admin.enrollments.edit',
    'admin.enrollments.delete',
    'admin.reports.view',
    'admin.settings.view',
    'admin.settings.edit',
    'instructor.courses.view',
    'instructor.courses.create',
    'instructor.courses.edit',
    'instructor.lessons.create',
    'instructor.lessons.edit',
    'instructor.lessons.delete',
    'student.courses.view',
    'student.progress.view',
    'student.progress.update',
  ],
  instructor: [
    'instructor.courses.view',
    'instructor.courses.create',
    'instructor.courses.edit',
    'instructor.lessons.create',
    'instructor.lessons.edit',
    'instructor.lessons.delete',
    'student.courses.view',
    'student.progress.view',
  ],
  student: [
    'student.courses.view',
    'student.progress.view',
    'student.progress.update',
  ],
}

// Server-side functions (only for server components)
export async function getCurrentUser(): Promise<User | null> {
  const { createClient } = await import('../supabase/server')
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

// Client-side functions (only for client components)
export async function getCurrentUserClient(): Promise<User | null> {
  const { createClient } = await import('../supabase/client')
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  
  const userPermissions = rolePermissions[user.role] || []
  return userPermissions.includes(permission)
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  
  const userPermissions = rolePermissions[user.role] || []
  return permissions.some(permission => userPermissions.includes(permission))
}

export function requirePermission(user: User | null, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Insufficient permissions: ${permission}`)
  }
}

export function requireRole(user: User | null, role: string): void {
  if (!user || user.role !== role) {
    throw new Error(`Insufficient role: ${role}`)
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

export function isInstructor(user: User | null): boolean {
  return user?.role === 'instructor'
}

export function isStudent(user: User | null): boolean {
  return user?.role === 'student'
}

export function canAccessAdminPanel(user: User | null): boolean {
  return hasPermission(user, 'admin.view')
}

export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, 'admin.users.view')
}

export function canManageCourses(user: User | null): boolean {
  return hasPermission(user, 'admin.courses.view')
}

export function canViewReports(user: User | null): boolean {
  return hasPermission(user, 'admin.reports.view')
}

export function canEditSettings(user: User | null): boolean {
  return hasPermission(user, 'admin.settings.edit')
}
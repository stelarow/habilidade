'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Menu, 
  ChevronRight, 
  Home, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  User,
  LogOut,
  Trophy,
  Star
} from 'lucide-react'

/**
 * Interface definitions for header components
 */
export interface Breadcrumb {
  label: string
  href?: string
  isActive: boolean
}

export interface User {
  name: string
  avatar?: string
  level: number
  xp: number
  email?: string
}

export interface EnhancedHeaderProps {
  breadcrumbs: Breadcrumb[]
  globalProgress: number
  user: User
  onSidebarToggle?: () => void
  onProfileClick: () => void
  onSettingsClick: () => void
  onThemeToggle: () => void
  isDarkMode?: boolean
  notifications?: number
  className?: string
}

/**
 * Breadcrumb navigation component
 */
const BreadcrumbNavigation: React.FC<{
  breadcrumbs: Breadcrumb[]
  className?: string
}> = ({ breadcrumbs, className }) => {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 min-w-0", className)}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          
          {breadcrumb.href ? (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto p-1 font-medium text-sm hover:text-primary",
                breadcrumb.isActive ? "text-foreground" : "text-muted-foreground"
              )}
              asChild
            >
              <a href={breadcrumb.href}>
                {breadcrumb.label}
              </a>
            </Button>
          ) : (
            <span
              className={cn(
                "text-sm font-medium px-1 truncate",
                breadcrumb.isActive ? "text-foreground" : "text-muted-foreground"
              )}
              aria-current={breadcrumb.isActive ? "page" : undefined}
            >
              {breadcrumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

/**
 * User profile dropdown component
 */
const UserProfileDropdown: React.FC<{
  user: User
  notifications?: number
  onProfileClick: () => void
  onSettingsClick: () => void
  onThemeToggle: () => void
  isDarkMode?: boolean
}> = ({ 
  user, 
  notifications = 0, 
  onProfileClick, 
  onSettingsClick, 
  onThemeToggle,
  isDarkMode = true 
}) => {
  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <Button
        variant="ghost"
        size="sm"
        className="relative h-9 w-9 p-0"
        aria-label={`Notifications${notifications > 0 ? ` (${notifications})` : ''}`}
      >
        <Bell className="h-4 w-4" />
        {notifications > 0 && (
          <Badge 
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
          >
            {notifications > 99 ? '99+' : notifications}
          </Badge>
        )}
      </Button>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onThemeToggle}
        className="h-9 w-9 p-0"
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 px-2 py-1 hover:bg-accent"
            aria-label="User menu"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="hidden md:flex flex-col items-start min-w-0">
                <span className="text-sm font-medium truncate max-w-32">
                  {user.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-warning fill-current" />
                  <span>Level {user.level}</span>
                </div>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              {user.email && (
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Trophy className="h-3 w-3 text-warning" />
                <span className="text-xs">Level {user.level} • {user.xp} XP</span>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/**
 * Progress bar with additional information
 */
const GlobalProgressBar: React.FC<{
  progress: number
  className?: string
}> = ({ progress, className }) => {
  return (
    <div className={cn("flex-1 max-w-md mx-4", className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">
          Course Progress
        </span>
        <span className="text-xs font-medium text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress 
        value={progress} 
        className="h-2"
        aria-label={`Course progress: ${Math.round(progress)}% complete`}
      />
    </div>
  )
}

/**
 * Main enhanced header component
 */
export const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  breadcrumbs,
  globalProgress,
  user,
  onSidebarToggle,
  onProfileClick,
  onSettingsClick,
  onThemeToggle,
  isDarkMode = true,
  notifications = 0,
  className
}) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      role="banner"
    >
      {/* Main header row */}
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Left: Sidebar toggle + Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {onSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="h-9 w-9 p-0 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <BreadcrumbNavigation
            breadcrumbs={breadcrumbs}
            className="hidden sm:flex flex-1 min-w-0"
          />
          
          {/* Mobile: Show only current page */}
          <div className="sm:hidden flex-1 min-w-0">
            {breadcrumbs.find(b => b.isActive) && (
              <h1 className="text-sm font-medium truncate">
                {breadcrumbs.find(b => b.isActive)?.label}
              </h1>
            )}
          </div>
        </div>

        {/* Right: Progress + User actions */}
        <div className="flex items-center gap-4">
          <GlobalProgressBar 
            progress={globalProgress}
            className="hidden lg:flex"
          />
          
          <UserProfileDropdown
            user={user}
            notifications={notifications}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onThemeToggle={onThemeToggle}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="lg:hidden border-t border-border px-4 py-2">
        <GlobalProgressBar progress={globalProgress} />
      </div>
    </header>
  )
}

export default EnhancedHeader
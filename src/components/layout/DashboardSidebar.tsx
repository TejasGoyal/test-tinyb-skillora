import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/ui/logo';
import { useBranding } from '@/contexts/BrandingContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar,
  Settings,
  GraduationCap,
  UserCheck,
  FileText,
  School,
  MessageCircle
} from 'lucide-react';

const adminItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Teachers', url: '/admin/teachers', icon: UserCheck },
  { title: 'Students', url: '/admin/students', icon: GraduationCap },
  { title: 'Parents', url: '/admin/parents', icon: Users },
  { title: 'Classes', url: '/admin/classes', icon: School },
  { title: 'Subjects', url: '/admin/subjects', icon: BookOpen },
  { title: 'Chat with AI', url: '/chat', icon: MessageCircle },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const teacherItems = [
  { title: 'Dashboard', url: '/teacher/dashboard', icon: LayoutDashboard },
  { title: 'My Classes', url: '/teacher/classes', icon: School },
  { title: 'Students', url: '/teacher/students', icon: GraduationCap },
  { title: 'Schedule', url: '/teacher/schedule', icon: Calendar },
  { title: 'Reports', url: '/teacher/reports', icon: FileText },
  { title: 'Chat with AI', url: '/chat', icon: MessageCircle },
];

const parentItems = [
  { title: 'Dashboard', url: '/parent/dashboard', icon: LayoutDashboard },
  { title: 'My Children', url: '/parent/children', icon: GraduationCap },
  { title: 'Schedule', url: '/parent/schedule', icon: Calendar },
  { title: 'Reports', url: '/parent/reports', icon: FileText },
  { title: 'Chat with AI', url: '/chat', icon: MessageCircle },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { tenant } = useBranding();
  const { profile } = useAuth();
  
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';
  
  const getMenuItems = () => {
    switch (profile?.role) {
      case 'admin':
        return adminItems;
      case 'teacher':
        return teacherItems;
      case 'parent':
        return parentItems;
      default:
        return [];
    }
  };
  
  const menuItems = getMenuItems();
  const isActive = (path: string) => currentPath === path;
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* School Header */}
        <div className="p-4">
           {/* border-b border-sidebar-border"> */}
          <div className="flex items-center gap-3">
            <Logo 
              src={tenant?.logo_url} 
              size={isCollapsed ? 'sm' : 'md'}
              fallback={tenant?.school_name?.substring(0, 2).toUpperCase() || 'SX'}
            />
            {!isCollapsed && tenant && (
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-sidebar-foreground truncate">
                  {tenant.school_name}
                </h2>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {profile?.role} Portal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
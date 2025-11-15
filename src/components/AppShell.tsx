'use client';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo, navIcons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, Bell, LogOut, LogIn } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/data-ingestion', label: 'Data Ingestion', icon: 'DataManager' },
  { href: '/taxonomy', label: 'Taxonomy', icon: 'Taxonomy' },
  { href: '/trips', label: 'Trips', icon: 'Trips' },
  { href: '/model-hub', label: 'Model Hub', icon: 'ModelHub' },
  { href: '/analytics', label: 'Analytics', icon: 'Analytics' },
  { href: '/simulation-lab', label: 'Simulation Lab', icon: 'SimulationLab' },
  { href: '/policy-os', label: 'Policy OS', icon: 'Policy' },
  { href: '/responsible-ai', label: 'Responsible AI', icon: 'Bias' },
  { href: '/security', label: 'Security', icon: 'Security' },
];

const settingsNav = [
  { href: '/settings', label: 'Settings', icon: 'Settings' },
  { href: '/support', label: 'Support', icon: 'Support' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  React.useEffect(() => {
    // This effect only handles redirecting unauthenticated users.
    // The post-login redirect is now handled inside AuthForm.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
    router.push('/login');
  };

  if (isUserLoading || !user) {
    // This loading state is crucial for protecting routes.
    // It prevents a flash of content before the auth check completes.
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  const activeNavItems = navItems.filter((item) => {
    // Special handling for the combined "Responsible AI" group
    if (pathname.startsWith('/responsible-ai') || pathname.startsWith('/security')) {
      // Hide the individual 'Security' link when in this group
      return item.href !== '/security';
    }
    return true;
  });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {activeNavItems.map((item) => {
              const Icon = navIcons[item.icon as keyof typeof navIcons];
              // The combined item is active if we are on any of its child routes
              const isActive =
                item.href === '/responsible-ai'
                  ? pathname.startsWith('/responsible-ai') || pathname.startsWith('/security')
                  : pathname.startsWith(item.href);

              const label =
                item.href === '/responsible-ai' &&
                (pathname.startsWith('/responsible-ai') || pathname.startsWith('/security'))
                  ? 'Responsible AI'
                  : item.label;

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    href={item.href}
                    isActive={isActive}
                    asChild
                    tooltip={label}
                  >
                    <a href={item.href}>
                      <Icon />
                      <span>{label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
          <SidebarSeparator />
          <SidebarMenu>
            {settingsNav.map((item) => {
              const Icon = navIcons[item.icon as keyof typeof navIcons];
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    href={item.href}
                    isActive={pathname.startsWith(item.href)}
                    asChild
                    tooltip={item.label}
                  >
                    <a href={item.href}>
                      <Icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          <SidebarSeparator />
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`}
                  alt={user.email || 'user'}
                />
                <AvatarFallback>
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                <span className="font-medium text-sidebar-foreground truncate">
                  {user.displayName || 'User'}
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="group-data-[collapsible=icon]:hidden h-8 w-8"
            >
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

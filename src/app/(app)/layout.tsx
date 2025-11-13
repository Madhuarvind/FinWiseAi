'use client';
import { usePathname } from 'next/navigation';
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
import { Settings, Bell } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/data-ingestion', label: 'Data Ingestion', icon: 'DataManager' },
  { href: '/taxonomy', label: 'Taxonomy', icon: 'Taxonomy' },
  { href: '/model-hub', label: 'Model Hub', icon: 'ModelHub' },
  { href: '/analytics', label: 'Analytics', icon: 'Analytics' },
  { href: '/responsible-ai', label: 'Responsible AI', icon: 'Bias' },
  { href: '/security', label: 'Security', icon: 'Security' },
];

const settingsNav = [
    { href: '/settings', label: 'Settings', icon: 'Settings' },
    { href: '/support', label: 'Support', icon: 'Support' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
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
             <div className="flex items-center gap-3 p-2">
                <Avatar className="h-9 w-9">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                    <span className="font-medium text-sidebar-foreground">User</span>
                    <span className="text-muted-foreground text-xs">user@finwise.ai</span>
                </div>
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

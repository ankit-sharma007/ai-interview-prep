'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Bot } from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 shrink-0 text-primary" />
            <span className="text-xl font-headline font-bold group-data-[collapsible=icon]:hidden">
              InterviewAce
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip={{ content: 'Practice' }}
              >
                <Link href="/">
                  <Home />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Practice
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip={{ content: 'Settings' }}
              >
                <Link href="/settings">
                  <Settings />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Settings
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <div className="flex items-center justify-between border-b p-2 md:justify-end md:border-b-0 md:p-4">
          <SidebarTrigger className="md:hidden" />
        </div>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import * as React from "react";
import { NavLink } from "react-router-dom";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboardIcon,
  UsersIcon,
  DatabaseIcon,
  FileTextIcon,
  TicketIcon,
  IndianRupeeIcon,
  UserCheckIcon,
  CommandIcon,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
  { title: "Users", url: "/users", icon: UsersIcon },
  { title: "Pandits", url: "/pandits", icon: UserCheckIcon },
  { title: "Mandirs", url: "/mandirs", icon: DatabaseIcon },
  { title: "Pujas", url: "/pujas", icon: FileTextIcon },
  { title: "Bookings", url: "/bookings", icon: TicketIcon },
  { title: "Coupons", url: "/coupons", icon: TicketIcon },
  { title: "Finance", url: "/finance", icon: IndianRupeeIcon },
];

const user = {
  name: "Admin",
  email: "admin@example.com",
  avatar: "/avatars/admin.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/" className="flex items-center gap-2">
                <CommandIcon className="size-5" />
                <span className="text-base font-semibold">Bhola Admin</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
                        isActive
                          ? "bg-muted font-semibold text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      }`
                    }
                  >
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

import * as React from "react";
import { useLocation, Link } from "react-router-dom";

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
  name: "Bhola Admin",
  email: "admin@bholaadmin.com",
  avatar: "/logo-transparent.png",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center h-18 gap-2">
                <img
                  src="/logo-transparent.png"
                  alt="Bhola Admin"
                  className="size-16 object-contain bg-neutral-800 rounded-lg dark:bg-white"
                />
                <span className="text-base font-semibold">Bhola Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.url === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link to={item.url} className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
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

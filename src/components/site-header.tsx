import { useLocation } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("users")) return "Users";
    if (path.includes("pandits")) return "Pandits";
    if (path.includes("mandirs")) return "Mandirs";
    if (path.includes("pujas")) return "Pujas";
    if (path.includes("marketing")) return "Marketing";
    if (path.includes("bookings")) return "Bookings";
    if (path.includes("coupons")) return "Coupons";
    if (path.includes("finance")) return "Finance";

    return "Dashboard";
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b px-4 lg:px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <h1 className="text-base font-medium">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BanknoteArrowDown, BanknoteArrowUp, Columns3, Database, Home, LucideHome, Users } from "lucide-react";

const Menu = {
    dashboard:{
        name: "Dashboard",
        url: "/",
    },
    projects: [
      {
        name: "Laporan",
        url: "/laporan",
        icon: Database,
      },
      {
        name: "Rumah",
        url: "/rumah",
        icon: Home,
      },
      {
        name: "Penghuni",
        url: "/penghuni",
        icon: Users,
      },
      {
        name: "jenis-iuran",
        url: "/jenis-iuran",
        icon: Columns3,
      },
      {
        name: "Iuran",
        url: "/iuran",
        icon: BanknoteArrowUp,
      },
      {
        name: "Pengeluaran",
        url: "/pengeluaran",
        icon: BanknoteArrowDown,
      },
    ],
  }

const SidebarLayout = () => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center justify-center">
            <a href={Menu.dashboard.url} className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{Menu.dashboard.name}</h1>
            </a>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Fitur</SidebarGroupLabel>
          <SidebarMenu>
            {Menu.projects.map((project) => (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton asChild>
                  <a href={project.url}>
                    <project.icon />
                    <span>{project.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default SidebarLayout;

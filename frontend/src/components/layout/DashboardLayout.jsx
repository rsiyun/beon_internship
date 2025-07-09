import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarLayout from "./SidebarLayout";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Toaster/>
            <SidebarProvider>
                <SidebarLayout/>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                    </header>
                    <main className="px-4">
                        <Outlet/>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default DashboardLayout;
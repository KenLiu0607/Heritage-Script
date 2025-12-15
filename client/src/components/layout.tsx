import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Factory, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Menu,
  Bell,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: "儀表板", href: "/", icon: LayoutDashboard },
    { name: "契作交貨", href: "/receiving", icon: Truck },
    { name: "生產排程", href: "/production", icon: Factory },
    { name: "庫存管理", href: "/inventory", icon: Package },
    { name: "銷售訂單", href: "/sales", icon: ShoppingCart },
    { name: "數據分析", href: "/analytics", icon: BarChart3 },
    { name: "系統設定", href: "/settings", icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <Factory size={18} />
          </div>
          <span>ChickenOps</span>
        </div>
        <p className="text-xs text-sidebar-foreground/60 mt-1 pl-10">智能產銷管理系統</p>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon size={18} />
                {item.name}
              </a>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center border border-sidebar-border">
            <span className="text-xs font-medium">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">管理員</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@farm.co</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-border bg-sidebar flex-shrink-0">
        <NavContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-2 font-semibold">
             <Factory size={18} className="text-primary" />
             <span>ChickenOps</span>
          </div>
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r-0">
              <NavContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-border bg-background items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">
            {navigation.find(n => n.href === location)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell size={20} />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

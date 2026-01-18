"use client"

import { useAuth } from "@/components/auth-provider"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  ClipboardList,
  Menu,
  X,
  DollarSign,
  FileText,
  Bell,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar({ 
  onSectionChange, 
  onCollapseChange 
}: { 
  onSectionChange?: (section: string) => void
  onCollapseChange?: (collapsed: boolean) => void
}) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  if (!user) return null

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    onSectionChange?.(section)
  }

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    onCollapseChange?.(collapsed)
  }

  const getNavItems = () => {
    switch (user.role) {
      case "super_admin":
        return [
          { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
          { label: "Institutes", id: "institutes", icon: Users },
          { label: "Billing", id: "billing", icon: BarChart3 },
          { label: "Settings", id: "settings", icon: Settings },
        ]
      case "admin":
        return [
          { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
          { label: "Student Management", id: "student-management", icon: Users },
          { label: "Batch Management", id: "batch-management", icon: FileText },
          { label: "Fee Structure", id: "fee-structure", icon: DollarSign },
          { label: "Staff", id: "staff", icon: ClipboardList },
          { label: "Reports", id: "reports", icon: BarChart3 },
          { label: "Analytics", id: "analytics", icon: BarChart3 },
          { label: "Communication", id: "communication", icon: MessageSquare },
          { label: "Settings", id: "settings", icon: Settings },
        ]
      case "staff":
        return [
          { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
          { label: "Attendance", id: "attendance", icon: ClipboardList },
          { label: "Fee Verification", id: "fee-verification", icon: Users },
          { label: "Reports", id: "reports", icon: BarChart3 },
        ]
      case "student":
        return [
          { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
          { label: "Fee Payment", id: "fee-payment", icon: BarChart3 },
          { label: "History", id: "history", icon: ClipboardList },
          { label: "Documents", id: "documents", icon: Users },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleCollapse(!isCollapsed)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleCollapse(!isCollapsed)}
        className="fixed top-16 left-4 z-50 hover:bg-accent transition-colors hidden md:flex"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r border-border/40 shadow-lg z-40 pt-20 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
          "w-64",
        )}
      >
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-border/40 p-4 space-y-2">
          <div className="px-2 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
            <p className="text-sm font-medium mt-1 truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20 bg-transparent"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => handleCollapse(true)}
          aria-hidden="true"
        />
      )}

      <div className={cn("transition-all duration-300", !isCollapsed && "md:ml-64")} />
    </>
  )
}

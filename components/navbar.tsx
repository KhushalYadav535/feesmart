"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserCircle, LayoutDashboard, LogOut } from "lucide-react"
import { NotificationsCenter } from "@/components/notifications-center"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-black text-sm">FS</span>
            </div>
            <span className="text-xl font-bold tracking-tighter group-hover:text-accent transition-colors">
              FeeSmart
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {user ? (
              <>
                {user.role === "super_admin" && (
                  <Link
                    href="/super-admin"
                    className="hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Global Dashboard
                  </Link>
                )}
                {(user.role === "admin" || user.role === "staff") && (
                  <Link href="/admin" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Institute Panel
                  </Link>
                )}
                {user.role === "student" && (
                  <Link href="/student" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    My Fees
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && <NotificationsCenter />}
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-xl hover:bg-muted transition-colors border border-border/40"
                >
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <div className="px-3 py-2 border-b border-border/40 mb-2">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
                </div>
                <DropdownMenuItem onClick={logout} className="text-destructive rounded-xl cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-semibold hover:text-accent transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Button asChild className="rounded-full px-6 shadow-lg shadow-accent/20 hover:shadow-xl transition-shadow">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

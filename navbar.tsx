"use client"

import { useState } from "react"
import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu, X, User, LogOut, Shield, GraduationCap } from "lucide-react"

interface NavbarProps {
  currentPage?: string
  onNavigate?: (page: string) => void
}

export function Navbar({ currentPage = "home", onNavigate }: NavbarProps) {
  const { user, login, logout } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loginForm, setLoginForm] = useState({ name: "", email: "", role: "student" as "student" | "admin" })

  const navItems = [
    { id: "home", label: "Home" },
    { id: "clubs", label: "Club Directory" },
    { id: "events", label: "Events Portal" },
    { id: "auditions", label: "Auditions" },
    { id: "about", label: "About Us" },
  ]

  const handleLogin = (role: "student" | "admin") => {
    if (role === "admin") {
      login("admin", "Admin User", "admin@sirmvit.edu")
    } else {
      login("student", loginForm.name || "Student User", loginForm.email || "student@sirmvit.edu")
    }
    setShowLoginDialog(false)
    setLoginForm({ name: "", email: "", role: "student" })
  }

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id)
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="https://www.sirmvit.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline">Sir M. Visvesvaraya Institute of Technology</span>
              <span className="sm:hidden">Sir MVIT</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    currentPage === item.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {user.role === "admin" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-muted-foreground">
                      {user.role === "admin" ? "Administrator" : "Student"}
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem onClick={() => handleNavClick("admin")}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setShowLoginDialog(true)} size="sm">
                  Login / Register
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user?.role === "admin" && (
                <button
                  onClick={() => handleNavClick("admin")}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === "admin"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Admin Dashboard
                </button>
              )}
              <div className="pt-3 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <p className="px-3 text-sm text-muted-foreground">
                      Logged in as {user.name} ({user.role})
                    </p>
                    <Button onClick={logout} variant="outline" size="sm" className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setShowLoginDialog(true)} className="w-full">
                    Login / Register
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to Sir MVIT Portal</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={loginForm.name}
                  onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">Or use demo accounts:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleLogin("student")}
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">Student Login</span>
                </Button>
                <Button
                  onClick={() => handleLogin("admin")}
                  variant="default"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Admin Login</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

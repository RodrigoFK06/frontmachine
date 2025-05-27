"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, Camera, History, BookOpen, BarChart3 } from "lucide-react"
import { ApiStatus } from "@/components/api-status"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Inicio",
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/practice",
      label: "Practicar",
      icon: <Camera className="h-4 w-4 mr-2" />,
      active: pathname === "/practice",
    },
    {
      href: "/history",
      label: "Historial",
      icon: <History className="h-4 w-4 mr-2" />,
      active: pathname === "/history",
    },
    {
      href: "/labels",
      label: "Señas",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      active: pathname === "/labels",
    },
    {
      href: "/progress",
      label: "Progreso",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      active: pathname === "/progress",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SignMed</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-2 lg:space-x-4 mx-6">
          {routes.map((route) => (
            <Button key={route.href} variant={route.active ? "default" : "ghost"} size="sm" className="h-8" asChild>
              <Link href={route.href} className="flex items-center">
                {route.icon}
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ApiStatus />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

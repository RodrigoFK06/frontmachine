import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { MainNav } from "@/components/main-nav"
import { DemoModeBanner } from "@/components/demo-mode-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SignMed - Plataforma de Lenguaje de Señas Médicas",
  description: "Aprende lenguaje de señas médicas con inteligencia artificial",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1 w-full">
              <DemoModeBanner />
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

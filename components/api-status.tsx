"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Wifi, WifiOff, User } from "lucide-react"
import { getUserNickname, setUserNickname } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function ApiStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [nickname, setNickname] = useState("")
  const [tempNickname, setTempNickname] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Cargar nickname actual
    const currentNickname = getUserNickname()
    setNickname(currentNickname)
    setTempNickname(currentNickname)

    // Verificar estado de la API
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Evita advertencias de ngrok
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      setIsOnline(response.ok)
      console.log(`🏥 Health check result: ${response.ok ? "Online" : "Offline"}`)
    } catch (error) {
      console.warn("⚠️ Health check failed:", error)
      setIsOnline(false)
    }
  }

  const handleSaveNickname = () => {
    if (tempNickname.trim()) {
      setUserNickname(tempNickname.trim())
      setNickname(tempNickname.trim())
      setIsDialogOpen(false)
      toast({
        title: "Nickname actualizado",
        description: `Tu nickname ahora es: ${tempNickname.trim()}`,
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* API Status Badge */}
      <Badge variant={isOnline === true ? "default" : isOnline === false ? "destructive" : "secondary"}>
        {isOnline === true ? (
          <>
            <Wifi className="h-3 w-3 mr-1" />
            API Conectada
          </>
        ) : isOnline === false ? (
          <>
            <WifiOff className="h-3 w-3 mr-1" />
            Modo Demo
          </>
        ) : (
          "Verificando..."
        )}
      </Badge>

      {/* Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configuración</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de Usuario</DialogTitle>
            <DialogDescription>
              Configura tu nickname para personalizar tu experiencia de aprendizaje.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="nickname"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  placeholder="Ingresa tu nickname"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Tu nickname se usa para guardar tu progreso y estadísticas.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Estado de la API</Label>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conexión:</span>
                    <Badge variant={isOnline === true ? "default" : isOnline === false ? "destructive" : "secondary"}>
                      {isOnline === true ? "Conectada" : isOnline === false ? "Desconectada" : "Verificando..."}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isOnline === true
                      ? "Usando datos reales de la API"
                      : isOnline === false
                        ? "Usando datos de demostración"
                        : "Verificando estado de conexión..."}
                  </p>
                  <Button variant="outline" size="sm" onClick={checkApiStatus} className="mt-2 w-full">
                    Verificar conexión
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveNickname} className="flex-1">
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

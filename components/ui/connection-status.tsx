"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const { isOnline } = useAuth()

  return (
    <Badge
      variant={isOnline ? "default" : "secondary"}
      className={`flex items-center gap-1 ${
        isOnline ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          Connected
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Offline Mode
        </>
      )}
    </Badge>
  )
}

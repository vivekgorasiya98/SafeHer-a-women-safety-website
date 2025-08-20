"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SOSButtonProps {
  onActivate: () => void
}

export function SOSButton({ onActivate }: SOSButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [countdown])

  useEffect(() => {
    if (countdown === 0 && isPressed) {
      onActivate()
      setIsPressed(false)
      toast({
        title: "SOS Alert Activated!",
        description: "Emergency alert sent to nearby volunteers and contacts",
        variant: "destructive",
      })
    }
  }, [countdown, isPressed, onActivate, toast])

  const handlePress = () => {
    if (!isPressed) {
      setIsPressed(true)
      setCountdown(3)
      toast({
        title: "Hold to Confirm",
        description: "Keep holding for 3 seconds to activate SOS",
      })
    }
  }

  const handleRelease = () => {
    if (isPressed && countdown > 0) {
      setIsPressed(false)
      setCountdown(0)
      toast({
        title: "SOS Cancelled",
        description: "You released the button before confirmation.",
      })
    }
  }

  return (
    <div className="relative text-center w-full max-w-sm mx-auto">
      <div
        className={`w-48 h-48 rounded-full bg-red-600/90 text-white flex items-center justify-center mx-auto 
        shadow-xl transition-all duration-300 cursor-pointer relative hover:scale-105
        ${isPressed ? "animate-pulse shadow-red-500" : "hover:shadow-lg"}`}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
      >
        <AlertTriangle className="w-8 h-8 mr-2 animate-bounce" />
        <span className="text-xl font-bold">
          {countdown > 0 ? `SOS (${countdown})` : "Tap & Hold"}
        </span>

        {isPressed && (
          <div className="absolute inset-0 rounded-full bg-red-900/30 animate-pulse z-0" />
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">Hold for 3 seconds to send alert</p>

      <Button
        variant="outline"
        size="sm"
        className="mt-4 border-turquoise-400 text-turquoise-700 hover:bg-turquoise-50"
        onClick={() => window.open("tel:911")}
      >
        <Phone className="h-4 w-4 mr-1" />
        Quick Call 911
      </Button>
    </div>
  )
}

"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { VolunteerDashboard } from "@/components/dashboard/volunteer-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  switch (user.role) {
    case "user":
      return <UserDashboard />
    case "volunteer":
      return <VolunteerDashboard />
    case "admin":
      return <AdminDashboard />
    default:
      return <div>Invalid role</div>
  }
}

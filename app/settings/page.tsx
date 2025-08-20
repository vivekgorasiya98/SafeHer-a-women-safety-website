"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api" // your API client

export default function SettingsPage() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact1: "",
    phone1: "",
    contact2: "",
    phone2: "",
    notifications: {
      email: false,
      sms: false,
    },
  })

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiClient.get("/user/profile")
        if (res.success) {
          setProfile(res.data)
        } else {
          toast({ title: "Failed", description: res.error, variant: "destructive" })
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to load profile", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [toast])

  const handleChange = (key: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handleSaveAll = async () => {
    try {
      const res = await apiClient.post("/user/profile/update", profile)
      if (res.success) {
        toast({
          title: "Profile Saved",
          description: "All settings updated.",
          className: "border-teal-200 bg-teal-50 text-teal-800",
        })
      } else {
        throw new Error(res.error)
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not save settings", variant: "destructive" })
    }
  }

  if (loading) return <div className="text-center py-10">Loading profile...</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Settings</h1>

      {/* Profile Info */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>Manage your emergency contact list.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact1">Contact 1</Label>
              <Input
                id="contact1"
                value={profile.contact1}
                onChange={(e) => handleChange("contact1", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone1">Phone 1</Label>
              <Input
                id="phone1"
                value={profile.phone1}
                onChange={(e) => handleChange("phone1", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact2">Contact 2</Label>
              <Input
                id="contact2"
                value={profile.contact2}
                onChange={(e) => handleChange("contact2", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone2">Phone 2</Label>
              <Input
                id="phone2"
                value={profile.phone2}
                onChange={(e) => handleChange("phone2", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Email / SMS preference</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch
              checked={profile.notifications.email}
              onCheckedChange={(val) => handleNotificationChange("email", val)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>SMS Notifications</Label>
            <Switch
              checked={profile.notifications.sms}
              onCheckedChange={(val) => handleNotificationChange("sms", val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save All */}
      <div className="text-right">
        <Button className="bg-teal-500 hover:bg-teal-600 text-white" onClick={handleSaveAll}>
          Save All Changes
        </Button>
      </div>
    </div>
  )
}

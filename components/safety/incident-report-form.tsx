"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Camera } from "lucide-react"

export function IncidentReportForm() {
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    time: "",
    anonymous: false,
    severity: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report Submitted",
        description:
          "Your incident report has been submitted successfully. Thank you for helping keep our community safe.",
      })
      setFormData({
        type: "",
        location: "",
        description: "",
        time: "",
        anonymous: false,
        severity: "",
      })
      setLoading(false)
    }, 1000)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }))
          toast({
            title: "Location Added",
            description: "Current location has been added to the report",
          })
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get current location. Please enter manually.",
            variant: "destructive",
          })
        },
      )
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Report an Incident</CardTitle>
        <CardDescription>Help keep our community safe by reporting safety concerns or incidents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Incident Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                  <SelectItem value="unsafe-area">Unsafe Area</SelectItem>
                  <SelectItem value="poor-lighting">Poor Lighting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location or address"
                required
              />
              <Button type="button" variant="outline" onClick={getCurrentLocation}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time of Incident</Label>
            <Input
              id="time"
              type="datetime-local"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide details about the incident..."
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) => setFormData({ ...formData, anonymous: checked as boolean })}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Submit this report anonymously
            </Label>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
            <Button type="button" variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

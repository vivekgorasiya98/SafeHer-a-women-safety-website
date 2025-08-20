"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  incidentType: z.string().min(2, {
    message: "Incident type must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

const handleSubmitReport = () => {
  toast({
    title: "Report Submitted",
    description: "Your incident report has been submitted successfully. Thank you for helping keep our community safe.",
    className: "border-teal-200 bg-teal-50 text-teal-800",
  })
}

const handleSaveDraft = () => {
  toast({
    title: "Draft Saved",
    description: "Your report has been saved as a draft.",
    className: "border-purple-200 bg-purple-50 text-purple-800",
  })
}

const handleAddPhoto = () => {
  toast({
    title: "Add Photo",
    description: "Photo upload functionality would open here.",
    className: "border-turquoise-200 bg-turquoise-50 text-turquoise-800",
  })
}

export default function ReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentType: "",
      location: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Report an Incident</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="incidentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Incident</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an incident type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="vandalism">Vandalism</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Please select the type of incident you are reporting.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the location of the incident" {...field} />
                </FormControl>
                <FormDescription>Where did the incident occur?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the incident in detail" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Please provide a detailed description of the incident.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={handleSubmitReport}>
              Submit Report
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              onClick={handleSaveDraft}
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-turquoise-300 text-turquoise-700 hover:bg-turquoise-50 bg-transparent"
              onClick={handleAddPhoto}
            >
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

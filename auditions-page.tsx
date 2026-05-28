"use client"

import { useState } from "react"
import { useApp, Audition } from "@/lib/app-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, MapPin, Users, Clock, CheckCircle, Music, Plus, Trash2 } from "lucide-react"
import { format, isPast } from "date-fns"

export function AuditionsPage() {
  const { auditions, clubs, user, applyForAudition, addAudition, deleteAudition } = useApp()
  const [showAddAudition, setShowAddAudition] = useState(false)
  const [newAudition, setNewAudition] = useState({
    clubId: "",
    title: "",
    description: "",
    venue: "",
    date: "",
    eligibility: "",
    maxApplicants: 50,
  })

  const isAdmin = user?.role === "admin"

  const hasApplied = (auditionId: string) => {
    return user && auditions.find((a) => a.id === auditionId)?.applicants.includes(user.id)
  }

  const isDeadlinePassed = (date: string) => {
    return isPast(new Date(date))
  }

  const isCapacityFull = (audition: Audition) => {
    return audition.applicants.length >= audition.maxApplicants
  }

  const handleAddAudition = () => {
    if (newAudition.title && newAudition.clubId && newAudition.venue && newAudition.date) {
      const selectedClub = clubs.find((c) => c.id === newAudition.clubId)
      addAudition({
        ...newAudition,
        clubName: selectedClub?.name || "",
      })
      setNewAudition({
        clubId: "",
        title: "",
        description: "",
        venue: "",
        date: "",
        eligibility: "",
        maxApplicants: 50,
      })
      setShowAddAudition(false)
    }
  }

  const handleDeleteAudition = (auditionId: string) => {
    if (confirm("Are you sure you want to delete this audition?")) {
      deleteAudition(auditionId)
    }
  }

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Auditions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Showcase your talent! Apply for auditions and join your favorite clubs.
              Discover opportunities to express yourself and grow.
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddAudition(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Audition
            </Button>
          )}
        </div>

        {auditions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {auditions.map((audition) => {
              const deadlinePassed = isDeadlinePassed(audition.date)
              const capacityFull = isCapacityFull(audition)
              const applied = hasApplied(audition.id)

              return (
                <Card key={audition.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">{audition.clubName}</Badge>
                      <div className="flex items-center gap-2">
                        {deadlinePassed && (
                          <Badge variant="destructive">Closed</Badge>
                        )}
                        {isAdmin && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAudition(audition.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardTitle className="mt-2">{audition.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {audition.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {audition.venue}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(audition.date), "MMMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {audition.eligibility}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">
                          {audition.applicants.length} / {audition.maxApplicants} applied
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {applied ? (
                      <Button disabled className="w-full gap-2" variant="secondary">
                        <CheckCircle className="h-4 w-4" />
                        Applied
                      </Button>
                    ) : deadlinePassed ? (
                      <Button disabled className="w-full" variant="outline">
                        Applications Closed
                      </Button>
                    ) : capacityFull ? (
                      <Button disabled className="w-full" variant="outline">
                        Capacity Full
                      </Button>
                    ) : user ? (
                      <Button
                        className="w-full"
                        onClick={() => applyForAudition(audition.id)}
                      >
                        Apply Now
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        Login to Apply
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Auditions Available</h3>
            <p className="text-muted-foreground mb-4">
              Check back later for upcoming audition opportunities.
            </p>
            {isAdmin && (
              <Button onClick={() => setShowAddAudition(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Audition
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Audition Dialog - Admin Only */}
      <Dialog open={showAddAudition} onOpenChange={setShowAddAudition}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Audition</DialogTitle>
            <DialogDescription>
              Create a new audition for students to apply
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="auditionTitle">Audition Title *</Label>
              <Input
                id="auditionTitle"
                placeholder="e.g., Dance Club Recruitment 2024"
                value={newAudition.title}
                onChange={(e) => setNewAudition({ ...newAudition, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionClub">Club *</Label>
              <Select
                value={newAudition.clubId}
                onValueChange={(value) => setNewAudition({ ...newAudition, clubId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionVenue">Venue *</Label>
              <Input
                id="auditionVenue"
                placeholder="e.g., Seminar Hall, Block B"
                value={newAudition.venue}
                onChange={(e) => setNewAudition({ ...newAudition, venue: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auditionDate">Date *</Label>
                <Input
                  id="auditionDate"
                  type="date"
                  value={newAudition.date}
                  onChange={(e) => setNewAudition({ ...newAudition, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auditionMax">Max Applicants</Label>
                <Input
                  id="auditionMax"
                  type="number"
                  value={newAudition.maxApplicants}
                  onChange={(e) => setNewAudition({ ...newAudition, maxApplicants: parseInt(e.target.value) || 50 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionEligibility">Eligibility</Label>
              <Input
                id="auditionEligibility"
                placeholder="e.g., All years eligible"
                value={newAudition.eligibility}
                onChange={(e) => setNewAudition({ ...newAudition, eligibility: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionDesc">Description</Label>
              <Textarea
                id="auditionDesc"
                placeholder="Enter audition details and requirements"
                value={newAudition.description}
                onChange={(e) => setNewAudition({ ...newAudition, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddAudition(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddAudition}
                disabled={!newAudition.title || !newAudition.clubId || !newAudition.venue || !newAudition.date}
              >
                Create Audition
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

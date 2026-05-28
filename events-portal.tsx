"use client"

import { useState } from "react"
import { useApp, Event } from "@/lib/app-context"
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
import { Calendar, MapPin, Users, Clock, CheckCircle, Plus, Trash2 } from "lucide-react"
import { format, isPast } from "date-fns"

export function EventsPortal() {
  const { events, clubs, user, registerForEvent, addEvent, deleteEvent } = useApp()
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    email: "",
    phone: "",
    usn: "",
    branch: "",
    semester: "",
  })
  const [newEvent, setNewEvent] = useState({
    title: "",
    clubId: "",
    venue: "",
    date: "",
    deadline: "",
    description: "",
    maxParticipants: 100,
  })

  const isAdmin = user?.role === "admin"
  const selectedEventData = events.find((e) => e.id === selectedEvent)

  const handleRegister = () => {
    if (
      selectedEvent &&
      user &&
      registrationForm.name &&
      registrationForm.email &&
      registrationForm.phone &&
      registrationForm.usn &&
      registrationForm.branch &&
      registrationForm.semester
    ) {
      registerForEvent(selectedEvent, registrationForm)
      setShowRegistration(false)
      setRegistrationForm({ name: "", email: "", phone: "", usn: "", branch: "", semester: "" })
      setSelectedEvent(null)
    }
  }

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.clubId && newEvent.venue && newEvent.date && newEvent.deadline) {
      const selectedClub = clubs.find((c) => c.id === newEvent.clubId)
      addEvent({
        ...newEvent,
        clubName: selectedClub?.name || "",
      })
      setNewEvent({
        title: "",
        clubId: "",
        venue: "",
        date: "",
        deadline: "",
        description: "",
        maxParticipants: 100,
      })
      setShowAddEvent(false)
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId)
    }
  }

  const isRegistered = (eventId: string) => {
    return user && events.find((e) => e.id === eventId)?.registeredUsers.includes(user.id)
  }

  const isDeadlinePassed = (deadline: string) => {
    return isPast(new Date(deadline))
  }

  const isCapacityFull = (event: Event) => {
    return event.participantCount >= event.maxParticipants
  }

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Events Portal</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover and register for exciting events happening at Sir MVIT.
              From hackathons to cultural fests, there&apos;s something for everyone.
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddEvent(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          )}
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const deadlinePassed = isDeadlinePassed(event.deadline)
              const capacityFull = isCapacityFull(event)
              const registered = isRegistered(event.id)

              return (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge>{event.clubName}</Badge>
                      <div className="flex items-center gap-2">
                        {deadlinePassed && (
                          <Badge variant="destructive">Closed</Badge>
                        )}
                        {isAdmin && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <CardTitle className="mt-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Deadline: {format(new Date(event.deadline), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">
                          {event.participantCount} / {event.maxParticipants} registered
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {registered ? (
                      <Button disabled className="w-full gap-2" variant="secondary">
                        <CheckCircle className="h-4 w-4" />
                        Registered
                      </Button>
                    ) : deadlinePassed ? (
                      <Button disabled className="w-full" variant="outline">
                        Registration Closed
                      </Button>
                    ) : capacityFull ? (
                      <Button disabled className="w-full" variant="outline">
                        Capacity Full
                      </Button>
                    ) : user ? (
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedEvent(event.id)
                          setShowRegistration(true)
                        }}
                      >
                        Register Now
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        Login to Register
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
            <p className="text-muted-foreground mb-4">
              Check back later for upcoming events.
            </p>
            {isAdmin && (
              <Button onClick={() => setShowAddEvent(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Event
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Registration Dialog */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Registration</DialogTitle>
            <DialogDescription>
              Fill in your details to register for {selectedEventData?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">{selectedEventData?.title}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedEventData?.venue} • {selectedEventData && format(new Date(selectedEventData.date), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="regName">Full Name *</Label>
              <Input
                id="regName"
                placeholder="Enter your full name"
                value={registrationForm.name}
                onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regEmail">Email *</Label>
              <Input
                id="regEmail"
                type="email"
                placeholder="Enter your college email"
                value={registrationForm.email}
                onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regPhone">Phone Number *</Label>
              <Input
                id="regPhone"
                placeholder="Enter your phone number"
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regUSN">USN (University Serial Number) *</Label>
              <Input
                id="regUSN"
                placeholder="e.g., 1MV21CS001"
                value={registrationForm.usn}
                onChange={(e) => setRegistrationForm({ ...registrationForm, usn: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regBranch">Branch *</Label>
                <Select
                  value={registrationForm.branch}
                  onValueChange={(value) => setRegistrationForm({ ...registrationForm, branch: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ISE">ISE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="CV">CV</SelectItem>
                    <SelectItem value="AIML">AIML</SelectItem>
                    <SelectItem value="AIDS">AIDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regSemester">Semester *</Label>
                <Select
                  value={registrationForm.semester}
                  onValueChange={(value) => setRegistrationForm({ ...registrationForm, semester: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Sem</SelectItem>
                    <SelectItem value="2">2nd Sem</SelectItem>
                    <SelectItem value="3">3rd Sem</SelectItem>
                    <SelectItem value="4">4th Sem</SelectItem>
                    <SelectItem value="5">5th Sem</SelectItem>
                    <SelectItem value="6">6th Sem</SelectItem>
                    <SelectItem value="7">7th Sem</SelectItem>
                    <SelectItem value="8">8th Sem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowRegistration(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRegister}
                disabled={
                  !registrationForm.name ||
                  !registrationForm.email ||
                  !registrationForm.phone ||
                  !registrationForm.usn ||
                  !registrationForm.branch ||
                  !registrationForm.semester
                }
              >
                Confirm Registration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog - Admin Only */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for students to register
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event Title *</Label>
              <Input
                id="eventTitle"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventClub">Organizing Club *</Label>
              <Select
                value={newEvent.clubId}
                onValueChange={(value) => setNewEvent({ ...newEvent, clubId: value })}
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
              <Label htmlFor="eventVenue">Venue *</Label>
              <Input
                id="eventVenue"
                placeholder="e.g., Main Auditorium, Block A"
                value={newEvent.venue}
                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDeadline">Deadline *</Label>
                <Input
                  id="eventDeadline"
                  type="date"
                  value={newEvent.deadline}
                  onChange={(e) => setNewEvent({ ...newEvent, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventMax">Max Participants</Label>
              <Input
                id="eventMax"
                type="number"
                value={newEvent.maxParticipants}
                onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: parseInt(e.target.value) || 100 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDesc">Description</Label>
              <Textarea
                id="eventDesc"
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddEvent(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.clubId || !newEvent.venue || !newEvent.date || !newEvent.deadline}
              >
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

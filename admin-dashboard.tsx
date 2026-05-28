"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  Megaphone,
  Music,
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  User,
} from "lucide-react"
import { format } from "date-fns"
import type { Club, ClubMember } from "@/lib/app-context"

export function AdminDashboard() {
  const {
    user,
    clubs,
    events,
    auditions,
    announcements,
    addClub,
    updateClub,
    deleteClub,
    addMember,
    removeMember,
    addEvent,
    updateEvent,
    deleteEvent,
    addAudition,
    deleteAudition,
    addAnnouncement,
    deleteAnnouncement,
  } = useApp()

  const [showClubDialog, setShowClubDialog] = useState(false)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showAuditionDialog, setShowAuditionDialog] = useState(false)
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [showMemberDialog, setShowMemberDialog] = useState(false)
  const [selectedClubForMembers, setSelectedClubForMembers] = useState<Club | null>(null)

  const [editingClub, setEditingClub] = useState<Club | null>(null)
  const [editingEvent, setEditingEvent] = useState<typeof events[0] | null>(null)

  const [clubForm, setClubForm] = useState({
    name: "",
    coordinator: "",
    description: "",
  })

  const [eventForm, setEventForm] = useState({
    title: "",
    clubId: "",
    clubName: "",
    venue: "",
    date: "",
    deadline: "",
    description: "",
    maxParticipants: 100,
  })

  const [auditionForm, setAuditionForm] = useState({
    clubId: "",
    clubName: "",
    title: "",
    description: "",
    venue: "",
    date: "",
    eligibility: "",
    maxApplicants: 50,
  })

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    type: "general" as "event" | "club" | "audition" | "deadline" | "general",
  })

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    role: "Member",
  })

  const isAdmin = user?.role === "admin"

  if (!isAdmin) {
    return (
      <div className="py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          You need administrator privileges to access this page.
        </p>
      </div>
    )
  }

  const handleSaveClub = () => {
    if (editingClub) {
      updateClub(editingClub.id, clubForm)
    } else {
      addClub(clubForm)
    }
    setClubForm({ name: "", coordinator: "", description: "" })
    setEditingClub(null)
    setShowClubDialog(false)
  }

  const handleEditClub = (club: Club) => {
    setClubForm({
      name: club.name,
      coordinator: club.coordinator,
      description: club.description,
    })
    setEditingClub(club)
    setShowClubDialog(true)
  }

  const handleSaveEvent = () => {
    const selectedClub = clubs.find((c) => c.id === eventForm.clubId)
    const eventData = {
      ...eventForm,
      clubName: selectedClub?.name || "",
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData)
    } else {
      addEvent(eventData)
    }
    setEventForm({
      title: "",
      clubId: "",
      clubName: "",
      venue: "",
      date: "",
      deadline: "",
      description: "",
      maxParticipants: 100,
    })
    setEditingEvent(null)
    setShowEventDialog(false)
  }

  const handleEditEvent = (event: typeof events[0]) => {
    setEventForm({
      title: event.title,
      clubId: event.clubId,
      clubName: event.clubName,
      venue: event.venue,
      date: event.date,
      deadline: event.deadline,
      description: event.description,
      maxParticipants: event.maxParticipants,
    })
    setEditingEvent(event)
    setShowEventDialog(true)
  }

  const handleSaveAudition = () => {
    const selectedClub = clubs.find((c) => c.id === auditionForm.clubId)
    addAudition({
      ...auditionForm,
      clubName: selectedClub?.name || "",
    })
    setAuditionForm({
      clubId: "",
      clubName: "",
      title: "",
      description: "",
      venue: "",
      date: "",
      eligibility: "",
      maxApplicants: 50,
    })
    setShowAuditionDialog(false)
  }

  const handleSaveAnnouncement = () => {
    addAnnouncement(announcementForm)
    setAnnouncementForm({ title: "", content: "", type: "general" })
    setShowAnnouncementDialog(false)
  }

  const handleOpenMemberDialog = (club: Club) => {
    setSelectedClubForMembers(club)
    setShowMemberDialog(true)
  }

  const handleAddMember = () => {
    if (selectedClubForMembers && memberForm.name && memberForm.email) {
      addMember(selectedClubForMembers.id, memberForm)
      setMemberForm({ name: "", email: "", role: "Member" })
    }
  }

  const handleRemoveMember = (memberId: string) => {
    if (selectedClubForMembers) {
      removeMember(selectedClubForMembers.id, memberId)
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage clubs, events, auditions, and announcements
          </p>
        </div>

        <Tabs defaultValue="clubs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clubs" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Clubs</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="auditions" className="gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Auditions</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
          </TabsList>

          {/* Clubs Tab */}
          <TabsContent value="clubs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Clubs</h2>
              <Button onClick={() => setShowClubDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Club
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <Card key={club.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{club.name}</CardTitle>
                      <Badge variant="secondary">{club.memberCount} members</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {club.coordinator}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClub(club)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenMemberDialog(club)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteClub(club.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Events</h2>
              <Button onClick={() => setShowEventDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge>{event.clubName}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.venue} • {format(new Date(event.date), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm mb-3">
                      {event.participantCount} / {event.maxParticipants} registered
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEvent(event)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Auditions Tab */}
          <TabsContent value="auditions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Auditions</h2>
              <Button onClick={() => setShowAuditionDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Audition
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {auditions.map((audition) => (
                <Card key={audition.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{audition.title}</CardTitle>
                      <Badge variant="secondary">{audition.clubName}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {audition.venue} • {format(new Date(audition.date), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm mb-3">
                      {audition.applicants.length} / {audition.maxApplicants} applied
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteAudition(audition.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {auditions.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-8">
                  No auditions created yet.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Announcements</h2>
              <Button
                onClick={() => setShowAnnouncementDialog(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Announcement
              </Button>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{announcement.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(announcement.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {announcement.content}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Club Dialog */}
      <Dialog open={showClubDialog} onOpenChange={setShowClubDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClub ? "Edit Club" : "Add New Club"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clubName">Club Name</Label>
              <Input
                id="clubName"
                value={clubForm.name}
                onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinator">Coordinator</Label>
              <Input
                id="coordinator"
                value={clubForm.coordinator}
                onChange={(e) =>
                  setClubForm({ ...clubForm, coordinator: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={clubForm.description}
                onChange={(e) =>
                  setClubForm({ ...clubForm, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowClubDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveClub}>
                {editingClub ? "Update" : "Add"} Club
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventClub">Hosting Club</Label>
              <Select
                value={eventForm.clubId}
                onValueChange={(value) => setEventForm({ ...eventForm, clubId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a club" />
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
              <Label htmlFor="eventVenue">Venue</Label>
              <Input
                id="eventVenue"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDeadline">Registration Deadline</Label>
                <Input
                  id="eventDeadline"
                  type="date"
                  value={eventForm.deadline}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, deadline: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={eventForm.maxParticipants}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    maxParticipants: parseInt(e.target.value) || 100,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>
                {editingEvent ? "Update" : "Add"} Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audition Dialog */}
      <Dialog open={showAuditionDialog} onOpenChange={setShowAuditionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Audition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="auditionTitle">Audition Title</Label>
              <Input
                id="auditionTitle"
                value={auditionForm.title}
                onChange={(e) =>
                  setAuditionForm({ ...auditionForm, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionClub">Club</Label>
              <Select
                value={auditionForm.clubId}
                onValueChange={(value) =>
                  setAuditionForm({ ...auditionForm, clubId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a club" />
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
              <Label htmlFor="auditionVenue">Venue</Label>
              <Input
                id="auditionVenue"
                value={auditionForm.venue}
                onChange={(e) =>
                  setAuditionForm({ ...auditionForm, venue: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionDate">Date & Time</Label>
              <Input
                id="auditionDate"
                type="date"
                value={auditionForm.date}
                onChange={(e) =>
                  setAuditionForm({ ...auditionForm, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility</Label>
              <Input
                id="eligibility"
                placeholder="e.g., All students, First year only"
                value={auditionForm.eligibility}
                onChange={(e) =>
                  setAuditionForm({ ...auditionForm, eligibility: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxApplicants">Max Applicants</Label>
              <Input
                id="maxApplicants"
                type="number"
                value={auditionForm.maxApplicants}
                onChange={(e) =>
                  setAuditionForm({
                    ...auditionForm,
                    maxApplicants: parseInt(e.target.value) || 50,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auditionDescription">Description</Label>
              <Textarea
                id="auditionDescription"
                value={auditionForm.description}
                onChange={(e) =>
                  setAuditionForm({ ...auditionForm, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAuditionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAudition}>Add Audition</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="announcementTitle">Title</Label>
              <Input
                id="announcementTitle"
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementType">Type</Label>
              <Select
                value={announcementForm.type}
                onValueChange={(value: typeof announcementForm.type) =>
                  setAnnouncementForm({ ...announcementForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="event">Event Update</SelectItem>
                  <SelectItem value="club">Club Notice</SelectItem>
                  <SelectItem value="audition">Audition Alert</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementContent">Content</Label>
              <Textarea
                id="announcementContent"
                value={announcementForm.content}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, content: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAnnouncementDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAnnouncement}>Post Announcement</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Management Dialog - Admin Only */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Members - {selectedClubForMembers?.name}</DialogTitle>
            <DialogDescription>
              Add or remove members from this club. Only admins can manage members.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Add Member Form */}
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Member
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="memberName" className="text-sm">Name</Label>
                  <Input
                    id="memberName"
                    placeholder="Member name"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="memberEmail" className="text-sm">Email</Label>
                  <Input
                    id="memberEmail"
                    type="email"
                    placeholder="Email address"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="memberRole" className="text-sm">Role</Label>
                  <Input
                    id="memberRole"
                    placeholder="e.g., Member, Secretary"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddMember} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Members List */}
            <div>
              <h4 className="font-semibold mb-3">Current Members ({selectedClubForMembers?.members.length || 0})</h4>
              {selectedClubForMembers?.members && selectedClubForMembers.members.length > 0 ? (
                <div className="space-y-2">
                  {selectedClubForMembers.members.map((member: ClubMember) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-background border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email} • {member.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted rounded-lg">
                  No members added yet.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useApp, Club, ClubMember } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
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
import { Users, User, Calendar, Trash2, UserPlus } from "lucide-react"
import { format } from "date-fns"

export function ClubDirectory() {
  const { clubs, events, user, addMember, removeMember } = useApp()
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Member" })

  const isAdmin = user?.role === "admin"

  const clubEvents = selectedClub
    ? events.filter((e) => e.clubId === selectedClub.id)
    : []

  const handleAddMember = () => {
    if (selectedClub && newMember.name && newMember.email) {
      addMember(selectedClub.id, newMember)
      setNewMember({ name: "", email: "", role: "Member" })
      setShowAddMember(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    if (selectedClub) {
      removeMember(selectedClub.id, memberId)
    }
  }

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Club Directory</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and join various clubs at Sir MVIT. Each club offers unique opportunities
            for personal growth, skill development, and community engagement.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <Card
              key={club.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => setSelectedClub(club)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">
                    {club.members.length} {club.members.length === 1 ? "member" : "members"}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-1">{club.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Coordinator: {club.coordinator}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {club.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Club Detail Modal */}
      <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedClub && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedClub.name}</DialogTitle>
                <DialogDescription>
                  Coordinator: {selectedClub.coordinator}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-muted-foreground">{selectedClub.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    {selectedClub.members.length} {selectedClub.members.length === 1 ? "Member" : "Members"}
                  </Badge>
                </div>

                {/* Members Section - Only visible to admin */}
                {isAdmin && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Members</h4>
                      <Button
                        size="sm"
                        onClick={() => setShowAddMember(true)}
                        className="gap-1"
                      >
                        <UserPlus className="h-4 w-4" />
                        Add Member
                      </Button>
                    </div>

                    {selectedClub.members.length > 0 ? (
                      <div className="space-y-2">
                        {selectedClub.members.map((member: ClubMember) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
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
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4 bg-muted rounded-lg">
                        No members added yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Related Events */}
                <div>
                  <h4 className="font-semibold mb-3">Related Events</h4>
                  {clubEvents.length > 0 ? (
                    <div className="space-y-2">
                      {clubEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 bg-muted rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(event.date), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.participantCount} registered
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4 bg-muted rounded-lg">
                      No events scheduled for this club.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog - Only accessible by admin */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Add a new member to {selectedClub?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">Name</Label>
              <Input
                id="memberName"
                placeholder="Enter member name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberEmail">Email</Label>
              <Input
                id="memberEmail"
                type="email"
                placeholder="Enter member email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberRole">Role</Label>
              <Input
                id="memberRole"
                placeholder="e.g., Member, Secretary, Treasurer"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddMember(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

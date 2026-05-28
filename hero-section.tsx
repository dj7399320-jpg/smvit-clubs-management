"use client"

import Image from "next/image"
import { useApp, Announcement } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Users, Megaphone, ExternalLink } from "lucide-react"
import { format } from "date-fns"

interface HeroSectionProps {
  onNavigate: (page: string) => void
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { announcements, events } = useApp()

  const upcomingEvents = events.slice(0, 3)
  const latestAnnouncements = announcements.slice(0, 3)

  const handleAnnouncementClick = (announcement: Announcement) => {
    switch (announcement.type) {
      case "event":
        onNavigate("events")
        break
      case "club":
        onNavigate("clubs")
        break
      case "audition":
        onNavigate("auditions")
        break
      case "deadline":
        onNavigate("events")
        break
      default:
        // general announcements stay on page
        break
    }
  }

  const getAnnouncementLink = (type: string) => {
    switch (type) {
      case "event":
      case "deadline":
        return "View Events"
      case "club":
        return "View Clubs"
      case "audition":
        return "View Auditions"
      default:
        return null
    }
  }

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/images/campus.png"
          alt="Sir MVIT Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance leading-tight">
            Empowering Innovation, Culture & Student Communities
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl text-pretty">
            Official Clubs & Events Management Portal of Sir M. Visvesvaraya Institute of Technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => onNavigate("clubs")}
              size="lg"
              className="gap-2 bg-white text-charcoal hover:bg-white/90"
            >
              Explore Clubs
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onNavigate("events")}
              size="lg"
              variant="outline"
              className="gap-2 border-white text-white hover:bg-white/10"
            >
              View Events
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Latest Announcements</h2>
          </div>
          
          {latestAnnouncements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestAnnouncements.map((announcement) => {
                const linkText = getAnnouncementLink(announcement.type)
                const isClickable = linkText !== null
                
                return (
                  <Card 
                    key={announcement.id} 
                    className={`border-l-4 border-l-primary ${isClickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
                    onClick={isClickable ? () => handleAnnouncementClick(announcement) : undefined}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {announcement.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(announcement.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {announcement.content}
                      </p>
                      {isClickable && (
                        <div className="flex items-center gap-1 text-xs text-primary font-medium">
                          <ExternalLink className="h-3 w-3" />
                          {linkText}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No announcements yet.</p>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="text-3xl font-bold mb-1">11+</h3>
                <p className="text-muted-foreground">Active Clubs</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="text-3xl font-bold mb-1">{events.length}+</h3>
                <p className="text-muted-foreground">Upcoming Events</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-secondary/50 to-secondary/70 border-secondary">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="text-3xl font-bold mb-1">500+</h3>
                <p className="text-muted-foreground">Active Members</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <Button variant="ghost" onClick={() => onNavigate("events")} className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("events")}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge>{event.clubName}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "MMM d")}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.participantCount} registered
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

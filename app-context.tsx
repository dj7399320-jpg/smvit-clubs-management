"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "student" | "admin" | null

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface ClubMember {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
}

export interface Club {
  id: string
  name: string
  coordinator: string
  description: string
  members: ClubMember[]
  memberCount: number
  image?: string
}

export interface EventRegistration {
  userId: string
  name: string
  email: string
  phone: string
  usn: string
  branch: string
  semester: string
  registeredAt: string
}

export interface Event {
  id: string
  title: string
  clubId: string
  clubName: string
  venue: string
  date: string
  deadline: string
  description: string
  participantCount: number
  registeredUsers: string[]
  registrations: EventRegistration[]
  maxParticipants: number
}

export interface Audition {
  id: string
  clubId: string
  clubName: string
  title: string
  description: string
  venue: string
  date: string
  eligibility: string
  maxApplicants: number
  applicants: string[]
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: "event" | "club" | "audition" | "deadline" | "general"
  linkedId?: string
  createdAt: string
  createdBy: string
}

interface AppContextType {
  user: User | null
  clubs: Club[]
  events: Event[]
  auditions: Audition[]
  announcements: Announcement[]
  login: (role: UserRole, name?: string, email?: string) => void
  logout: () => void
  addClub: (club: Omit<Club, "id" | "members" | "memberCount">) => void
  updateClub: (id: string, club: Partial<Club>) => void
  deleteClub: (id: string) => void
  addMember: (clubId: string, member: Omit<ClubMember, "id" | "joinedAt">) => void
  removeMember: (clubId: string, memberId: string) => void
  addEvent: (event: Omit<Event, "id" | "participantCount" | "registeredUsers">) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  registerForEvent: (eventId: string, registration: Omit<EventRegistration, "userId" | "registeredAt">) => void
  addAudition: (audition: Omit<Audition, "id" | "applicants">) => void
  updateAudition: (id: string, audition: Partial<Audition>) => void
  deleteAudition: (id: string) => void
  applyForAudition: (auditionId: string) => void
  addAnnouncement: (announcement: Omit<Announcement, "id" | "createdAt" | "createdBy">) => void
  deleteAnnouncement: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialClubs: Club[] = [
  { id: "1", name: "GAP", coordinator: "Mr. Vishwash U M", description: "Green Ambassadors Program - Environmental awareness and sustainability initiatives", members: [], memberCount: 0 },
  { id: "2", name: "KARUNA", coordinator: "Dr. Priya Narayan", description: "Social welfare and community service club", members: [], memberCount: 0 },
  { id: "3", name: "MVIT_Quillz", coordinator: "R. Latha", description: "Quiz club for knowledge enthusiasts", members: [], memberCount: 0 },
  { id: "4", name: "Sundarasrishti", coordinator: "Suraj Kumar B P", description: "Arts and crafts club promoting creativity", members: [], memberCount: 0 },
  { id: "5", name: "Laasya - The Dance Club", coordinator: "Dr. Chaya T Y", description: "Classical and contemporary dance performances", members: [], memberCount: 0 },
  { id: "6", name: "Alekhya - The Literary Club", coordinator: "Ms. R. Latha", description: "Literature, poetry, and creative writing", members: [], memberCount: 0 },
  { id: "7", name: "TechHub", coordinator: "Mrs. Sneha Bharti", description: "Technology innovation and coding community", members: [], memberCount: 0 },
  { id: "8", name: "SMVIT_DebSoc", coordinator: "Mrs. R. Latha", description: "Debate society for public speaking and argumentation", members: [], memberCount: 0 },
  { id: "9", name: "Hongirana", coordinator: "Prashanth B.B", description: "Kannada cultural club celebrating regional heritage", members: [], memberCount: 0 },
  { id: "10", name: "Kalakriti", coordinator: "Ms. Vani Harave", description: "Fine arts and painting club", members: [], memberCount: 0 },
  { id: "11", name: "Susamkruthi", coordinator: "Priyanka Sharma", description: "Cultural activities and traditional events", members: [], memberCount: 0 },
]

const initialEvents: Event[] = [
  {
    id: "1",
    title: "TechHack 2024 - Annual Hackathon",
    clubId: "7",
    clubName: "TechHub",
    venue: "Main Auditorium, Block A",
    date: "2024-03-15",
    deadline: "2024-03-10",
    description: "24-hour hackathon with exciting prizes. Build innovative solutions for real-world problems.",
    participantCount: 0,
    registeredUsers: [],
    registrations: [],
    maxParticipants: 200,
  },
]

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to Sir MVIT Clubs Portal",
    content: "Explore various clubs and register for upcoming events. Stay connected with your campus community!",
    type: "general",
    createdAt: new Date().toISOString(),
    createdBy: "Admin",
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [clubs, setClubs] = useState<Club[]>(initialClubs)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [auditions, setAuditions] = useState<Audition[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("mvit_user")
    const savedClubs = localStorage.getItem("mvit_clubs")
    const savedEvents = localStorage.getItem("mvit_events")
    const savedAuditions = localStorage.getItem("mvit_auditions")
    const savedAnnouncements = localStorage.getItem("mvit_announcements")

    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedClubs) setClubs(JSON.parse(savedClubs))
    if (savedEvents) setEvents(JSON.parse(savedEvents))
    if (savedAuditions) setAuditions(JSON.parse(savedAuditions))
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements))
    
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem("mvit_user", JSON.stringify(user))
      } else {
        localStorage.removeItem("mvit_user")
      }
    }
  }, [user, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mvit_clubs", JSON.stringify(clubs))
    }
  }, [clubs, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mvit_events", JSON.stringify(events))
    }
  }, [events, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mvit_auditions", JSON.stringify(auditions))
    }
  }, [auditions, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mvit_announcements", JSON.stringify(announcements))
    }
  }, [announcements, isLoaded])

  const login = (role: UserRole, name?: string, email?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || (role === "admin" ? "Admin User" : "Student User"),
      email: email || (role === "admin" ? "admin@sirmvit.edu" : "student@sirmvit.edu"),
      role,
    }
    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
  }

  const addClub = (club: Omit<Club, "id" | "members" | "memberCount">) => {
    const newClub: Club = {
      ...club,
      id: Math.random().toString(36).substr(2, 9),
      members: [],
      memberCount: 0,
    }
    setClubs((prev) => [...prev, newClub])
  }

  const updateClub = (id: string, updatedClub: Partial<Club>) => {
    setClubs((prev) => prev.map((club) => (club.id === id ? { ...club, ...updatedClub } : club)))
  }

  const deleteClub = (id: string) => {
    setClubs((prev) => prev.filter((club) => club.id !== id))
  }

  const addMember = (clubId: string, member: Omit<ClubMember, "id" | "joinedAt">) => {
    const newMember: ClubMember = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
      joinedAt: new Date().toISOString(),
    }
    setClubs((prev) =>
      prev.map((club) =>
        club.id === clubId
          ? { ...club, members: [...club.members, newMember], memberCount: club.memberCount + 1 }
          : club
      )
    )
  }

  const removeMember = (clubId: string, memberId: string) => {
    setClubs((prev) =>
      prev.map((club) =>
        club.id === clubId
          ? {
              ...club,
              members: club.members.filter((m) => m.id !== memberId),
              memberCount: Math.max(0, club.memberCount - 1),
            }
          : club
      )
    )
  }

  const addEvent = (event: Omit<Event, "id" | "participantCount" | "registeredUsers" | "registrations">) => {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      participantCount: 0,
      registeredUsers: [],
      registrations: [],
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)))
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const registerForEvent = (eventId: string, registration: Omit<EventRegistration, "userId" | "registeredAt">) => {
    if (!user) return
    const newRegistration: EventRegistration = {
      ...registration,
      userId: user.id,
      registeredAt: new Date().toISOString(),
    }
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId && !event.registeredUsers.includes(user.id)
          ? {
              ...event,
              registeredUsers: [...event.registeredUsers, user.id],
              registrations: [...event.registrations, newRegistration],
              participantCount: event.participantCount + 1,
            }
          : event
      )
    )
  }

  const addAudition = (audition: Omit<Audition, "id" | "applicants">) => {
    const newAudition: Audition = {
      ...audition,
      id: Math.random().toString(36).substr(2, 9),
      applicants: [],
    }
    setAuditions((prev) => [...prev, newAudition])
  }

  const updateAudition = (id: string, updatedAudition: Partial<Audition>) => {
    setAuditions((prev) =>
      prev.map((audition) => (audition.id === id ? { ...audition, ...updatedAudition } : audition))
    )
  }

  const deleteAudition = (id: string) => {
    setAuditions((prev) => prev.filter((audition) => audition.id !== id))
  }

  const applyForAudition = (auditionId: string) => {
    if (!user) return
    setAuditions((prev) =>
      prev.map((audition) =>
        audition.id === auditionId && !audition.applicants.includes(user.id)
          ? { ...audition, applicants: [...audition.applicants, user.id] }
          : audition
      )
    )
  }

  const addAnnouncement = (announcement: Omit<Announcement, "id" | "createdAt" | "createdBy">) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      createdBy: user?.name || "Admin",
    }
    setAnnouncements((prev) => [newAnnouncement, ...prev])
  }

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        clubs,
        events,
        auditions,
        announcements,
        login,
        logout,
        addClub,
        updateClub,
        deleteClub,
        addMember,
        removeMember,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        addAudition,
        updateAudition,
        deleteAudition,
        applyForAudition,
        addAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

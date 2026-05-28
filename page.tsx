"use client"

import { useState } from "react"
import { AppProvider } from "@/lib/app-context"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ClubDirectory } from "@/components/club-directory"
import { EventsPortal } from "@/components/events-portal"
import { AuditionsPage } from "@/components/auditions-page"
import { AboutSection } from "@/components/about-section"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ChatAssistant } from "@/components/chat-assistant"
import { Footer } from "@/components/footer"

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HeroSection onNavigate={setCurrentPage} />
      case "clubs":
        return <ClubDirectory />
      case "events":
        return <EventsPortal />
      case "auditions":
        return <AuditionsPage />
      case "about":
        return <AboutSection />
      case "admin":
        return <AdminDashboard />
      default:
        return <HeroSection onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <ChatAssistant />
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

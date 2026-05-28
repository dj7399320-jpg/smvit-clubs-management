"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  isBot: boolean
}

const botResponses: Record<string, string> = {
  default: "I'm here to help! You can ask me about clubs, events, registration, or auditions at Sir MVIT.",
  clubs: "Sir MVIT has 11+ active clubs including TechHub, Laasya (Dance), Alekhya (Literary), GAP, KARUNA, and more. Visit the Club Directory to explore all clubs and their activities!",
  events: "Check out the Events Portal to see upcoming events. You can register for hackathons, cultural fests, workshops, and more. Make sure you're logged in to register!",
  register: "To register for an event: 1) Login to your account, 2) Go to Events Portal, 3) Click 'Register Now' on any event before the deadline. Your registration will be confirmed instantly!",
  auditions: "Auditions are held by various clubs throughout the year. Visit the Auditions page to see open auditions and apply. Remember to check eligibility requirements before applying!",
  join: "To join a club, you can: 1) Apply through club auditions when open, 2) Contact the club coordinator directly, or 3) Visit the club desk during orientation week.",
  contact: "You can reach Sir MVIT at: Phone: 080 2846 7248, Email: info@sirmvit.edu. Visit the About section for more contact details.",
  help: "I can help you with:\n• Club information\n• Event registration\n• Audition details\n• How to join clubs\n• Contact information\n\nJust ask!",
}

function getBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("club")) return botResponses.clubs
  if (lowerMessage.includes("event")) return botResponses.events
  if (lowerMessage.includes("register") || lowerMessage.includes("sign up")) return botResponses.register
  if (lowerMessage.includes("audition")) return botResponses.auditions
  if (lowerMessage.includes("join") || lowerMessage.includes("member")) return botResponses.join
  if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email")) return botResponses.contact
  if (lowerMessage.includes("help") || lowerMessage.includes("what can")) return botResponses.help
  
  return botResponses.default
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm the Sir MVIT Assistant. How can I help you today? Ask me about clubs, events, or registrations!",
      isBot: true,
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: getBotResponse(input),
      isBot: true,
    }

    setMessages((prev) => [...prev, userMessage, botMessage])
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 shadow-xl z-50 border-2">
          <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Sir MVIT Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.isBot
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.isBot ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 max-w-[75%] text-sm ${
                        message.isBot
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about clubs, events..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react"

export function AboutSection() {
  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">About Sir MVIT</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sir M. Visvesvaraya Institute of Technology is committed to nurturing
            innovation, creativity, and holistic development of students.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be a center of excellence in technical education, research, and
                  innovation that produces globally competent professionals who
                  contribute to the advancement of society.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Provide quality education with state-of-the-art infrastructure
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Foster innovation and entrepreneurship among students
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Promote research and collaboration with industry
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Develop socially responsible and ethical professionals
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Clubs & Activities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our diverse range of clubs covers technical, cultural, literary,
                  and social domains. These clubs provide platforms for students to
                  explore their interests, develop leadership skills, and build
                  lasting connections with peers who share similar passions.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a
                        href="tel:08028467248"
                        className="font-medium hover:text-primary transition-colors"
                      >
                        080 2846 7248
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href="mailto:info@sirmvit.edu"
                        className="font-medium hover:text-primary transition-colors"
                      >
                        info@sirmvit.edu
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        NH-4, Bangalore - Pune Highway,
                        <br />
                        Krishnadevaraya Nagar, Hunasamaranahalli,
                        <br />
                        Bengaluru, Karnataka 562157
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a
                        href="https://www.sirmvit.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary transition-colors"
                      >
                        www.sirmvit.edu
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Get Involved</h3>
                <p className="leading-relaxed opacity-90">
                  Join our vibrant community of clubs and organizations. Whether
                  you&apos;re interested in technology, arts, literature, or social
                  service, there&apos;s a place for you at Sir MVIT. Start your journey
                  today!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

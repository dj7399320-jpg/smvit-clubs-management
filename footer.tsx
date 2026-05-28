import { Phone, Mail, MapPin, GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6" />
              <span className="font-semibold">Sir MVIT</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Sir M. Visvesvaraya Institute of Technology - Empowering students
              through quality education and holistic development.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="https://www.sirmvit.edu/" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">
                  Official Website
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Student Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Faculty Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Placement Cell
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:08028467248" className="hover:text-background transition-colors">
                  080 2846 7248
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@sirmvit.edu" className="hover:text-background transition-colors">
                  info@sirmvit.edu
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Bengaluru, Karnataka 562157</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Clubs Portal</h4>
            <p className="text-sm text-background/70">
              Official Clubs & Events Management Portal. Connect, collaborate,
              and grow with your campus community.
            </p>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          <p>© {new Date().getFullYear()} Sir M. Visvesvaraya Institute of Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

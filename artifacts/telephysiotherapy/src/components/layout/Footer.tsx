import { Link } from "wouter";
import { Activity, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TelePhysio
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Expert rehabilitation care brought directly to you. We blend clinical credibility with the warmth and convenience of digital healthcare.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/services/online", label: "Online Sessions" },
                { href: "/symptoms", label: "Symptoms Guide" },
                { href: "/faqs", label: "FAQs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal & More</h3>
            <ul className="space-y-2">
              {[
                { href: "/technology", label: "Our Technology" },
                { href: "/blog", label: "Blog & Success Stories" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123 Health Ave, Suite 400<br/>Medical District, MD 10001</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hello@telephysio.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} TelePhysio Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

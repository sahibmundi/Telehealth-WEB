import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/technology", label: "Technology" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    setPatientId(localStorage.getItem("patientId"));
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold tracking-tight text-foreground leading-tight block">TelePhysio</span>
            <span className="text-[10px] text-muted-foreground leading-tight block">SGGSWU</span>
          </div>
          <span className="sm:hidden text-base font-bold tracking-tight text-foreground">TelePhysio</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center shrink-0">
          {patientId ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Book Appointment
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] flex flex-col pt-0">
            <div className="flex items-center gap-2 py-5 border-b border-border mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold text-foreground block leading-tight">TelePhysio</span>
                <span className="text-[11px] text-muted-foreground">Sri Guru Granth Sahib World University</span>
              </div>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                    location === link.href || (link.href !== "/" && location.startsWith(link.href))
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pb-6 pt-4 border-t border-border">
              {patientId ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-md text-sm font-semibold h-11 bg-primary text-primary-foreground hover:bg-primary/90 w-full transition-colors"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-md text-sm font-semibold h-11 bg-primary text-primary-foreground hover:bg-primary/90 w-full transition-colors"
                >
                  Book Appointment
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

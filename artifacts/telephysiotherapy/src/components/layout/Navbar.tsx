import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setPatientId(localStorage.getItem("patientId"));
  }, [location]);

  const onHome = location === "/";
  const transparent = onHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white shadow-sm border-b border-border"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <span
            className={`text-lg font-bold tracking-tight transition-colors ${
              transparent ? "text-white" : "text-foreground"
            }`}
          >
            TelePhysio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? transparent
                      ? "text-white bg-white/15"
                      : "text-primary bg-primary/8"
                    : transparent
                    ? "text-white/85 hover:text-white hover:bg-white/15"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {patientId ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 transition-colors shadow ${
                transparent
                  ? "bg-white text-primary hover:bg-white/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              Book Appointment
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className={transparent ? "text-white hover:bg-white/15" : "text-foreground"}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] flex flex-col pt-0">
            <div className="flex items-center gap-2 py-5 border-b border-border mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">TelePhysio</span>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
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
                  className="flex items-center justify-center rounded-md text-sm font-medium h-11 px-6 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full transition-colors"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-md text-sm font-medium h-11 px-6 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-full transition-colors"
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

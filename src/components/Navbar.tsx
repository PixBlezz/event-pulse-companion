import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Navbar = ({ onAttendClick }: { onAttendClick?: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-secondary/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={36} />
          <span className="font-poppins font-bold text-primary-foreground text-lg hidden sm:inline">
            COMPSSA Event Pulse
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <Button variant="ghost" onClick={() => scrollTo("events")} className="font-poppins font-semibold text-sm text-primary-foreground/80 hover:text-primary transition-colors">Events</Button>
          <Button variant="ghost" onClick={() => scrollTo("how-it-works")} className="font-poppins font-semibold text-sm text-primary-foreground/80 hover:text-primary transition-colors">How It Works</Button>
          <Button variant="ghost" onClick={() => scrollTo("about")} className="font-poppins font-semibold text-sm text-primary-foreground/80 hover:text-primary transition-colors">About</Button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost"
            onClick={onAttendClick}
            className="bg-primary text-primary-foreground font-poppins font-bold text-sm px-6 py-2.5 rounded-md hover:brightness-110 transition-all active:scale-95 min-h-[44px]"
          >
            Yes, I Am Attending
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Button variant="ghost" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-primary-foreground p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-primary-foreground transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary-foreground transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-secondary/95 backdrop-blur-md border-t border-border/20 px-6 pb-6 space-y-4">
          <Button variant="ghost" onClick={() => scrollTo("events")} className="block w-full text-left font-poppins font-semibold text-primary-foreground py-2">Events</Button>
          <Button variant="ghost" onClick={() => scrollTo("how-it-works")} className="block w-full text-left font-poppins font-semibold text-primary-foreground py-2">How It Works</Button>
          <Button variant="ghost" onClick={() => scrollTo("about")} className="block w-full text-left font-poppins font-semibold text-primary-foreground py-2">About</Button>
          <Button variant="ghost" onClick={() => { onAttendClick?.(); setMobileOpen(false); }} className="w-full bg-primary text-primary-foreground font-poppins font-bold text-sm px-6 py-3 rounded-md min-h-[44px]">Yes, I Am Attending</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

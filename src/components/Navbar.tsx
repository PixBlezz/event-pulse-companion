import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = ({ onAttendClick }: { onAttendClick?: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  

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

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

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
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("events")} className="font-poppins font-semibold text-sm text-primary-foreground/80 hover:text-primary transition-colors">Events</button>
          <button onClick={() => scrollTo("how-it-works")} className="font-poppins font-semibold text-sm text-primary-foreground/80 hover:text-primary transition-colors">How It Works</button>
          <button onClick={() => scrollTo("about")} className="font-poppins font-semibold text-sm text-primary-foreground/80 hover:text-primary transition-colors">About</button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-poppins font-bold text-primary-foreground">{initial}</div>
                <span className="font-poppins font-semibold text-primary-foreground text-sm">{user.name.split(" ")[0]}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border py-2">
                  <button className="w-full text-left px-4 py-2 font-poppins text-sm text-card-foreground hover:bg-muted">My Confirmations</button>
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 font-poppins text-sm text-destructive hover:bg-muted">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="font-poppins font-semibold text-sm text-primary-foreground/80 hover:text-primary transition-colors">Sign In</Link>
              <button
                onClick={onAttendClick}
                className="bg-primary text-primary-foreground font-poppins font-bold text-sm px-6 py-2.5 rounded-full hover:brightness-110 transition-all active:scale-95 min-h-[44px]"
              >
                Yes, I Am Attending
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-primary-foreground p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-primary-foreground transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-primary-foreground transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-secondary/95 backdrop-blur-md border-t border-border/20 px-6 pb-6 space-y-4">
          <button onClick={() => scrollTo("events")} className="block w-full text-left font-poppins font-semibold text-primary-foreground py-2">Events</button>
          <button onClick={() => scrollTo("how-it-works")} className="block w-full text-left font-poppins font-semibold text-primary-foreground py-2">How It Works</button>
          <button onClick={() => scrollTo("about")} className="block w-full text-left font-poppins font-semibold text-primary-foreground py-2">About</button>
          {user ? (
            <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left font-poppins font-semibold text-destructive py-2">Sign Out</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block font-poppins font-semibold text-primary-foreground py-2">Sign In</Link>
              <button onClick={() => { onAttendClick?.(); setMobileOpen(false); }} className="w-full bg-primary text-primary-foreground font-poppins font-bold text-sm px-6 py-3 rounded-full min-h-[44px]">Yes, I Am Attending</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

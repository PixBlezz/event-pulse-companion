import Logo from "./Logo";

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-3 gap-10 mb-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-poppins font-bold text-lg">COMPSSA</span>
          </div>
          <p className="font-poppins font-light text-secondary-foreground/60 text-sm max-w-xs">
            Connecting CS students, one event at a time.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-poppins font-bold text-sm mb-2">Quick Links</h4>
          <a href="#events" className="font-poppins text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Events</a>
          <a href="#how-it-works" className="font-poppins text-sm text-secondary-foreground/60 hover:text-primary transition-colors">How It Works</a>
          <a href="#about" className="font-poppins text-sm text-secondary-foreground/60 hover:text-primary transition-colors">About</a>
          <a href="mailto:events@compssa.org" className="font-poppins text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Contact Rep</a>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-poppins font-bold text-sm mb-2">Contact</h4>
          <p className="font-poppins text-sm text-secondary-foreground/60">events@compssa.org</p>
          <p className="font-poppins text-sm text-secondary-foreground/60">Built by a COMPSSA member · 2025</p>
        </div>
      </div>
      <div className="border-t border-primary/30 pt-6">
        <p className="font-poppins text-xs text-secondary-foreground/40 text-center">
          © 2025 COMPSSA Event Pulse. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

const Hero = ({ onAttendClick }: { onAttendClick: () => void }) => {
  const scrollToEvents = () => {
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1400')" }}
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)]" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <span className="inline-block bg-primary/20 border border-primary/40 text-primary font-poppins font-semibold text-sm px-5 py-2 rounded-full mb-8">
          🟠 COMPSSA · CS Students Association
        </span>
        <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl md:text-[56px] leading-tight text-primary-foreground mb-6">
          Never Miss Another COMPSSA Event Again.
        </h1>
        <p className="font-poppins font-light text-primary-foreground/70 text-lg md:text-xl max-w-xl mx-auto mb-10">
          Stay informed, show up, and be part of the COMPSSA community. Get instant alerts for every workshop, seminar, and event.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={scrollToEvents}
            className="bg-primary text-primary-foreground font-poppins font-bold text-base px-8 py-3.5 rounded-full hover:brightness-110 transition-all active:scale-95 min-h-[44px]"
          >
            See Upcoming Events ↓
          </button>
          <button
            onClick={onAttendClick}
            className="border-2 border-primary-foreground/40 text-primary-foreground font-poppins font-semibold text-base px-8 py-3.5 rounded-full hover:bg-primary-foreground/10 transition-all min-h-[44px]"
          >
            Get Email Alerts
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {["12 Events This Semester", "340 Members Reached", "Free to Use"].map((stat) => (
            <span key={stat} className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground font-poppins text-sm px-5 py-2 rounded-full">
              {stat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { useState } from "react";
import AttendModal from "./AttendModal";

export const EVENTS = [
  {
    title: "Industry Night with Tech Leaders",
    date: "Fri 14 Mar",
    venue: "CS Auditorium",
    going: 90,
    tag: "Workshop",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
    desc: "Connect with industry professionals and learn about career paths in tech. Networking, panels, and hands-on demos.",
  },
  {
    title: "AI & Machine Learning Seminar",
    date: "Wed 19 Mar",
    venue: "Lecture Hall A",
    going: 54,
    tag: "Seminar",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    desc: "Dive deep into the latest AI trends with guest speakers from top tech companies.",
  },
  {
    title: "COMPSSA Hackathon 2025",
    date: "Sat 29 Mar",
    venue: "Computer Lab",
    going: 120,
    tag: "Hackathon",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600",
    desc: "48 hours of coding, creativity and competition. Build something amazing with your team.",
  },
];

const EventsGrid = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const openModal = (title: string) => {
    setSelectedEvent(title);
    setModalOpen(true);
  };

  return (
    <section id="events" className="py-20 bg-background">
      <div className="container mx-auto">
        <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-foreground mb-12 text-center fade-up">
          What's On
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS.map((event) => (
            <div
              key={event.title}
              className="fade-up group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
            >
              <div className="relative h-[200px] overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground font-poppins font-bold text-xs px-3 py-1.5 rounded-full">{event.tag}</span>
                <span className="absolute top-3 right-3 bg-secondary/80 text-secondary-foreground font-poppins font-semibold text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">{event.date}</span>
              </div>
              <div className="p-5">
                <h3 className="font-poppins font-bold text-lg text-card-foreground mb-2">{event.title}</h3>
                <p className="font-poppins text-muted-foreground text-sm mb-3 leading-relaxed">{event.desc}</p>
                <p className="font-poppins text-sm text-muted-foreground mb-3">📍 {event.venue}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                        <span className="text-[10px] font-poppins font-bold text-primary">{["K", "A", "J"][i]}</span>
                      </div>
                    ))}
                  </div>
                  <span className="font-poppins text-xs text-muted-foreground">{event.going} people going</span>
                </div>
                <button
                  onClick={() => openModal(event.title)}
                  className="w-full bg-primary text-primary-foreground font-poppins font-bold text-sm py-3 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] min-h-[44px]"
                >
                  Yes, I Am Attending
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AttendModal open={modalOpen} onClose={() => setModalOpen(false)} eventTitle={selectedEvent} />
    </section>
  );
};

export default EventsGrid;

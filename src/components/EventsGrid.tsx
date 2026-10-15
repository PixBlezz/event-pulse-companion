import { useState } from "react";
import AttendModal from "./AttendModal";
import { Button } from "@/components/ui/button";
import { EVENTS } from "@/lib/events";
import { useAttendanceTotals } from "@/hooks/useAttendanceTotals";
export { EVENTS } from "@/lib/events";

const EventsGrid = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const totals = useAttendanceTotals();
  return (
    <section id="events" className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div><p className="text-primary text-xs font-semibold mb-2">THE COMPSSA CALENDAR</p><h2 className="font-extrabold text-3xl md:text-4xl">What's On</h2></div>
          <p className="text-sm text-muted-foreground">{EVENTS.length} events · {totals.isError ? "Counts unavailable" : "Confirmed participation"}</p>
        </div>
        {totals.isError && <div role="status" className="flex items-center gap-3 mb-5 text-sm text-muted-foreground">Attendance counts are temporarily unavailable.<Button variant="link" onClick={() => totals.refetch()}>Try again</Button></div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((event) => (
            <article key={event.title} className="group flex flex-col bg-card rounded-lg border border-border overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={event.image} alt={event.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-4 left-4 bg-card text-card-foreground font-semibold text-xs px-3 py-1.5 rounded-md">{event.tag}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-primary text-xs font-semibold mb-3">{event.date} <span className="text-muted-foreground">· {event.venue}</span></p>
                <h3 className="font-bold text-lg text-card-foreground leading-snug mb-3">{event.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{event.desc}</p>
                <div className="flex items-center gap-2 border-t border-border pt-4 mb-4"><span className="w-2 h-2 rounded-full bg-success" aria-hidden="true" /><span className="text-sm text-muted-foreground"><strong className="text-foreground tabular-nums">{totals.data ? totals.data.events[event.title] ?? 0 : "—"}</strong> people going</span></div>
                <Button onClick={() => setSelectedEvent(event.title)} className="w-full font-semibold">Yes, I Am Attending <span aria-hidden="true">↗</span></Button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <AttendModal open={selectedEvent !== null} onClose={() => setSelectedEvent(null)} eventTitle={selectedEvent ?? undefined} />
    </section>
  );
};
export default EventsGrid;

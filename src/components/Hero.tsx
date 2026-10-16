import { Button } from "@/components/ui/button";
import { useAttendanceTotals } from "@/hooks/useAttendanceTotals";
import { useEvents } from "@/hooks/useEvents";

const Hero = ({ onAttendClick }: { onAttendClick: () => void }) => {
  const totals = useAttendanceTotals();
  const events = useEvents();
  return (
    <section className="relative flex items-center min-h-[620px] h-[78vh] max-h-[820px] overflow-hidden bg-secondary">
      <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1800" alt="Students gathering at a university event" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 hero-shade" />
      <div className="container relative z-10 pt-24 pb-12">
        <div className="max-w-2xl">
          <p className="text-primary font-semibold text-sm mb-4">YOUR COMMUNITY. YOUR NEXT EVENT.</p>
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight text-primary-foreground mb-6">COMPSSA<br />Event Pulse<span className="text-primary">.</span></h1>
          <p className="text-primary-foreground/85 text-base sm:text-lg max-w-lg leading-relaxed mb-8">Never miss another COMPSSA event. Meet your people, explore new ideas, and be part of what happens next.</p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Button size="lg" onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })} className="font-semibold">Explore Events <span aria-hidden="true">↗</span></Button>
            <Button size="lg" variant="ghost" onClick={onAttendClick} className="border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">Yes, I Am Attending</Button>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-primary-foreground/20 pt-6 text-primary-foreground">
            <div><strong className="text-2xl font-bold tabular-nums">{events.data?.length ?? "—"}</strong><p className="text-xs text-primary-foreground/75 mt-1">Events listed</p></div>
            <div><strong className="text-2xl font-bold tabular-nums">{totals.data?.students ?? "—"}</strong><p className="text-xs text-primary-foreground/75 mt-1">Students confirmed</p></div>
            <div><strong className="text-2xl font-bold tabular-nums">{totals.data?.confirmations ?? "—"}</strong><p className="text-xs text-primary-foreground/75 mt-1">Event confirmations</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;

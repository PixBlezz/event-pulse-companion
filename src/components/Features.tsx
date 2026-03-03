const FEATURES = [
  { title: "Events Posted in Seconds", desc: "The COMPSSA rep publishes structured events instantly." },
  { title: "You Get an Email Alert", desc: "Automated email via Gmail the moment an event goes live." },
  { title: "Browser Reminders Too", desc: "Push notification pops up 1 hour before it starts." },
  { title: "Rep Sees Who's Coming", desc: "Live count of confirmed attendees before every event." },
];

const Features = () => (
  <section id="about" className="py-20 bg-background">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden fade-up">
        <div className="h-80 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800"
            alt="Diverse group of students"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-secondary p-8 md:p-12 flex flex-col justify-center">
          <h2 className="font-poppins font-extrabold text-3xl text-secondary-foreground mb-8">
            Why COMPSSA Event Pulse
          </h2>
          <div className="space-y-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-poppins font-bold text-base text-secondary-foreground">{f.title}</h3>
                  <p className="font-poppins text-secondary-foreground/60 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Features;

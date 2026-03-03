const STEPS = [
  {
    num: "01",
    title: "Browse Events",
    desc: "Scroll through the latest COMPSSA events — workshops, seminars, hackathons and more.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500",
  },
  {
    num: "02",
    title: "Confirm You're Coming",
    desc: "Hit the attend button and we'll save your spot. It takes less than 10 seconds.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500",
  },
  {
    num: "03",
    title: "Show Up & Participate",
    desc: "Get a reminder, come to the event, and connect with your CS community.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-muted">
    <div className="container mx-auto">
      <h2 className="font-poppins font-extrabold text-3xl md:text-4xl text-foreground mb-14 text-center fade-up">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-10">
        {STEPS.map((step) => (
          <div key={step.num} className="fade-up text-center">
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
              <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
            </div>
            <span className="font-poppins font-extrabold text-5xl text-primary">{step.num}</span>
            <h3 className="font-poppins font-bold text-xl text-foreground mt-3 mb-2">{step.title}</h3>
            <p className="font-poppins text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

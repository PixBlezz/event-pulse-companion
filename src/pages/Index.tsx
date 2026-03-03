import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventsGrid from "@/components/EventsGrid";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import AttendModal from "@/components/AttendModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAttendClick={() => setModalOpen(true)} />
      <Hero onAttendClick={() => setModalOpen(true)} />
      <EventsGrid />
      <HowItWorks />
      <Features />
      <Footer />
      <AttendModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Index;

import { useState } from "react";
import Logo from "./Logo";
import { supabase } from "@/integrations/supabase/client";

interface AttendModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle?: string;
}

const LEVELS = ["Level 100", "Level 200", "Level 300", "Level 400", "Postgraduate"];

const emptyForm = { name: "", email: "", studentId: "", level: "", phone: "", reason: "" };

const AttendModal = ({ open, onClose, eventTitle }: AttendModalProps) => {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});

  if (!open) return null;

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email";
    if (!form.studentId.trim()) e.studentId = "Please enter your Student ID";
    if (!form.level) e.level = "Please select your level";
    if (!form.phone.trim()) e.phone = "Please enter your WhatsApp number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    const { error } = await supabase.from("attendees").insert({
      event_title: eventTitle || "General",
      name: form.name.trim().slice(0, 100),
      email: form.email.trim().slice(0, 255),
      student_id: form.studentId.trim().slice(0, 20),
      level: form.level,
      phone: form.phone.trim().slice(0, 20),
      reason: form.reason.trim().slice(0, 500) || null,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrors({});
    setSubmitError("");
    setForm(emptyForm);
    onClose();
  };

  const inputClass = (key: keyof typeof emptyForm) =>
    `w-full px-4 py-3 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground min-h-[44px] ${errors[key] ? "border-destructive" : "border-input"}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary/60 backdrop-blur-sm" onClick={handleClose}>
      <div className="bg-card rounded-3xl shadow-2xl max-w-[440px] w-full mx-4 p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <Logo size={32} />
          <h2 className="font-poppins font-extrabold text-xl text-card-foreground">Confirm Your Attendance</h2>
        </div>
        {eventTitle && <p className="font-poppins font-semibold text-primary text-sm mb-1">{eventTitle}</p>}
        <p className="font-poppins text-muted-foreground text-sm mb-6">Fill this quick form — no account needed. We'll send you a reminder before the event.</p>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-check-pop">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="font-poppins font-bold text-lg text-card-foreground">🎉 You're confirmed!</p>
            <p className="font-poppins text-muted-foreground text-sm mt-2">See you there, {form.name.split(" ")[0]}!</p>
            <button onClick={handleClose} className="mt-6 bg-primary text-primary-foreground font-poppins font-bold px-8 py-3 rounded-full min-h-[44px]">Done</button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input value={form.name} onChange={set("name")} placeholder="Full name — e.g. Kwame Mensah" maxLength={100} className={inputClass("name")} />
              {errors.name && <p className="text-destructive text-xs mt-1 font-poppins">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <input value={form.email} onChange={set("email")} type="email" placeholder="Email — e.g. kwame@st.ug.edu.gh" maxLength={255} className={inputClass("email")} />
              {errors.email && <p className="text-destructive text-xs mt-1 font-poppins">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <input value={form.studentId} onChange={set("studentId")} placeholder="Student ID — e.g. 10987654" maxLength={20} className={inputClass("studentId")} />
              {errors.studentId && <p className="text-destructive text-xs mt-1 font-poppins">{errors.studentId}</p>}
            </div>
            <div className="mb-4">
              <select value={form.level} onChange={set("level")} className={inputClass("level")}>
                <option value="">Select your Level</option>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              {errors.level && <p className="text-destructive text-xs mt-1 font-poppins">{errors.level}</p>}
            </div>
            <div className="mb-4">
              <input value={form.phone} onChange={set("phone")} type="tel" placeholder="WhatsApp number — e.g. 024 123 4567" maxLength={20} className={inputClass("phone")} />
              {errors.phone && <p className="text-destructive text-xs mt-1 font-poppins">{errors.phone}</p>}
            </div>
            <div className="mb-6">
              <textarea value={form.reason} onChange={set("reason")} placeholder="Why will you be attending? (optional)" maxLength={500} rows={3} className="w-full px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none" />
            </div>

            {submitError && <p className="text-destructive text-sm font-poppins mb-4 text-center">{submitError}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground font-poppins font-bold text-base py-3.5 rounded-full hover:brightness-110 transition-all active:scale-[0.98] min-h-[44px] disabled:opacity-60"
            >
              {submitting ? "Confirming..." : "Yes, I Am Attending ✓"}
            </button>
            <button onClick={handleClose} className="w-full text-center text-muted-foreground text-sm font-poppins mt-3 hover:text-foreground transition-colors">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendModal;

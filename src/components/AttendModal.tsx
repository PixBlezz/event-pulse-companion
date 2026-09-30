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
    `w-full px-4 py-3 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors[key] ? "border-destructive" : "border-input"}`;

  const field = (key: keyof typeof emptyForm, label: string, input: React.ReactNode) => (
    <div className="mb-4">
      <label htmlFor={`f-${key}`} className="block font-poppins font-semibold text-xs text-card-foreground mb-1.5">{label}</label>
      {input}
      {errors[key] && <p id={`e-${key}`} role="alert" className="text-destructive text-xs mt-1 font-poppins">{errors[key]}</p>}
    </div>
  );
  const aria = (key: keyof typeof emptyForm) => ({
    id: `f-${key}`,
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary/60 backdrop-blur-sm" onClick={handleClose} onKeyDown={(e) => e.key === "Escape" && handleClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="attend-title" className="bg-card rounded-3xl shadow-2xl max-w-[440px] w-full mx-4 p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <Logo size={32} />
          <h2 id="attend-title" className="font-poppins font-extrabold text-xl text-card-foreground">Confirm Your Attendance</h2>
        </div>
        {eventTitle && <p className="font-poppins font-semibold text-primary text-sm mb-1">{eventTitle}</p>}
        <p className="font-poppins text-muted-foreground text-sm mb-6">Takes under a minute — no account needed.</p>

        {submitted ? (
          <div className="text-center py-8" role="status">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4 animate-check-pop">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success-foreground"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="font-poppins font-bold text-lg text-card-foreground">🎉 You're confirmed!</p>
            <p className="font-poppins text-muted-foreground text-sm mt-2">See you there, {form.name.split(" ")[0]}!</p>
            <button autoFocus onClick={handleClose} className="mt-6 bg-primary text-primary-foreground font-poppins font-bold px-8 py-3 rounded-full min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Done</button>
          </div>
        ) : (
          <form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {field("name", "Full name", <input autoFocus {...aria("name")} value={form.name} onChange={set("name")} autoComplete="name" placeholder="e.g. Kwame Mensah" maxLength={100} className={inputClass("name")} />)}
            {field("email", "Email", <input {...aria("email")} value={form.email} onChange={set("email")} type="email" autoComplete="email" placeholder="e.g. kwame@st.ug.edu.gh" maxLength={255} className={inputClass("email")} />)}
            {field("studentId", "Student ID", <input {...aria("studentId")} value={form.studentId} onChange={set("studentId")} inputMode="numeric" placeholder="e.g. 10987654" maxLength={20} className={inputClass("studentId")} />)}
            {field("level", "Level", (
              <select {...aria("level")} value={form.level} onChange={set("level")} className={inputClass("level")}>
                <option value="">Select your level</option>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            ))}
            {field("phone", "WhatsApp number", <input {...aria("phone")} value={form.phone} onChange={set("phone")} type="tel" autoComplete="tel" placeholder="e.g. 024 123 4567" maxLength={20} className={inputClass("phone")} />)}
            {field("reason", "Why are you attending? (optional)", <textarea id="f-reason" value={form.reason} onChange={set("reason")} placeholder="e.g. I want to meet people in tech" maxLength={500} rows={3} className="w-full px-4 py-3 rounded-xl border border-input font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />)}

            {submitError && <p role="alert" className="text-destructive text-sm font-poppins mb-4 text-center">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="w-full mt-2 bg-primary text-primary-foreground font-poppins font-bold text-base py-3.5 rounded-full hover:brightness-110 transition-all active:scale-[0.98] min-h-[44px] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {submitting ? "Confirming..." : "Yes, I Am Attending ✓"}
            </button>
            <button type="button" onClick={handleClose} className="w-full text-center text-muted-foreground text-sm font-poppins mt-3 min-h-[44px] hover:text-foreground transition-colors">Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AttendModal;

import { useState } from "react";
import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

interface AttendModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle?: string;
}

const AttendModal = ({ open, onClose, eventTitle }: AttendModalProps) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [level, setLevel] = useState(user?.level || "");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; level?: string }>({});

  if (!open) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!email.trim()) e.email = "Please enter your email";
    if (!level) e.level = "Please select your level";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary/60 backdrop-blur-sm" onClick={handleClose}>
      <div className="bg-card rounded-3xl shadow-2xl max-w-[440px] w-full mx-4 p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <Logo size={32} />
          <h2 className="font-poppins font-extrabold text-xl text-card-foreground">Confirm Your Attendance</h2>
        </div>
        {eventTitle && <p className="font-poppins font-semibold text-primary text-sm mb-1">{eventTitle}</p>}
        <p className="font-poppins text-muted-foreground text-sm mb-6">We'll send you a reminder email before the event.</p>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-check-pop">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="font-poppins font-bold text-lg text-card-foreground">🎉 You're confirmed!</p>
            <p className="font-poppins text-muted-foreground text-sm mt-2">Check your email for the reminder.</p>
            <button onClick={handleClose} className="mt-6 bg-primary text-primary-foreground font-poppins font-bold px-8 py-3 rounded-full min-h-[44px]">Done</button>
          </div>
        ) : (
          <>
            {user ? (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="font-poppins text-sm text-card-foreground">Attending as <strong>{user.name}</strong> ({user.email})</p>
              </div>
            ) : null}

            {!user && (
              <>
                <div className="mb-4">
                  <input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="e.g. Kwame Mensah"
                    className={`w-full px-4 py-3 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground min-h-[44px] ${errors.name ? "border-destructive" : "border-input"}`}
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1 font-poppins">{errors.name}</p>}
                </div>
                <div className="mb-4">
                  <input
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="e.g. kwame@email.com"
                    className={`w-full px-4 py-3 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground min-h-[44px] ${errors.email ? "border-destructive" : "border-input"}`}
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1 font-poppins">{errors.email}</p>}
                </div>
                <div className="mb-6">
                  <select
                    value={level}
                    onChange={(e) => { setLevel(e.target.value); setErrors((p) => ({ ...p, level: undefined })); }}
                    className={`w-full px-4 py-3 rounded-xl border font-poppins text-sm bg-background text-foreground min-h-[44px] ${errors.level ? "border-destructive" : "border-input"}`}
                  >
                    <option value="">Select your Level</option>
                    <option>Level 100</option>
                    <option>Level 200</option>
                    <option>Level 300</option>
                    <option>Level 400</option>
                    <option>Postgraduate</option>
                  </select>
                  {errors.level && <p className="text-destructive text-xs mt-1 font-poppins">{errors.level}</p>}
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-primary-foreground font-poppins font-bold text-base py-3.5 rounded-full hover:brightness-110 transition-all active:scale-[0.98] min-h-[44px]"
            >
              Yes, I Am Attending ✓
            </button>
            <button onClick={handleClose} className="w-full text-center text-muted-foreground text-sm font-poppins mt-3 hover:text-foreground transition-colors">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendModal;

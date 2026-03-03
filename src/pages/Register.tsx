import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", studentId: "", email: "", level: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState({ type: "", msg: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    setBanner({ type: "", msg: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Please enter your name";
    if (!form.studentId.trim()) errs.studentId = "Please enter your Student ID";
    else if (!/^\d{8}$/.test(form.studentId)) errs.studentId = "Student ID must be 8 numbers";
    if (!form.email.trim()) errs.email = "Please enter your email";
    else if (!form.email.includes("@")) errs.email = "Please enter a valid email";
    if (!form.level) errs.level = "Please select your level";
    if (!form.password) errs.password = "Please enter a password";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = register({ name: form.name, email: form.email, studentId: form.studentId, level: form.level, password: form.password });
    if (result.success) {
      setBanner({ type: "success", msg: "Account created! Signing you in..." });
      setTimeout(() => navigate("/"), 1500);
    } else {
      setBanner({ type: "error", msg: result.error || "Registration failed" });
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground min-h-[44px] ${errors[field] ? "border-destructive" : "border-input"}`;

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800')" }} />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
        <div className="relative z-10 text-center px-10">
          <Logo size={64} />
          <p className="font-poppins font-light text-primary-foreground/70 text-lg mt-8 italic">Stay connected. Show up. Be COMPSSA.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="max-w-md w-full">
          <div className="lg:hidden flex justify-center mb-8"><Logo size={48} /></div>
          <h1 className="font-poppins font-extrabold text-3xl text-foreground mb-2">Join COMPSSA Event Pulse 🎓</h1>
          <p className="font-poppins text-muted-foreground mb-8">Create your free account in seconds</p>
          {banner.msg && (
            <div className={`font-poppins text-sm px-4 py-3 rounded-xl mb-6 ${banner.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-600" : "bg-destructive/10 border border-destructive/30 text-destructive"}`}>
              {banner.msg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Kwame Mensah" className={inputClass("name")} />
              {errors.name && <p className="text-destructive text-xs mt-1 font-poppins">{errors.name}</p>}
            </div>
            <div>
              <input value={form.studentId} onChange={(e) => update("studentId", e.target.value)} placeholder="e.g. 10987654" className={inputClass("studentId")} />
              <p className="font-poppins text-xs text-muted-foreground mt-1">Your 8-digit student number</p>
              {errors.studentId && <p className="text-destructive text-xs mt-1 font-poppins">{errors.studentId}</p>}
            </div>
            <div>
              <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="e.g. kwame@email.com" className={inputClass("email")} />
              {errors.email && <p className="text-destructive text-xs mt-1 font-poppins">{errors.email}</p>}
            </div>
            <div>
              <select value={form.level} onChange={(e) => update("level", e.target.value)} className={inputClass("level")}>
                <option value="">Select your Level</option>
                <option>Level 100</option>
                <option>Level 200</option>
                <option>Level 300</option>
                <option>Level 400</option>
                <option>Postgraduate</option>
              </select>
              {errors.level && <p className="text-destructive text-xs mt-1 font-poppins">{errors.level}</p>}
            </div>
            <div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Password" className={`${inputClass("password")} pr-16`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 font-poppins text-xs text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              <p className="font-poppins text-xs text-muted-foreground mt-1">At least 8 characters</p>
              {errors.password && <p className="text-destructive text-xs mt-1 font-poppins">{errors.password}</p>}
            </div>
            <div>
              <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="Repeat your password" className={inputClass("confirmPassword")} />
              {errors.confirmPassword && <p className="text-destructive text-xs mt-1 font-poppins">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground font-poppins font-bold text-base py-3.5 rounded-full hover:brightness-110 transition-all active:scale-[0.98] min-h-[44px]">
              Create My Account
            </button>
          </form>
          <p className="font-poppins text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

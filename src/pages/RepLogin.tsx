import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const RepLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [banner, setBanner] = useState("");
  const { repLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "Please enter your rep email";
    if (!password) errs.password = "Please enter your password";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = repLogin(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setBanner(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800')" }} />
        <div className="absolute inset-0 bg-[rgba(232,130,12,0.45)]" />
        <div className="relative z-10 text-center px-10">
          <Logo size={64} />
          <p className="font-poppins font-bold text-primary-foreground text-xl mt-8">Representative Access</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="max-w-md w-full">
          <div className="lg:hidden flex justify-center mb-8"><Logo size={48} /></div>
          <h1 className="font-poppins font-extrabold text-3xl text-foreground mb-2">Rep Access 🔐</h1>
          <p className="font-poppins font-semibold text-primary mb-8">COMPSSA representatives only</p>
          {banner && <div className="bg-destructive/10 border border-destructive/30 text-destructive font-poppins text-sm px-4 py-3 rounded-xl mb-6">{banner}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); setBanner(""); }}
                placeholder="Rep Email"
                className={`w-full px-4 py-3.5 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground min-h-[44px] ${errors.email ? "border-destructive" : "border-input"}`}
              />
              {errors.email && <p className="text-destructive text-xs mt-1 font-poppins">{errors.email}</p>}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); setBanner(""); }}
                  placeholder="Password"
                  className={`w-full px-4 py-3.5 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground pr-16 min-h-[44px] ${errors.password ? "border-destructive" : "border-input"}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 font-poppins text-xs text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1 font-poppins">{errors.password}</p>}
            </div>
            <button type="submit" className="w-full bg-secondary text-secondary-foreground font-poppins font-bold text-base py-3.5 rounded-full hover:bg-secondary/90 transition-all active:scale-[0.98] min-h-[44px]">
              Access Dashboard
            </button>
          </form>
          <p className="font-poppins text-xs text-muted-foreground text-center mt-6">
            Not the rep?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Back to Student Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RepLogin;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ emailOrId?: string; password?: string }>({});
  const [banner, setBanner] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!emailOrId.trim()) errs.emailOrId = "Please enter your email or Student ID";
    if (!password) errs.password = "Please enter your password";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = login(emailOrId, password);
    if (result.success) {
      navigate("/");
    } else {
      setBanner(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left photo */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800')" }} />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
        <div className="relative z-10 text-center px-10">
          <Logo size={64} />
          <p className="font-poppins font-light text-primary-foreground/70 text-lg mt-8 italic">Stay connected. Show up. Be COMPSSA.</p>
        </div>
      </div>
      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="max-w-md w-full">
          <div className="lg:hidden flex justify-center mb-8"><Logo size={48} /></div>
          <h1 className="font-poppins font-extrabold text-3xl text-foreground mb-2">Welcome Back 👋</h1>
          <p className="font-poppins text-muted-foreground mb-8">Sign in with your email or Student ID</p>
          {banner && <div className="bg-primary/10 border border-primary/30 text-primary font-poppins text-sm px-4 py-3 rounded-xl mb-6">{banner}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                value={emailOrId}
                onChange={(e) => { setEmailOrId(e.target.value); setErrors((p) => ({ ...p, emailOrId: undefined })); setBanner(""); }}
                placeholder="Email or Student ID"
                className={`w-full px-4 py-3.5 rounded-xl border font-poppins text-sm bg-background text-foreground placeholder:text-muted-foreground min-h-[44px] ${errors.emailOrId ? "border-destructive" : "border-input"}`}
              />
              <p className="font-poppins text-xs text-muted-foreground mt-1">e.g. kwame@email.com or 10987654</p>
              {errors.emailOrId && <p className="text-destructive text-xs mt-1 font-poppins">{errors.emailOrId}</p>}
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
            <div className="text-right">
              <a href="#" className="font-poppins text-sm text-primary font-semibold hover:underline">Forgot your password?</a>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground font-poppins font-bold text-base py-3.5 rounded-full hover:brightness-110 transition-all active:scale-[0.98] min-h-[44px]">
              Sign In
            </button>
          </form>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="font-poppins text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <p className="font-poppins text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create Account →</Link>
          </p>
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="font-poppins text-xs text-muted-foreground">
              Are you the COMPSSA Rep?{" "}
              <Link to="/rep-login" className="text-primary font-semibold hover:underline">Rep Login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

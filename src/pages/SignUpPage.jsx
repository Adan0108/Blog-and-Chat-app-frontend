import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Book, Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() !== true) return;
    const ok = await signup(formData);
    if (ok) navigate("/login");                          // <-- redirect after signup
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[oklch(88%_0.04_70)] text-[oklch(28%_0.04_70)]">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl 
             bg-[oklch(80%_0.05_65)] 
             group-hover:bg-[oklch(76%_0.05_65)] 
             flex items-center justify-center 
             transition-colors"
              >
                <Book className="size-6 text-[oklch(50%_0.12_55)] stroke-[1.75]" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center
                  pointer-events-none z-10
                  text-[oklch(35%_0.06_60)]/60">
                  <User className="size-5 !text-[oklch(35%_0.06_60)]/70 [stroke:oklch(35%_0.06_60)]"  />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Quang Anh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center
                  pointer-events-none z-10
                  text-[oklch(35%_0.06_60)]/60">
                  <Mail className="size-5 !text-[oklch(35%_0.06_60)]/70 [stroke:oklch(35%_0.06_60)]" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                {/* LEFT ICON (Lock) */}
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center
               pointer-events-none z-20
               text-[oklch(35%_0.06_60)]/60"
                >
                  <Lock className="size-5 !text-[oklch(35%_0.06_60)]/70 [stroke:oklch(35%_0.06_60)]" />
                </div>

                {/* INPUT */}
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                {/* RIGHT EYE BUTTON */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 !text-[oklch(35%_0.06_60)]/70 [stroke:oklch(35%_0.06_60)]" />
                  ) : (
                    <Eye className="size-5 !text-[oklch(35%_0.06_60)]/70 [stroke:oklch(35%_0.06_60)]" />
                  )}
                </button>
              </div>

            </div>

            <button type="submit" className="btn w-full 
             bg-[oklch(64%_0.08_65)] hover:bg-[oklch(58%_0.08_65)] 
             border-[oklch(64%_0.08_65)] hover:border-[oklch(58%_0.08_65)] 
             text-white" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, new people and share your moment"
      />
    </div>
  );
};
export default SignUpPage;
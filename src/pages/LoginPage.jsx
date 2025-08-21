import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[oklch(88%_0.04_70)] text-[oklch(28%_0.04_70)]">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl 
                bg-[oklch(80%_0.05_65)] 
                group-hover:bg-[oklch(76%_0.05_65)] 
                flex items-center justify-center 
                transition-colors"
              >
                <MessageSquare className="size-6 text-[oklch(50%_0.12_55)] stroke-[1.75]" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-[oklch(35%_0.06_60)]/60">
                  <Mail className="size-5 !text-[oklch(35%_0.06_60)]/70 [stroke:oklch(35%_0.06_60)]" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
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
                {/* Left icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20 text-[oklch(35%_0.06_60)]/60">
                  <Lock className="size-5 !text-[oklch(35%_0.06_60)]/70 [stroke:oklch(35%_0.06_60)]" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                {/* Right eye toggle */}
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

            <button
              type="submit"
              className="btn w-full 
                bg-[oklch(64%_0.08_65)] hover:bg-[oklch(58%_0.08_65)] 
                border-[oklch(64%_0.08_65)] hover:border-[oklch(58%_0.08_65)] 
                text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};
export default LoginPage;

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { saveTokens, loadTokens, clearTokens } from "../lib/authTokens";
import { setAuthInvalidHandler } from "../lib/axios";

export const useAuthStore = create((set) => {
  // Register a single global handler to react to refresh failure
  setAuthInvalidHandler(() => {
    clearTokens();
    set({ authUser: null });
  });

  return {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async () => {
      try {
        // If tokens exist, request interceptor will attach headers.
        const res = await axiosInstance.get("/auth/check", {
          validateStatus: (s) => (s >= 200 && s < 300) || s === 401,
        });

        // If 401 occurs here, the response interceptor tries /auth/refresh automatically.
        // If refresh also fails, onAuthInvalidHandler already nulled authUser & cleared tokens.
        if (res.status === 200) {
          set({ authUser: res.data }); // { authenticated, userId, email, username }
        } else {
          set({ authUser: null });
        }
      } catch (err) {
        console.log("Error in checkAuth", err);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async (data) => {
      set({ isSigningUp: true });
      try {
        await axiosInstance.post("/auth/signup", data);
        toast.success("Account created successfully");
        return true;
      } catch (error) {
        toast.error(error?.response?.data?.message || "Sign up failed");
        return false;
      } finally {
        set({ isSigningUp: false });
      }
    },

    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        // Expecting { userId, email, tokens: { accessToken, refreshToken } }
        const { userId, email, tokens } = res.data || {};
        if (!tokens?.accessToken || !tokens?.refreshToken) {
          toast.error("Login response missing tokens");
          return false;
        }

        // store tokens so headers attach on subsequent calls (including /auth/check)
        saveTokens({ userId, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });

        // Set minimal user for immediate UI (optional: follow-up /auth/check for username)
        set({ authUser: { userId, email } });

        toast.success("Login Successfully");
        return true;
      } catch (error) {
        toast.error(error?.response?.data?.message || "Login failed");
        return false;
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async () => {
      try {
        const t = loadTokens();
        // Authorization will be attached by the request interceptor if still present
        await axiosInstance.post("/auth/logout", null, {
          headers: t?.userId != null ? { "x-client-id": t.userId } : {},
        });
      } catch (error) {
        // Even if server errors, clear client state
        console.log("Logout error", error?.response?.data || error);
      } finally {
        clearTokens();
        set({ authUser: null });
        toast.success("Logout Successfully");
      }
    },
  };
});

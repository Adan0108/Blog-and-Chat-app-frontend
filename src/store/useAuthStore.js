// useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", {
        // treat 401 as a valid outcome for this specific call
        validateStatus: (s) => (s >= 200 && s < 300) || s === 401,
      });
      set({ authUser: res.status === 200 ? res.data : null });
    } catch (error) {
      console.log("Error in checkAuth", error);
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
}));

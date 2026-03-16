import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRazorpay } from "react-razorpay";

export interface ThemeConfig {
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
  fonts: { heading: string; body: string };
  borderRadius: string;
  heroStyle: "split" | "centered" | "minimal" | "creative";
  experienceStyle: "timeline" | "cards" | "minimal";
  educationStyle: "timeline" | "cards" | "minimal";
  projectsStyle: "grid" | "cards" | "list" | "masonry";
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  previewImage: string | null;
  config: ThemeConfig;
  isPremium: boolean;
  price: number | null;
}

// Fetch all themes - themes don't change often, cache longer
const THEME_STALE_TIME = 1000 * 60 * 10; // 10 minutes
const THEME_CACHE_TIME = 1000 * 60 * 30; // 30 minutes

// Fetch all themes
export function useThemes() {
  return useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await api.get<{ data: Theme[] }>("/themes");
      return res.data;
    },
    staleTime: THEME_STALE_TIME,
    gcTime: THEME_CACHE_TIME,
  });
}

// Apply a free theme
export function useApplyTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (themeId: string) => {
      const res = await api.post<{ data: any }>("/themes", { themeId }, true); // requires auth
      return res.data;
    },
    onSuccess: () => {
      // Invalidate both myProfile (dashboard) and all public profile queries
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Purchase a premium theme
export function useBuyPremiumTheme() {
  const { Razorpay } = useRazorpay();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (themeId: string) => {
      // 1. Create order on backend
      const { data: orderData } = await api.post<{ data: any }>("/payments/create-order", { themeId }, true);

      return new Promise((resolve, reject) => {
        // 2. Initialize Razorpay Checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Dashpage Themes",
          description: "Premium Theme Purchase",
          order_id: orderData.orderId,
          handler: async (response: any) => {
            try {
              // 3. Verify payment on backend
              const verifyPayload = {
                themeId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              await api.post("/payments/verify", verifyPayload, true);
              resolve(true);
            } catch (err) {
              reject(err);
            }
          },
          prefill: {
            name: "Dashpage User", // Optionally fill from profile
            email: "",
            contact: "",
          },
          theme: {
            color: "#0f172a",
          },
        };

        const rzp = new Razorpay(options);
        
        rzp.on("payment.failed", function (response: any) {
          reject(new Error(response.error.description));
        });

        rzp.open();
      });
    },
    onSuccess: () => {
      // Invalidate both myProfile (dashboard) and all public profile queries
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

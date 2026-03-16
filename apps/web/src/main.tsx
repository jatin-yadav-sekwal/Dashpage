import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

// Optimized QueryClient for better performance and caching
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes - won't refetch within this time
            staleTime: 1000 * 60 * 5,
            // Keep unused data in cache for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Don't refetch on window focus for better UX
            refetchOnWindowFocus: false,
            // Retry failed requests only once
            retry: 1,
            // Don't refetch on mount if data exists in cache
            refetchOnMount: false,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
                <Toaster richColors position="top-right" />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);

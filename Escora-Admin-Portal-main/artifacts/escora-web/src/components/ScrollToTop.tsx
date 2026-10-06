import { useEffect } from "react";
import { useLocation } from "wouter";
import { useLenis } from "lenis/react";

// Disable browser automatic scroll restoration on the client as early as possible
if (typeof window !== "undefined" && typeof window.history !== "undefined") {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

export default function ScrollToTop() {
  const [location] = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure manual scroll restoration is active
    if (typeof window.history !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Instantly scroll to the top without visible animation
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Safeguard against browser layout passes re-applying scroll on initial reload
    const rafId = requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [location, lenis]);

  return null;
}


import { useState, useEffect } from "react";

/**
 * Hook to detect the user's prefers-reduced-motion preference.
 * Returns { prefersReducedMotion: boolean }
 * Listens for changes and triggers re-render when the preference changes.
 */
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern API: addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    // Legacy API fallback: addListener (older Safari)
    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return { prefersReducedMotion };
}

export default useReducedMotion;

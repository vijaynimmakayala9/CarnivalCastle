import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll Window
    window.scrollTo(0, 0);

    // Scroll any container that scrolls
    const containers = document.querySelectorAll("*");
    containers.forEach((el) => {
      const style = window.getComputedStyle(el);

      const isScrollable =
        style.overflow === "auto" ||
        style.overflow === "scroll" ||
        style.overflowY === "auto" ||
        style.overflowY === "scroll";

      if (isScrollable) {
        el.scrollTop = 0;
      }
    });
  }, [pathname]);

  return null;
}

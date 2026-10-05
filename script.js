(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  let lastY = window.scrollY;

  const onScroll = () => {
    if (!header) return;
    const y = window.scrollY;
    const menuOpen = nav && nav.classList.contains("is-open");
    header.classList.toggle("is-scrolled", y > 24);

    const delta = y - lastY;
    if (Math.abs(delta) < 8) return;

    if (y < 48 || menuOpen || delta < 0) {
      header.classList.remove("is-hidden");
    } else {
      header.classList.add("is-hidden");
    }
    lastY = y;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  const reveals = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-work-src]").forEach((media) => {
    const frame = media.closest(".work-frame");
    if (!frame) return;
    const show = () => {
      media.classList.add("is-loaded");
      frame.classList.add("has-media");
    };
    media.addEventListener("error", () => {
      media.classList.remove("is-loaded");
      frame.classList.remove("has-media");
    });
    if (media.tagName === "IMG") {
      media.addEventListener("load", show);
      if (media.complete && media.naturalWidth > 0) show();
    } else if (media.tagName === "VIDEO") {
      media.addEventListener("loadeddata", show);
    }
  });

  // Soft parallax on hero orbs
  const orbs = document.querySelectorAll(".hero-orb");
  if (orbs.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        orbs.forEach((orb, i) => {
          const factor = i === 0 ? 1 : -0.7;
          orb.style.translate = `${x * factor}px ${y * factor}px`;
        });
      },
      { passive: true }
    );
  }
})();

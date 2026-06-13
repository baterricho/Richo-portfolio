const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const backToTop = document.querySelector(".back-to-top");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");

const closeNavigation = () => {
  navMenu.classList.remove("open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("nav-open");
};

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("nav-open", isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.13 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const updatePageState = () => {
  const scrollPosition = window.scrollY;
  header.classList.toggle("scrolled", scrollPosition > 20);
  backToTop.classList.toggle("visible", scrollPosition > 600);

  const currentSection = sections
    .filter((section) => scrollPosition >= section.offsetTop - 180)
    .at(-1);

  navLinks.forEach((link) => {
    const isCurrent = currentSection
      ? link.getAttribute("href") === `#${currentSection.id}`
      : link.getAttribute("href") === "#home";
    link.classList.toggle("active", isCurrent);
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

window.addEventListener("scroll", updatePageState, { passive: true });
window.addEventListener("load", updatePageState);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const message = data.get("message").trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(
    `Hello Richo,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`
  );

  formStatus.textContent = "Opening your email application...";
  window.location.href = `mailto:baterzalricho56@gmail.com?subject=${subject}&body=${body}`;

  window.setTimeout(() => {
    formStatus.textContent = "Your message is ready to send in your email application.";
  }, 800);
});

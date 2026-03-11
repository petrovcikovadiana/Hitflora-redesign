const header = document.getElementById("siteHeader");
const revealElements = document.querySelectorAll(".reveal");

function handleHeaderScroll() {
  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

handleHeaderScroll();
window.addEventListener("scroll", handleHeaderScroll);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  },
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;
  observer.observe(element);
});

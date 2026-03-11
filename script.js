const revealElements = document.querySelectorAll(".reveal");
const heroVisual = document.getElementById("heroVisual");
const parallaxCards = document.querySelectorAll(".parallax-card");

function handleHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll);

setTimeout(() => {
  handleHeaderScroll();
}, 100);

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
  element.style.transitionDelay = `${Math.min(index * 40, 280)}ms`;
  observer.observe(element);
});

if (
  heroVisual &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches
) {
  heroVisual.addEventListener("mousemove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2;
    const rotateY = ((x - centerX) / centerX) * 2;

    heroVisual.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    parallaxCards.forEach((card) => {
      const speed = Number(card.dataset.speed || 10);
      const moveX = ((x - centerX) / centerX) * speed;
      const moveY = ((y - centerY) / centerY) * speed;

      card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  heroVisual.addEventListener("mouseleave", () => {
    heroVisual.style.transform = "rotateX(0deg) rotateY(0deg)";

    parallaxCards.forEach((card) => {
      card.style.transform = "translate(0px, 0px)";
    });
  });
}

//opening hours
let openingHoursCache = null;

function formatTime(time) {
  if (!time || typeof time !== "string") return "";
  return time.slice(0, 5).replace(/^0/, "");
}

async function fetchOpeningHoursData() {
  const tenantId = "5f62d984506f2792";
  const response = await fetch(
    `https://eclipse.cloudylake.io/api/v1/tenants/${tenantId}/configs/key/openingHours`,
  );
  console.log("script.js loaded");
  if (!response.ok) {
    throw new Error(
      `Opening hours se nepodařilo načíst. HTTP ${response.status}`,
    );
  }

  const data = await response.json();
  const openingHoursConfig = data?.data?.config?.config_value;

  if (!openingHoursConfig) {
    throw new Error("Chybí config_value pro openingHours.");
  }

  const mondayHours = {
    day: "Po",
    open: formatTime(openingHoursConfig.day_mon?.open),
    close: formatTime(openingHoursConfig.day_mon?.close),
    isOpen: openingHoursConfig.day_mon?.isOpen ?? true,
  };

  const tuesdayHours = {
    day: "Út",
    open: formatTime(openingHoursConfig.day_tue?.open),
    close: formatTime(openingHoursConfig.day_tue?.close),
    isOpen: openingHoursConfig.day_tue?.isOpen ?? true,
  };

  const wednesdayHours = {
    day: "St",
    open: formatTime(openingHoursConfig.day_wed?.open),
    close: formatTime(openingHoursConfig.day_wed?.close),
    isOpen: openingHoursConfig.day_wed?.isOpen ?? true,
  };

  const thursdayHours = {
    day: "Čt",
    open: formatTime(openingHoursConfig.day_thu?.open),
    close: formatTime(openingHoursConfig.day_thu?.close),
    isOpen: openingHoursConfig.day_thu?.isOpen ?? true,
  };

  const fridayHours = {
    day: "Pá",
    open: formatTime(openingHoursConfig.day_fri?.open),
    close: formatTime(openingHoursConfig.day_fri?.close),
    isOpen: openingHoursConfig.day_fri?.isOpen ?? true,
  };

  const saturdayHours = {
    day: "Sobota",
    open: formatTime(openingHoursConfig.day_sat?.open),
    close: formatTime(openingHoursConfig.day_sat?.close),
    isOpen: openingHoursConfig.day_sat?.isOpen ?? true,
  };

  const sundayHours = {
    day: "Neděle",
    open: formatTime(openingHoursConfig.day_sun?.open),
    close: formatTime(openingHoursConfig.day_sun?.close),
    isOpen: openingHoursConfig.day_sun?.isOpen ?? true,
  };

  const isWeekdaysSame =
    mondayHours.open === tuesdayHours.open &&
    mondayHours.close === tuesdayHours.close &&
    mondayHours.open === wednesdayHours.open &&
    mondayHours.close === wednesdayHours.close &&
    mondayHours.open === thursdayHours.open &&
    mondayHours.close === thursdayHours.close &&
    mondayHours.open === fridayHours.open &&
    mondayHours.close === fridayHours.close &&
    mondayHours.isOpen === tuesdayHours.isOpen &&
    mondayHours.isOpen === wednesdayHours.isOpen &&
    mondayHours.isOpen === thursdayHours.isOpen &&
    mondayHours.isOpen === fridayHours.isOpen;

  const fullHours = [];

  if (isWeekdaysSame) {
    fullHours.push({
      day: "Po – Pá",
      open: mondayHours.open,
      close: mondayHours.close,
      isOpen: mondayHours.isOpen,
    });
  } else {
    fullHours.push(
      mondayHours,
      tuesdayHours,
      wednesdayHours,
      thursdayHours,
      fridayHours,
    );
  }

  fullHours.push(saturdayHours, sundayHours);

  return fullHours;
}

function renderHours(containerId, hoursArray) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = hoursArray
    .map(
      (entry) => `
        <div class="hours-row">
          <div class="hours-day-wrap">
            <span class="hours-dot ${entry.isOpen ? "is-open" : "is-closed"}"></span>
            <span>${entry.day}</span>
          </div>
          <span>${entry.isOpen ? `${entry.open} – ${entry.close}` : "Zavřeno"}</span>
        </div>
      `,
    )
    .join("");
}

function renderHeroHours(hoursArray) {
  const heroHours = hoursArray.filter(
    (entry) =>
      entry.day === "Po – Pá" ||
      entry.day === "Sobota" ||
      entry.day === "Neděle",
  );

  renderHours("hero-opening-hours-list", heroHours);
}

function renderContactHours(hoursArray) {
  renderHours("opening-hours-list", hoursArray);
}

function renderAllOpeningHours() {
  if (!openingHoursCache) return;
  renderHeroHours(openingHoursCache);
  renderContactHours(openingHoursCache);
}

document.addEventListener("contactBannerLoaded", () => {
  renderAllOpeningHours();
});

async function initOpeningHours() {
  try {
    openingHoursCache = await fetchOpeningHoursData();
    renderAllOpeningHours();
  } catch (error) {
    console.error("Chyba při načítání otevírací doby:", error);

    renderHours("hero-opening-hours-list", [
      { day: "Otvírací doba", open: "", close: "", isOpen: false },
    ]);

    renderHours("opening-hours-list", [
      { day: "Otvírací doba", open: "", close: "", isOpen: false },
    ]);
  }
}

initOpeningHours();

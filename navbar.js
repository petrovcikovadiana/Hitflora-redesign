async function loadNavbar(currentPage, theme = "default") {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  try {
    const response = await fetch("./components/navbar.html");
    const html = await response.text();
    placeholder.innerHTML = html;

    const activeLink = placeholder.querySelector(
      `[data-page="${currentPage}"]`,
    );
    if (activeLink) {
      activeLink.classList.add("is-active");
    }

    const header = document.getElementById("siteHeader");
    if (!header) return;

    if (theme && theme !== "default") {
      header.classList.add(`theme-${theme}`);
    }

    function handleHeaderScroll() {
      if (window.scrollY > 20) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    handleHeaderScroll();
    window.addEventListener("scroll", handleHeaderScroll);

    initNavbarMenu();
  } catch (error) {
    console.error("Chyba při načítání navbaru:", error);
  }
}
function initNavbarMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const siteHeader = document.getElementById("siteHeader");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !siteHeader || !mainNav) {
    console.log("Hamburger menu prvky nebyly nalezeny");
    return;
  }

  let scrollY = 0;

  function lockBodyScroll() {
    scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockBodyScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteHeader.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      unlockBodyScroll();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      siteHeader.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      unlockBodyScroll();
    }
  });
}

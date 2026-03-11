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
    console.log("currentPage:", currentPage);
    console.log("activeLink:", activeLink);

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
  } catch (error) {
    console.error("Chyba při načítání navbaru:", error);
  }
}

window.loadNavbar = loadNavbar;

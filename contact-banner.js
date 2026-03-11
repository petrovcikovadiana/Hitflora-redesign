async function loadContactBanner() {
  const placeholder = document.getElementById("contact-banner-placeholder");
  if (!placeholder) return;
  console.log("contactBannerLoaded fired");
  try {
    const response = await fetch("./components/contact-banner.html");

    if (!response.ok) {
      throw new Error(
        `Contact banner se nepodařilo načíst. HTTP ${response.status}`,
      );
    }

    const html = await response.text();
    placeholder.innerHTML = html;

    document.dispatchEvent(new CustomEvent("contactBannerLoaded"));
  } catch (error) {
    console.error("Chyba při načítání kontaktního banneru:", error);
  }
}

window.loadContactBanner = loadContactBanner;

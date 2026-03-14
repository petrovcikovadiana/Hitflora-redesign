// Function to get a cookie by name
const getCookie = (name) => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  return parts.length < 2 ? undefined : parts.pop().split(";").shift();
};

// Function to set a cookie
const setCookie = function (name, value, expiryDays, path = "/") {
  const exdate = new Date();
  exdate.setHours(
    exdate.getHours() +
      (typeof expiryDays !== "number" ? 365 : expiryDays) * 24,
  );
  document.cookie =
    name + "=" + value + ";expires=" + exdate.toUTCString() + ";path=" + path;
};

document.addEventListener("DOMContentLoaded", () => {
  const $cookiesBanner = document.querySelector(".cookies-eu-banner");
  const $editSection = document.querySelector(".cookies-eu-edit");
  const $acceptButton = document.querySelector(".cookies-eu-banner .accept");
  const $declineButton = document.querySelector(".cookies-eu-banner .decline");
  const $editButton = document.querySelector(".cookies-eu-banner .edit");
  console.log($editButton);
  const $editLink = document.querySelector(".edit-cookies");
  const $saveButton = document.querySelector(".cookies-eu-edit .save");
  const $editAcceptButton = document.querySelector(".cookies-eu-edit .accept");
  const $editDeclineButton = document.querySelector(
    ".cookies-eu-edit .decline",
  );

  const technicalCookiesCheckbox = document.getElementById("technical-cookies");
  const analyticalCookiesCheckbox =
    document.getElementById("analytical-cookies");
  const marketingCookiesCheckbox = document.getElementById("marketing-cookies");
  const cookieName = "cookiesBanner";
  const hasCookie = getCookie(cookieName);

  const loadCookiesSettings = () => {
    technicalCookiesCheckbox.checked = true;
    analyticalCookiesCheckbox.checked =
      getCookie("analyticalCookies") === "true";
    marketingCookiesCheckbox.checked = getCookie("marketingCookies") === "true";
  };

  if (!hasCookie) {
    $cookiesBanner.classList.remove("hidden");
  }

  $acceptButton.addEventListener("click", () => {
    setCookie("technicalCookies", "true", 365);
    setCookie("analyticalCookies", "true", 365);
    setCookie("marketingCookies", "true", 365);
    setCookie(cookieName, "true", 365);
    $cookiesBanner.classList.add("hidden");
  });

  $declineButton.addEventListener("click", () => {
    setCookie("technicalCookies", "true", 365);
    setCookie("analyticalCookies", "false", 365);
    setCookie("marketingCookies", "false", 365);
    setCookie(cookieName, "false", 365);
    $cookiesBanner.classList.add("hidden");
  });

  $editLink.addEventListener("click", (e) => {
    e.preventDefault();
    $cookiesBanner.classList.add("hidden");
    $editSection.classList.remove("hidden");
    loadCookiesSettings();
  });

  $editButton.addEventListener("click", () => {
    $cookiesBanner.classList.add("hidden");
    $editSection.classList.remove("hidden");
    loadCookiesSettings();
  });

  $editAcceptButton.addEventListener("click", () => {
    setCookie("technicalCookies", "true", 365);
    setCookie("analyticalCookies", "true", 365);
    setCookie("marketingCookies", "true", 365);
    setCookie(cookieName, "true", 365);
    $editSection.classList.add("hidden");
  });

  $editDeclineButton.addEventListener("click", () => {
    setCookie("technicalCookies", "true", 365);
    setCookie("analyticalCookies", "false", 365);
    setCookie("marketingCookies", "false", 365);
    setCookie(cookieName, "false", 365);
    $editSection.classList.add("hidden");
  });

  $saveButton.addEventListener("click", () => {
    const analyticalCookies = analyticalCookiesCheckbox.checked;
    const marketingCookies = marketingCookiesCheckbox.checked;

    setCookie("technicalCookies", "true", 365);
    setCookie("analyticalCookies", analyticalCookies ? "true" : "false", 365);
    setCookie("marketingCookies", marketingCookies ? "true" : "false", 365);
    setCookie(cookieName, "true", 365);

    $editSection.classList.add("hidden");
  });
});

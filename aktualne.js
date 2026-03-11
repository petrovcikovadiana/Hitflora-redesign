const newsStatus = document.getElementById("newsStatus");
const newsListInner = document.getElementById("newsListInner");
const pagination = document.getElementById("pagination");

const tenantId = "5f62d984506f2792";
const postsPerPage = 5;

let posts = [];
let currentPage = 1;

function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value) {
  if (typeof value !== "string") return "";

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getImageUrl(post) {
  if (!post?.imageName) {
    return "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80";
  }

  return `https://eclipse.cloudylake.io/img/posts/${post.imageName}`;
}

function renderPosts() {
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  if (!currentPosts.length) {
    newsListInner.innerHTML = "";
    newsStatus.textContent = "Momentálně tu nejsou žádné příspěvky.";
    newsStatus.classList.remove("is-hidden");
    return;
  }

  newsStatus.classList.add("is-hidden");

  newsListInner.innerHTML = currentPosts
    .map((post) => {
      const imageUrl = getImageUrl(post);
      const title = escapeHtml(post.title || "");
      const description = escapeHtml(post.description || "");
      const date = post.date ? formatDate(post.date) : "";

      return `
        <article class="news-item">
          <div class="news-item-image">
            <img
              src="${imageUrl}"
              alt="${title}"
              loading="lazy"
            />
          </div>

          <div class="news-item-content">
            <div class="news-meta">
              <div class="news-date">${date}</div>
              <div class="news-kicker">Hitflora</div>
            </div>
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function createPaginationButton(
  label,
  page,
  isActive = false,
  isDisabled = false,
) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pagination-button";

  if (isActive) {
    button.classList.add("is-active");
  }

  button.textContent = label;
  button.disabled = isDisabled;

  button.addEventListener("click", () => {
    if (
      page === currentPage ||
      page < 1 ||
      page > Math.ceil(posts.length / postsPerPage)
    ) {
      return;
    }

    currentPage = page;
    renderPosts();
    renderPagination();

    const section = document.getElementById("newsList");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  return button;
}

function renderPagination() {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  pagination.appendChild(
    createPaginationButton("←", currentPage - 1, false, currentPage === 1),
  );

  for (let page = 1; page <= totalPages; page += 1) {
    pagination.appendChild(
      createPaginationButton(String(page), page, page === currentPage, false),
    );
  }

  pagination.appendChild(
    createPaginationButton(
      "→",
      currentPage + 1,
      false,
      currentPage === totalPages,
    ),
  );
}

async function fetchPosts() {
  try {
    newsStatus.textContent = "Načítám příspěvky…";
    newsStatus.classList.remove("is-hidden", "is-error");

    const response = await fetch(
      `https://eclipse.cloudylake.io/api/v1/tenants/${tenantId}/posts?sort=date&order=desc`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    posts = data?.data?.posts || [];

    renderPosts();
    renderPagination();
  } catch (error) {
    console.error("Error fetching posts:", error);
    newsListInner.innerHTML = "";
    pagination.innerHTML = "";
    newsStatus.textContent = "Nepodařilo se načíst příspěvky.";
    newsStatus.classList.add("is-error");
  }
}

fetchPosts();

//animation
const newsHeroVisual = document.querySelector(".news-hero-visual");
const heroNewsCard = document.querySelector(".hero-news-card");

if (
  newsHeroVisual &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches
) {
  newsHeroVisual.addEventListener("mousemove", (event) => {
    const rect = newsHeroVisual.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -1.5;
    const rotateY = ((x - centerX) / centerX) * 1.5;

    newsHeroVisual.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    if (heroNewsCard) {
      const moveX = ((x - centerX) / centerX) * 8;
      const moveY = ((y - centerY) / centerY) * 8;
      heroNewsCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });

  newsHeroVisual.addEventListener("mouseleave", () => {
    newsHeroVisual.style.transform = "rotateX(0deg) rotateY(0deg)";

    if (heroNewsCard) {
      heroNewsCard.style.transform = "translate(0px, 0px)";
    }
  });
}

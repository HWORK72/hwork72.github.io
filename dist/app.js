import {
    AVATAR_IMAGE_URL,
    CLIENT_REVIEWS,
    CORE_LANGUAGES,
    FLAGSHIP_PROJECTS,
    SECONDARY_REPOS,
    SOCIAL_CONTACTS,
    TECH_STACK_TAGS
} from "./data.js";

function normalizeVimeoEmbedUrl(rawUrl) {
    if (!rawUrl) {
        return "";
    }
    let videoId = "";
    let hashParam = "";

    const playerMatch = rawUrl.match(/player\.vimeo\.com\/video\/(\d+)/);
    const standardMatch = rawUrl.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
    const hashQueryMatch = rawUrl.match(/[?&]h=([a-zA-Z0-9]+)/);

    if (playerMatch && playerMatch[1]) {
        videoId = playerMatch[1];
    } else if (standardMatch && standardMatch[1]) {
        videoId = standardMatch[1];
        if (standardMatch[2]) {
            hashParam = standardMatch[2];
        }
    }

    if (hashQueryMatch && hashQueryMatch[1]) {
        hashParam = hashQueryMatch[1];
    }

    if (!videoId) {
        return rawUrl;
    }

    const params = [];
    if (hashParam) {
        params.push(`h=${hashParam}`);
    }
    params.push("quality=1080p");
    params.push("autoplay=1");
    params.push("loop=1");
    params.push("muted=1");
    params.push("autopause=0");
    params.push("playsinline=1");
    params.push("title=0");
    params.push("byline=0");
    params.push("portrait=0");

    return `https://player.vimeo.com/video/${videoId}?${params.join("&")}`;
}

function calculateRatingSummary(reviews) {
    if (reviews.length === 0) {
        return { averageScore: "5.0", totalReviews: 0, fiveStarPercentage: 100 };
    }
    const totalScore = reviews.reduce((acc, item) => acc + item.rating, 0);
    const mean = totalScore / reviews.length;
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
    const percentage = Math.round((fiveStarCount / reviews.length) * 100);

    return {
        averageScore: mean.toFixed(1),
        totalReviews: reviews.length,
        fiveStarPercentage: percentage
    };
}

function showToast(message) {
    const toast = document.getElementById("copy-toast");
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.add("visible");
    window.setTimeout(() => {
        toast.classList.remove("visible");
    }, 2200);
}

function openImageModal(imageUrl, caption) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    if (!modal || !modalImg || !modalCaption) {
        return;
    }
    modalImg.src = imageUrl;
    modalCaption.textContent = caption;
    modal.classList.add("open");
}

function setupModalListeners() {
    const modal = document.getElementById("image-modal");
    const closeBtn = document.getElementById("modal-close");
    if (modal) {
        modal.addEventListener("click", (ev) => {
            if (ev.target === modal) {
                modal.classList.remove("open");
            }
        });
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("open");
        });
    }
}

function renderProfileSidebar() {
    const avatarImg = document.getElementById("profile-avatar-img");
    const langContainer = document.getElementById("core-languages-bar");
    const stackContainer = document.getElementById("tech-stack-bar");
    const socialContainer = document.getElementById("social-links-bar");

    if (avatarImg && AVATAR_IMAGE_URL) {
        avatarImg.src = AVATAR_IMAGE_URL;
    }

    if (langContainer) {
        langContainer.innerHTML = CORE_LANGUAGES.map(
            (lang) => `
            <span class="lang-pill">
                <span class="lang-dot" style="background-color: ${lang.color}"></span>
                ${lang.name}
            </span>
        `
        ).join("");
    }

    if (stackContainer) {
        stackContainer.innerHTML = TECH_STACK_TAGS.map(
            (tag) => `<span class="stack-tag">${tag}</span>`
        ).join("");
    }

    if (socialContainer) {
        socialContainer.innerHTML = SOCIAL_CONTACTS.map((contact) => {
            if (contact.copyValue && !contact.url) {
                return `
                    <button type="button" class="tg-contact-row" data-copy="${contact.copyValue}">
                        <span class="tg-contact-handle">${contact.handle}</span>
                        <span class="tg-contact-type">${contact.label}</span>
                    </button>
                `;
            }
            return `
                <a href="${contact.url}" target="_blank" rel="noopener noreferrer" class="tg-contact-row">
                    <span class="tg-contact-handle">${contact.handle}</span>
                    <span class="tg-contact-type">${contact.label}</span>
                </a>
            `;
        }).join("");

        const copyButtons = socialContainer.querySelectorAll("[data-copy]");
        copyButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const copyVal = btn.getAttribute("data-copy") || "";
                const handleEl = btn.querySelector(".tg-contact-handle");
                if (copyVal && navigator.clipboard) {
                    navigator.clipboard.writeText(copyVal).catch(() => {});
                    showToast(`Discord username copied: ${copyVal}`);
                    if (handleEl) {
                        const originalText = handleEl.textContent;
                        handleEl.textContent = "Copied!";
                        window.setTimeout(() => {
                            handleEl.textContent = originalText;
                        }, 1600);
                    }
                }
            });
        });
    }
}

function buildMediaMarkup(project) {
    if (project.mediaType === "video" && project.mediaUrl) {
        const hdVideoUrl = normalizeVimeoEmbedUrl(project.mediaUrl);
        return `
            <div class="media-frame video-wrapper">
                <iframe src="${hdVideoUrl}" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowfullscreen 
                        loading="eager"
                        title="${project.title}"></iframe>
            </div>
        `;
    }
    const imgSrc = project.mediaUrl || "assets/osint_preview.jpg";
    return `
        <div class="media-frame image-wrapper" data-full-img="${imgSrc}" data-caption="${project.title}">
            <img src="${imgSrc}" alt="${project.title}" loading="lazy" />
            <div class="zoom-badge">Click to Expand</div>
        </div>
    `;
}

function renderFlagshipProjects(projects) {
    const grid = document.getElementById("flagship-grid");
    if (!grid) {
        return;
    }

    grid.innerHTML = projects.map((proj) => {
        const badgesHtml = proj.languages.map(
            (l) => `
            <span class="proj-badge">
                <span class="lang-dot" style="background-color: ${l.color}"></span>
                ${l.name}
            </span>
        `
        ).join("");

        return `
            <article class="project-card">
                ${buildMediaMarkup(proj)}
                <div class="project-info">
                    <div class="project-top">
                        <h2 class="project-title">${proj.title}</h2>
                        <p class="project-desc">${proj.description}</p>
                    </div>
                    <div class="project-footer">
                        <div class="project-badges">${badgesHtml}</div>
                        <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="neutral-btn">
                            View Code
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    const imgWrappers = grid.querySelectorAll(".image-wrapper");
    imgWrappers.forEach((wrapper) => {
        wrapper.addEventListener("click", () => {
            const imgUrl = wrapper.getAttribute("data-full-img") || "";
            const cap = wrapper.getAttribute("data-caption") || "";
            if (imgUrl) {
                openImageModal(imgUrl, cap);
            }
        });
    });
}

function renderReviewsAndSecondaryRepos(reviews) {
    const ratingBox = document.getElementById("rating-summary-box");
    const reviewsList = document.getElementById("reviews-list-box");
    const secondaryBox = document.getElementById("secondary-repos-box");

    const stats = calculateRatingSummary(reviews);

    if (ratingBox) {
        ratingBox.innerHTML = `
            <div class="rating-score-block">
                <div class="score-number">${stats.averageScore}</div>
                <div class="score-meta">
                    <div class="stars-row">★★★★★</div>
                    <div class="score-sub">${stats.totalReviews} verified client reviews</div>
                </div>
            </div>
            <div class="rating-actions">
                <a href="https://senja.io/p/hwork/mEObN4K" target="_blank" rel="noopener noreferrer" class="neutral-btn">
                    Client Reviews (Senja)
                </a>
            </div>
        `;
    }

    if (reviewsList) {
        reviewsList.innerHTML = reviews.map(
            (rev) => `
            <div class="review-card">
                <div class="review-top">
                    <img src="${rev.avatarUrl}" alt="${rev.author}" class="review-avatar" />
                    <div class="review-author-info">
                        <div class="review-author-line">
                            <span class="review-author">${rev.author}</span>
                            <span class="review-stars">${"★".repeat(rev.rating)}</span>
                        </div>
                        <span class="review-handle">${rev.handle} • ${rev.date}</span>
                    </div>
                </div>
                <p class="review-text">"${rev.text}"</p>
            </div>
        `
        ).join("");
    }

    if (secondaryBox) {
        secondaryBox.innerHTML = SECONDARY_REPOS.map(
            (repo) => `
            <a href="${repo.githubUrl}" target="_blank" rel="noopener noreferrer" class="secondary-repo-item">
                <div class="sec-repo-top">
                    <span class="sec-repo-name">${repo.name}</span>
                    <span class="proj-badge">
                        <span class="lang-dot" style="background-color: ${repo.language.color}"></span>
                        ${repo.language.name}
                    </span>
                </div>
                <p class="sec-repo-desc">${repo.description}</p>
            </a>
        `
        ).join("");
    }
}

function initializeDashboard() {
    renderProfileSidebar();
    renderReviewsAndSecondaryRepos(CLIENT_REVIEWS);
    setupModalListeners();
    renderFlagshipProjects(FLAGSHIP_PROJECTS);
}

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
});
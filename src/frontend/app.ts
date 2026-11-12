import {
    AVATAR_IMAGE_URL,
    CLIENT_REVIEWS,
    CORE_LANGUAGES,
    FLAGSHIP_PROJECTS,
    SECONDARY_REPOS,
    SOCIAL_CONTACTS,
    TECH_STACK_TAGS
} from "./data.js";
import {
    ClientReview,
    FlagshipProject,
    LanguageBadge,
    RatingSummary,
    RuntimeAssetsManifest,
    SecondaryRepo,
    SocialContact
} from "./types.js";

function enforceVimeo1080p(rawUrl: string): string {
    if (!rawUrl) {
        return "";
    }
    if (rawUrl.includes("vimeo.com") && !rawUrl.includes("quality=")) {
        const separator: string = rawUrl.includes("?") ? "&" : "?";
        return `${rawUrl}${separator}quality=1080p`;
    }
    return rawUrl;
}

function calculateRatingSummary(reviews: ClientReview[]): RatingSummary {
    if (reviews.length === 0) {
        return { averageScore: "5.0", totalReviews: 0, fiveStarPercentage: 100 };
    }
    const totalScore: number = reviews.reduce((acc: number, item: ClientReview) => acc + item.rating, 0);
    const mean: number = totalScore / reviews.length;
    const fiveStarCount: number = reviews.filter((r: ClientReview) => r.rating === 5).length;
    const percentage: number = Math.round((fiveStarCount / reviews.length) * 100);

    return {
        averageScore: mean.toFixed(1),
        totalReviews: reviews.length,
        fiveStarPercentage: percentage
    };
}

function showToast(message: string): void {
    const toast: HTMLElement | null = document.getElementById("copy-toast");
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.add("visible");
    window.setTimeout(() => {
        toast.classList.remove("visible");
    }, 2200);
}

function openImageModal(imageUrl: string, caption: string): void {
    const modal: HTMLElement | null = document.getElementById("image-modal");
    const modalImg: HTMLImageElement | null = document.getElementById("modal-img") as HTMLImageElement | null;
    const modalCaption: HTMLElement | null = document.getElementById("modal-caption");
    if (!modal || !modalImg || !modalCaption) {
        return;
    }
    modalImg.src = imageUrl;
    modalCaption.textContent = caption;
    modal.classList.add("open");
}

function setupModalListeners(): void {
    const modal: HTMLElement | null = document.getElementById("image-modal");
    const closeBtn: HTMLElement | null = document.getElementById("modal-close");
    if (modal) {
        modal.addEventListener("click", (ev: MouseEvent) => {
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

function renderProfileSidebar(): void {
    const avatarImg: HTMLImageElement | null = document.getElementById("profile-avatar-img") as HTMLImageElement | null;
    const langContainer: HTMLElement | null = document.getElementById("core-languages-bar");
    const stackContainer: HTMLElement | null = document.getElementById("tech-stack-bar");
    const socialContainer: HTMLElement | null = document.getElementById("social-links-bar");

    if (avatarImg && AVATAR_IMAGE_URL) {
        avatarImg.src = AVATAR_IMAGE_URL;
    }

    if (langContainer) {
        langContainer.innerHTML = CORE_LANGUAGES.map(
            (lang: LanguageBadge) => `
            <span class="lang-pill">
                <span class="lang-dot" style="background-color: ${lang.color}"></span>
                ${lang.name}
            </span>
        `
        ).join("");
    }

    if (stackContainer) {
        stackContainer.innerHTML = TECH_STACK_TAGS.map(
            (tag: string) => `<span class="stack-tag">${tag}</span>`
        ).join("");
    }

    if (socialContainer) {
        socialContainer.innerHTML = SOCIAL_CONTACTS.map((contact: SocialContact) => {
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

        const copyButtons: NodeListOf<Element> = socialContainer.querySelectorAll("[data-copy]");
        copyButtons.forEach((btn: Element) => {
            btn.addEventListener("click", () => {
                const copyVal: string = btn.getAttribute("data-copy") || "";
                const handleEl: Element | null = btn.querySelector(".tg-contact-handle");
                if (copyVal && navigator.clipboard) {
                    navigator.clipboard.writeText(copyVal).catch(() => {});
                    showToast(`Discord username copied: ${copyVal}`);
                    if (handleEl) {
                        const originalText: string | null = handleEl.textContent;
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

function buildMediaMarkup(project: FlagshipProject): string {
    if (project.mediaType === "video" && project.mediaUrl) {
        const hdVideoUrl: string = enforceVimeo1080p(project.mediaUrl);
        return `
            <div class="media-frame video-wrapper">
                <iframe src="${hdVideoUrl}" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowfullscreen 
                        loading="lazy"
                        title="${project.title}"></iframe>
            </div>
        `;
    }
    const imgSrc: string = project.mediaUrl || "assets/osint_preview.jpg";
    return `
        <div class="media-frame image-wrapper" data-full-img="${imgSrc}" data-caption="${project.title}">
            <img src="${imgSrc}" alt="${project.title}" loading="lazy" />
            <div class="zoom-badge">Click to Expand</div>
        </div>
    `;
}

function renderFlagshipProjects(projects: FlagshipProject[]): void {
    const grid: HTMLElement | null = document.getElementById("flagship-grid");
    if (!grid) {
        return;
    }

    grid.innerHTML = projects.map((proj: FlagshipProject) => {
        const badgesHtml: string = proj.languages.map(
            (l: LanguageBadge) => `
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

    const imgWrappers: NodeListOf<Element> = grid.querySelectorAll(".image-wrapper");
    imgWrappers.forEach((wrapper: Element) => {
        wrapper.addEventListener("click", () => {
            const imgUrl: string = wrapper.getAttribute("data-full-img") || "";
            const cap: string = wrapper.getAttribute("data-caption") || "";
            if (imgUrl) {
                openImageModal(imgUrl, cap);
            }
        });
    });
}

function renderReviewsAndSecondaryRepos(reviews: ClientReview[]): void {
    const ratingBox: HTMLElement | null = document.getElementById("rating-summary-box");
    const reviewsList: HTMLElement | null = document.getElementById("reviews-list-box");
    const secondaryBox: HTMLElement | null = document.getElementById("secondary-repos-box");

    const stats: RatingSummary = calculateRatingSummary(reviews);

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
            (rev: ClientReview) => `
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
            (repo: SecondaryRepo) => `
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

async function initializeDashboard(): Promise<void> {
    renderProfileSidebar();
    renderReviewsAndSecondaryRepos(CLIENT_REVIEWS);
    setupModalListeners();

    try {
        const resp: Response = await fetch("dist/runtime_assets.json", { cache: "no-store" });
        if (resp.ok) {
            const manifest: RuntimeAssetsManifest = (await resp.json()) as RuntimeAssetsManifest;
            FLAGSHIP_PROJECTS.forEach((proj: FlagshipProject) => {
                if (proj.id === "ebay" && !proj.mediaUrl && manifest.ebay_video_url) {
                    proj.mediaUrl = manifest.ebay_video_url;
                } else if (proj.id === "fragment" && !proj.mediaUrl && manifest.fragment_video_url) {
                    proj.mediaUrl = manifest.fragment_video_url;
                } else if (proj.id === "osint" && !proj.mediaUrl && manifest.osint_image_url) {
                    proj.mediaUrl = manifest.osint_image_url;
                }
            });
        }
    } catch {
    }

    renderFlagshipProjects(FLAGSHIP_PROJECTS);
}

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard().catch(() => {});
});
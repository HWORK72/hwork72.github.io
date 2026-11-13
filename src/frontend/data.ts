import { ClientReview, FlagshipProject, LanguageBadge, SecondaryRepo, SocialContact } from "./types.js";

export const AVATAR_IMAGE_URL: string = "assets/avatar.png";
export const CUSTOM_EBAY_VIDEO_URL: string = "";
export const CUSTOM_FRAGMENT_VIDEO_URL: string = "";
export const CUSTOM_OSINT_VIDEO_URL: string = "https://vimeo.com/1246288462?share=copy&fl=sv&fe=ci";

export const CORE_LANGUAGES: LanguageBadge[] = [
    { name: "Python", color: "#3572A5" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Rust", color: "#DEA584" },
    { name: "C# (.NET)", color: "#178600" },
    { name: "Java", color: "#B07219" },
    { name: "Lua", color: "#38bdf8" }
];

export const TECH_STACK_TAGS: string[] = [
    "FastAPI",
    "Pydantic v2",
    "PostgreSQL (SQLAlchemy 2.0)",
    "Redis",
    "Docker",
    "Playwright (CDP)",
    "curl_cffi (JA4 / WAF Bypass)",
    "BGP ASN & CDN Telemetry",
    "Aiogram 3.x",
    "discord.py",
    "TON Blockchain",
    "RapidFuzz",
    "LLM APIs",
    "React & Next.js",
    "Tailwind CSS",
    "Electron",
    "Chrome Extensions (MV3)",
    "Apify / Crawlee",
    "Tokio",
    "Reqwest & Serde",
    ".NET 8 (WPF / Win32 API)",
    "Forge / Fabric / Paper",
    "Roblox Studio (Luau)",
    "n8n & Make"
];

export const FLAGSHIP_PROJECTS: FlagshipProject[] = [
    {
        id: "ebay",
        title: "eBay Market & Price Scraper",
        subtitle: "",
        description: "Production asynchronous catalog scraper extracting real-time pricing intelligence, seller metrics, and item conditions while bypassing Akamai Edge WAF via TLS/JA4 fingerprint spoofing and proxy rotation.",
        githubUrl: "https://github.com/HWORK72/eBay-Market-Scraper",
        mediaType: "video",
        mediaUrl: CUSTOM_EBAY_VIDEO_URL,
        languages: [
            { name: "Python", color: "#3572A5" },
            { name: "curl_cffi", color: "#8e918f" },
            { name: "Akamai Bypass", color: "#8e918f" }
        ]
    },
    {
        id: "fragment",
        title: "Fragment NFT Trading Agent",
        subtitle: "",
        description: "High-frequency sniper bot and desktop control suite monitoring live auctions and executing instant bids on undervalued Telegram Gifts, usernames, and numbers on the TON Blockchain.",
        githubUrl: "https://github.com/HWORK72/Fragment-NFT-Trading-Agent",
        mediaType: "video",
        mediaUrl: CUSTOM_FRAGMENT_VIDEO_URL,
        languages: [
            { name: "C# (.NET)", color: "#178600" },
            { name: "Python", color: "#3572A5" },
            { name: "TON Blockchain", color: "#8e918f" }
        ]
    },
    {
        id: "osint",
        title: "OSINT Threat Intelligence Engine",
        subtitle: "",
        description: "High-throughput reconnaissance microservice and web dashboard analyzing IPs, domains, open ports, and emails across Shodan, AlienVault OTX, and BGP ASN telemetry in real-time.",
        githubUrl: "https://github.com/HWORK72/OSINT-Threat-Detector",
        mediaType: "video",
        mediaUrl: CUSTOM_OSINT_VIDEO_URL,
        languages: [
            { name: "TypeScript", color: "#3178C6" },
            { name: "FastAPI", color: "#8e918f" },
            { name: "PostgreSQL & Redis", color: "#8e918f" }
        ]
    }
];

export const SECONDARY_REPOS: SecondaryRepo[] = [
    {
        name: "Proxy-Edge-Profiler",
        description: "High-speed L3/L4/L7 proxy profiler and Anycast CDN PoP analyzer evaluating Cloudflare routing, BGP ASN fraud scores, and subnet ban risks.",
        githubUrl: "https://github.com/HWORK72/Proxy-Edge-Profiler",
        language: { name: "Rust", color: "#DEA584" }
    },
    {
        name: "ShieldMod",
        description: "Voice-activated Minecraft equipment controller bridging a background Python speech recognition listener with a native Java mod over local IPC sockets.",
        githubUrl: "https://github.com/HWORK72/ShieldMod",
        language: { name: "Java", color: "#B07219" }
    },
    {
        name: "AntiBot-Fingerprint-Prober",
        description: "Multi-layer stealth diagnostic benchmark evaluating automated browsers and scrapers for TLS (JA3/JA4), HTTP/2 frame, and CDP fingerprint leaks.",
        githubUrl: "https://github.com/HWORK72/AntiBot-Fingerprint-Prober",
        language: { name: "Lua", color: "#38bdf8" }
    }
];

export const CLIENT_REVIEWS: ClientReview[] = [
    {
        id: "rev-1",
        author: "baby_cat",
        handle: "Discord: s_cat_003",
        platform: "Freelancer Server",
        date: "Oct 24, 2026",
        rating: 5,
        avatarUrl: "https://cdn.senja.io/public/avatar/baf5f36b-d28f-477a-8d47-35b81b48aaa9.jpg?width=84&height=84&format=webp",
        text: "Good coder, made a Roblox captcha solver for me and account generator. Paid him only after a video demo, very polite and friendly man."
    },
    {
        id: "rev-2",
        author: "W3INK",
        handle: "TG: @W3INK_Dsgn",
        platform: "w3ink.netlify.app",
        date: "Sep 24, 2026",
        rating: 5,
        avatarUrl: "https://cdn.senja.io/public/avatar/6653b7db-6ce3-4e9d-8b8a-0f9c861f201b_photo_2026-09-03_04-52-54.jpg?width=84&height=84&format=webp",
        text: "HWORK72 built the Python backend and AI pipeline for my Telegram mockup generator bot. The integration works flawlessly, generation speed is great. Great developer to work with.",
        externalUrl: "https://w3ink.netlify.app/"
    }
];

export const SOCIAL_CONTACTS: SocialContact[] = [
    {
        label: "GitHub",
        handle: "HWORK72",
        url: "https://github.com/HWORK72",
        accentColor: "#8e918f"
    },
    {
        label: "Telegram",
        handle: "@HWORK72",
        url: "https://t.me/HWORK72",
        accentColor: "#8e918f"
    },
    {
        label: "TG Channel",
        handle: "@hwork72_port",
        url: "https://t.me/hwork72_port",
        accentColor: "#8e918f"
    },
    {
        label: "Discord (Copy)",
        handle: "hwork72",
        url: "",
        accentColor: "#8e918f",
        copyValue: "hwork72"
    },
    {
        label: "X (Twitter)",
        handle: "@hwork72",
        url: "https://x.com/hwork72",
        accentColor: "#8e918f"
    },
    {
        label: "YouTube",
        handle: "@hwork72",
        url: "https://www.youtube.com/@hwork72",
        accentColor: "#8e918f"
    }
];
import json
from pathlib import Path
from typing import Dict, List
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from curl_cffi import requests
from src.core.logger import BASE_DIR, logger


def ensure_vimeo_1080p(video_url: str) -> str:
    if not video_url:
        return ""
    if "vimeo.com" in video_url and "quality=" not in video_url:
        sep: str = "&" if "?" in video_url else "?"
        return f"{video_url}{sep}quality=1080p"
    return video_url


def sync_carrd_media_assets(carrd_url: str) -> Dict[str, str]:
    dist_dir: Path = BASE_DIR / "dist"
    assets_dir: Path = BASE_DIR / "assets"
    dist_dir.mkdir(parents=True, exist_ok=True)
    assets_dir.mkdir(parents=True, exist_ok=True)

    avatar_path: Path = assets_dir / "avatar.png"
    if not avatar_path.exists():
        try:
            logger.info("Downloading default profile avatar from GitHub HWORK72...")
            av_resp = requests.get("https://github.com/HWORK72.png", impersonate="chrome124", timeout=15)
            if av_resp.status_code == 200:
                avatar_path.write_bytes(av_resp.content)
                logger.info(f"Saved avatar to {avatar_path}")
        except Exception as exc:
            logger.warning(f"Could not download GitHub avatar: {exc}")

    discovered_assets: Dict[str, str] = {
        "ebay_video_url": "",
        "fragment_video_url": "",
        "osint_image_url": "assets/osint_preview.jpg"
    }

    try:
        logger.info(f"Fetching media embeds from {carrd_url}")
        response = requests.get(carrd_url, impersonate="chrome124", timeout=20)
        if response.status_code == 200:
            soup: BeautifulSoup = BeautifulSoup(response.text, "html.parser")
            iframes = soup.find_all("iframe")
            video_urls: List[str] = []
            for frame in iframes:
                src_val: str = str(frame.get("data-src") or frame.get("src") or "").strip()
                if src_val:
                    video_urls.append(ensure_vimeo_1080p(src_val))

            if len(video_urls) >= 1:
                discovered_assets["ebay_video_url"] = video_urls[0]
                logger.info(f"Extracted eBay Scraper 1080p video embed: {video_urls[0]}")
            if len(video_urls) >= 2:
                discovered_assets["fragment_video_url"] = video_urls[1]
                logger.info(f"Extracted Fragment Agent 1080p video embed: {video_urls[1]}")

            local_img_path: Path = assets_dir / "osint_preview.jpg"
            if not local_img_path.exists():
                img_tag = soup.find("img", src=lambda s: s is not None and "image01" in str(s))
                img_rel_src: str = str(img_tag.get("src")) if img_tag else "assets/images/image01.jpg"
                full_img_url: str = urljoin(carrd_url.rstrip("/") + "/", img_rel_src)

                img_resp = requests.get(full_img_url, impersonate="chrome124", timeout=20)
                if img_resp.status_code == 200:
                    local_img_path.write_bytes(img_resp.content)
                    logger.info(f"Downloaded OSINT preview image to {local_img_path}")
        else:
            logger.warning(f"Carrd responded with status code {response.status_code}")
    except Exception as exc:
        logger.error(f"Error syncing Carrd media assets: {exc}", exc_info=True)

    runtime_json_path: Path = dist_dir / "runtime_assets.json"
    try:
        runtime_json_path.write_text(json.dumps(discovered_assets, indent=2), encoding="utf-8")
        logger.info(f"Saved runtime media manifest to {runtime_json_path}")
    except Exception as exc:
        logger.error(f"Failed writing runtime_assets.json: {exc}", exc_info=True)

    return discovered_assets
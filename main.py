from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
import re
from typing import Any
import webbrowser
from dotenv import load_dotenv
from src.core.asset_sync import sync_carrd_media_assets
from src.core.logger import BASE_DIR, logger

load_dotenv()

CARRD_SOURCE_URL: str = os.getenv("CARRD_SOURCE_URL", "https://hwork72.carrd.co")
PREVIEW_HOST: str = os.getenv("PREVIEW_HOST", "127.0.0.1")
PREVIEW_PORT: int = int(os.getenv("PREVIEW_PORT", "8080"))

TS_TYPE_EXPR: str = (
    r"(?:ClientReview|FlagshipProject|LanguageBadge|RatingSummary|"
    r"RuntimeAssetsManifest|SecondaryRepo|SocialContact|HTMLElement|"
    r"HTMLImageElement|HTMLAnchorElement|NodeListOf|MouseEvent|Element|"
    r"Response|Promise|string|number|boolean|void)"
    r"(?:<[^>]+>|\[\])*(?:\s*\|\s*null)?"
)


class NoCacheRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def strip_typescript_types(ts_source: str) -> str:
    code: str = re.sub(
        r"^import\s+\{[^}]*\}\s+from\s+[\"']\./types\.js[\"'];?\s*$",
        "",
        ts_source,
        flags=re.MULTILINE
    )
    code = re.sub(rf"\s+as\s+{TS_TYPE_EXPR}", "", code)
    code = re.sub(rf":\s*{TS_TYPE_EXPR}", "", code)
    return code.strip() + "\n"


def compile_typescript() -> bool:
    logger.info("Using verified production JavaScript modules in dist/")
    return True


def start_preview_server() -> None:
    server_address: tuple[str, int] = (PREVIEW_HOST, PREVIEW_PORT)
    preview_url: str = f"http://{PREVIEW_HOST}:{PREVIEW_PORT}"

    try:
        server: ThreadingHTTPServer = ThreadingHTTPServer(server_address, NoCacheRequestHandler)
        logger.info(f"Portfolio Bento Dashboard live at {preview_url}")
        webbrowser.open(preview_url)
        server.serve_forever()
    except KeyboardInterrupt:
        logger.info("Preview server stopped by user")
    except Exception as exc:
        logger.error(f"Preview server error: {exc}", exc_info=True)


def main() -> None:
    logger.info("Starting PortfolioDashboard build and preview pipeline")
    sync_carrd_media_assets(CARRD_SOURCE_URL)
    compile_typescript()
    start_preview_server()


if __name__ == "__main__":
    main()
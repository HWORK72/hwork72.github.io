import logging
from pathlib import Path
import sys
from typing import TextIO

BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
LOG_FILE_PATH: Path = BASE_DIR / "logs.txt"


class ImmediateFileHandler(logging.FileHandler):
    def __init__(self, filename: Path, mode: str = "w", encoding: str = "utf-8", delay: bool = False) -> None:
        super().__init__(filename, mode=mode, encoding=encoding, delay=delay)

    def emit(self, record: logging.LogRecord) -> None:
        super().emit(record)
        self.flush()


class StreamToLogger:
    def __init__(self, target_logger: logging.Logger, log_level: int, original_stream: TextIO) -> None:
        self._logger: logging.Logger = target_logger
        self._log_level: int = log_level
        self._original_stream: TextIO = original_stream

    def write(self, buffer: str) -> int:
        if self._original_stream:
            self._original_stream.write(buffer)
            self._original_stream.flush()
        for line in buffer.rstrip().splitlines():
            clean_line: str = line.strip()
            if clean_line:
                self._logger.log(self._log_level, clean_line)
        return len(buffer)

    def flush(self) -> None:
        if self._original_stream:
            self._original_stream.flush()


def _create_singleton_logger() -> logging.Logger:
    root_logger: logging.Logger = logging.getLogger("PortfolioDashboard")
    root_logger.setLevel(logging.INFO)
    root_logger.propagate = False

    if root_logger.handlers:
        root_logger.handlers.clear()

    formatter: logging.Formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    file_handler: ImmediateFileHandler = ImmediateFileHandler(
        filename=LOG_FILE_PATH,
        mode="w",
        encoding="utf-8",
        delay=False
    )
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)

    sys.stdout = StreamToLogger(root_logger, logging.INFO, sys.__stdout__)
    sys.stderr = StreamToLogger(root_logger, logging.ERROR, sys.__stderr__)

    return root_logger


logger: logging.Logger = _create_singleton_logger()
import logging

class IgnoreBrokenPipe(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return "Broken pipe" not in record.getMessage()
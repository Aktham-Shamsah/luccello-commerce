type LogMeta = Record<string, string | number | boolean | undefined>;

export const logger = {
  info(message: string, meta: LogMeta = {}) {
    console.info(JSON.stringify({ level: "info", message, ...meta }));
  },
  warn(message: string, meta: LogMeta = {}) {
    console.warn(JSON.stringify({ level: "warn", message, ...meta }));
  },
  error(message: string, meta: LogMeta = {}) {
    console.error(JSON.stringify({ level: "error", message, ...meta }));
  },
};

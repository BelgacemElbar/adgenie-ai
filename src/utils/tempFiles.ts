import os from "os";
import path from "path";

export function createTempFilePath(prefix: string, extension: string): string {
  const safeExtension = extension.replace(/^\.+/, "");
  const uniqueId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return path.join(os.tmpdir(), `${prefix}-${uniqueId}${safeExtension ? `.${safeExtension}` : ""}`);
}

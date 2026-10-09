import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export const uploadDirectory = path.resolve(process.cwd(), "uploads");

export type ImageUploadInput = {
  contentType: string;
  dataBase64: string;
};

export async function saveAdminImage(input: ImageUploadInput, _publicBaseUrl: string) {
  const extension = allowedTypes.get(input.contentType);
  if (!extension) throw new Error("unsupported_image_type");
  const buffer = Buffer.from(input.dataBase64, "base64");
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw new Error("image_size_invalid");
  const signatureValid =
    (input.contentType === "image/jpeg" &&
      buffer.length > 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff) ||
    (input.contentType === "image/png" &&
      buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (input.contentType === "image/webp" &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP") ||
    (input.contentType === "image/gif" &&
      ["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6)));
  if (!signatureValid) throw new Error("invalid_image_signature");
  await mkdir(uploadDirectory, { recursive: true });
  const fileName = `${randomUUID()}${extension}`;
  await writeFile(path.join(uploadDirectory, fileName), buffer, { flag: "wx" });
  return `/backend/uploads/${fileName}`;
}

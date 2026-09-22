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

export async function saveAdminImage(input: ImageUploadInput, publicBaseUrl: string) {
  const extension = allowedTypes.get(input.contentType);
  if (!extension) throw new Error("unsupported_image_type");
  const buffer = Buffer.from(input.dataBase64, "base64");
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw new Error("image_size_invalid");
  await mkdir(uploadDirectory, { recursive: true });
  const fileName = `${randomUUID()}${extension}`;
  await writeFile(path.join(uploadDirectory, fileName), buffer, { flag: "wx" });
  return `${publicBaseUrl.replace(/\/$/, "")}/uploads/${fileName}`;
}

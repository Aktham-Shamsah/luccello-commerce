import { desc, eq } from "drizzle-orm";
import { banners } from "@luccello/database";
import { getDatabase } from "../../shared/database/client.js";

export async function listEnabledBanners() {
  return getDatabase()
    .select()
    .from(banners)
    .where(eq(banners.enabled, true))
    .orderBy(desc(banners.updatedAt));
}
